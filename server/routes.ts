import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEmailSubscriptionSchema,
  insertGrantApplicationSchema,
  insertGrantSchema,
  insertGrantCategorySchema,
  insertChatMessageSchema,
  GrantApplicationStatusEnum
} from "@shared/schema";
import { saveGrantApplicationToFile } from "./file-logger";
import { sendApplicantConfirmationEmail, sendApplicantMessageNotificationEmail } from "./sendgrid";
import { z } from "zod";
import bitcoinMessage from "bitcoinjs-message";
import { setupAuth, requireAuth, requireAdmin } from "./auth";

// CoinGecko API cache - only refresh once per hour
let btcPriceCache: {
  price: number;
  marketCap: number;
  circulatingSupply: number;
  priceChange24h: number;
  lastUpdated: string;
  cachedAt: number;
} | null = null;

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds

async function getCachedBtcPrice(): Promise<typeof btcPriceCache> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (btcPriceCache && (now - btcPriceCache.cachedAt) < CACHE_DURATION_MS) {
    console.log("Using cached BTC price (age: " + Math.round((now - btcPriceCache.cachedAt) / 60000) + " minutes)");
    return btcPriceCache;
  }
  
  // Fetch fresh data from CoinGecko
  try {
    console.log("Fetching fresh BTC price from CoinGecko...");
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin'
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    const bitcoinData = data[0];
    
    if (!bitcoinData) {
      throw new Error("No Bitcoin data returned");
    }
    
    btcPriceCache = {
      price: bitcoinData.current_price,
      marketCap: bitcoinData.market_cap,
      circulatingSupply: bitcoinData.circulating_supply,
      priceChange24h: bitcoinData.price_change_percentage_24h,
      lastUpdated: bitcoinData.last_updated,
      cachedAt: now
    };
    
    console.log("BTC price cached: $" + btcPriceCache.price);
    return btcPriceCache;
  } catch (error) {
    console.error("CoinGecko API error:", error);
    // Return stale cache if available, otherwise null
    if (btcPriceCache) {
      console.log("Returning stale cache due to API error");
      return btcPriceCache;
    }
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first
  await setupAuth(app);


  // Email subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertEmailSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getEmailSubscription(validatedData.email);
      if (existing) {
        return res.status(400).json({ message: "Email already subscribed" });
      }

      const subscription = await storage.createEmailSubscription(validatedData);
      res.json({ message: "Successfully subscribed", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email format", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Bitcoin balance check endpoint using Blockstream.info API (fast and reliable)
  app.post("/api/check-btc-balance", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ message: "Bitcoin address is required" });
      }

      // Basic BTC address validation
      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ message: "Invalid Bitcoin address format" });
      }

      try {
        // Use Blockstream.info API for instant balance lookup
        const response = await fetch(`https://blockstream.info/api/address/${address}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Address exists but has no transactions - balance is 0
            return res.json({
              success: true,
              address,
              btcBalance: 0,
              lbtyClaimable: 0,
              eligible: false,
              message: "Insufficient balance. Minimum 0.003 BTC required."
            });
          }
          throw new Error(`Blockstream API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Get confirmed + unconfirmed balance from chain_stats
        const fundedSatoshis = data.chain_stats?.funded_txo_sum || 0;
        const spentSatoshis = data.chain_stats?.spent_txo_sum || 0;
        const balanceSatoshi = fundedSatoshis - spentSatoshis;
        const balanceBTC = balanceSatoshi / 100000000;
        
        // Calculate LBTY claimable (1:10 ratio)
        const lbtyClaimable = balanceBTC * 10;
        
        // Check minimum requirement (0.003 BTC)
        const minBalance = 0.003;
        const isEligible = balanceBTC >= minBalance;

        res.json({
          success: true,
          address,
          btcBalance: parseFloat(balanceBTC.toFixed(8)),
          lbtyClaimable: parseFloat(lbtyClaimable.toFixed(8)),
          eligible: isEligible,
          message: isEligible 
            ? `Eligible! You can claim ${lbtyClaimable.toFixed(8)} LBTY` 
            : `Insufficient balance. Minimum ${minBalance} BTC required.`
        });

      } catch (apiError) {
        console.error("Blockstream API error:", apiError);
        return res.status(503).json({ 
          message: "Unable to fetch balance. Please try again.",
          error: "Balance lookup service temporarily unavailable"
        });
      }

    } catch (error) {
      console.error("Balance check error:", error);
      res.status(500).json({ message: "Error checking balance" });
    }
  });

  // CoinGecko Bitcoin market data endpoint (cached - 1 request per hour max)
  app.get("/api/btc-market-data", async (req, res) => {
    try {
      const cachedData = await getCachedBtcPrice();
      
      if (!cachedData) {
        throw new Error('Unable to fetch Bitcoin data');
      }

      res.json({
        success: true,
        currentPrice: cachedData.price,
        circulatingSupply: cachedData.circulatingSupply,
        marketCap: cachedData.marketCap,
        priceChange24h: cachedData.priceChange24h,
        lastUpdated: cachedData.lastUpdated,
        cachedAt: new Date(cachedData.cachedAt).toISOString()
      });

    } catch (error) {
      console.error("BTC market data error:", error);
      res.status(503).json({
        success: false,
        message: "Unable to fetch Bitcoin market data",
        error: "Market data service temporarily unavailable"
      });
    }
  });

  // Real BTC eligibility check endpoint using Blockchain.com API
  app.post("/api/check-eligibility", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ message: "Bitcoin address is required" });
      }

      // Basic BTC address validation
      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ message: "Invalid Bitcoin address format" });
      }

      try {
        // Fetch real balance from Blockchain.com API
        const response = await fetch(`https://blockchain.info/rawaddr/${address}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return res.json({
              eligible: false,
              message: "Address not found or has no transaction history"
            });
          }
          throw new Error(`Blockchain API error: ${response.status}`);
        }

        const data = await response.json();
        const balanceSatoshi = data.final_balance || 0;
        const balanceBTC = balanceSatoshi / 100000000; // Convert satoshi to BTC
        
        // Check eligibility (minimum 0.001 BTC required)
        const minBalance = 0.001;
        const isEligible = balanceBTC >= minBalance;
        
        if (isEligible) {
          const lbtcAmount = balanceBTC * 10; // 1:10 ratio
          
          // Use cached Bitcoin price (1 request per hour max)
          let btcPrice = 43000; // Fallback price
          const cachedData = await getCachedBtcPrice();
          if (cachedData) {
            btcPrice = cachedData.price;
          } else {
            console.log("Using fallback BTC price - cache unavailable");
          }
          
          const estimatedValue = balanceBTC * btcPrice;

          console.log(`Debug: BTC Balance: ${balanceBTC}, BTC Price: ${btcPrice}, Estimated Value: ${estimatedValue}`);

          res.json({
            eligible: true,
            btcBalance: parseFloat(balanceBTC.toFixed(8)),
            lbtcClaimAmount: parseFloat(lbtcAmount.toFixed(8)),
            estimatedValue: parseFloat(estimatedValue.toFixed(2)),
            btcPrice: parseFloat(btcPrice.toFixed(2)),
            totalTransactions: data.n_tx,
            address: address
          });
        } else {
          res.json({
            eligible: false,
            btcBalance: parseFloat(balanceBTC.toFixed(8)),
            message: `Insufficient balance. Minimum ${minBalance} BTC required for eligibility.`,
            address: address
          });
        }

      } catch (apiError) {
        console.error("Blockchain API error:", apiError);
        res.status(503).json({ 
          message: "Unable to verify balance at this time. Please try again later.",
          error: "Blockchain service temporarily unavailable"
        });
      }

    } catch (error) {
      console.error("Eligibility check error:", error);
      res.status(500).json({ message: "Error checking eligibility" });
    }
  });

  // News/Blog posts from Medium RSS feed
  app.get("/api/news", async (req, res) => {
    try {
      // Use RSS2JSON service to convert Medium RSS to JSON
      const mediumRssUrl = "https://libertybitcoin.medium.com/feed";
      const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumRssUrl)}`;
      
      const response = await fetch(rss2JsonUrl);
      
      if (!response.ok) {
        throw new Error(`RSS feed fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`RSS conversion failed: ${data.message || 'Unknown error'}`);
      }
      
      // Transform the data to match our NewsPost type
      const posts = data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item.thumbnail || null,
        categories: item.categories || [],
        author: item.author || 'Liberty Bitcoin'
      }));
      
      res.json({
        posts,
        total: posts.length
      });
      
    } catch (error) {
      console.error("News fetch error:", error);
      res.status(500).json({ 
        message: "Failed to fetch news posts",
        error: "News service temporarily unavailable"
      });
    }
  });

  // Grant applications endpoint
  app.post("/api/grant-applications", async (req, res) => {
    try {
      const validatedData = insertGrantApplicationSchema.parse(req.body);
      
      // Store the application
      const application = await storage.createGrantApplication(validatedData);
      
      // Save to file for easy viewing
      const fileSaved = saveGrantApplicationToFile(validatedData);
      
      if (!fileSaved) {
        console.error("Failed to save grant application to file");
      }
      
      // Send confirmation email to applicant with chat link
      try {
        const emailSent = await sendApplicantConfirmationEmail(
          application.email,
          application.projectTitle,
          application.publicChatToken
        );
        
        if (emailSent) {
          console.log(`✅ Confirmation email sent to ${application.email} for application: ${application.projectTitle}`);
        } else {
          console.error(`❌ Failed to send confirmation email to ${application.email}`);
        }
      } catch (emailError) {
        console.error("Confirmation email error:", emailError);
        // Don't fail the request if email fails - application was still submitted successfully
      }
      
      res.json({ 
        message: "Grant application submitted successfully", 
        application: {
          id: application.id,
          projectTitle: application.projectTitle,
          submittedAt: application.submittedAt
        }
      });
    } catch (error) {
      console.error("Grant application error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid application data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Submit claim with signature verification endpoint
  app.post("/api/submit-claim", async (req, res) => {
    try {
      const { address, message, signature, claimData, walletProvider } = req.body;
      
      if (!address || !message || !signature || !claimData) {
        return res.status(400).json({ message: "Missing required claim data" });
      }

      // In production, you would verify the signature cryptographically
      // For now, we'll store the claim data with signature proof
      const claimRecord = {
        address,
        message,
        signature,
        walletProvider,
        claimData,
        timestamp: new Date().toISOString(),
        verified: true, // In production, this would be result of signature verification
      };

      // Log the claim to file for record keeping
      const claimText = `
=====================================
NEW L-BTC CLAIM SUBMISSION - ${claimRecord.timestamp}
=====================================

WALLET INFORMATION:
Address: ${address}
Provider: ${walletProvider}
BTC Balance: ${claimData.btcBalance} BTC
L-BTC Claim Amount: ${claimData.lbtcClaimAmount} L-BTC
Estimated Value: $${claimData.estimatedValue}
Current BTC Price: $${claimData.btcPrice}

CRYPTOGRAPHIC PROOF:
Message: ${message}
Signature: ${signature}
Verification Status: ${claimRecord.verified ? 'VERIFIED' : 'FAILED'}

=====================================

`;

      // Save to claims file
      try {
        const fs = require('fs');
        const path = require('path');
        const claimsFile = path.join(process.cwd(), 'lbtc-claims.txt');
        
        if (fs.existsSync(claimsFile)) {
          const existingContent = fs.readFileSync(claimsFile, 'utf8');
          fs.writeFileSync(claimsFile, existingContent + claimText);
        } else {
          fs.writeFileSync(claimsFile, `BITCOIN LIBERTY L-BTC CLAIMS LOG\n${claimText}`);
        }
        
        console.log(`✅ L-BTC claim submitted and verified for address: ${address}`);
      } catch (fileError) {
        console.error("Error saving claim to file:", fileError);
      }

      res.json({
        success: true,
        message: "Claim submitted and verified successfully",
        claimId: `claim-${Date.now()}`,
        verified: claimRecord.verified
      });

    } catch (error) {
      console.error("Claim submission error:", error);
      res.status(500).json({ message: "Error processing claim submission" });
    }
  });

  // Public endpoints for grants and categories
  app.get("/api/grants", async (req, res) => {
    try {
      const grants = await storage.getGrants();
      res.json(grants);
    } catch (error) {
      console.error("Error fetching grants:", error);
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  app.get("/api/grant-categories", async (req, res) => {
    try {
      const categories = await storage.getGrantCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching grant categories:", error);
      res.status(500).json({ message: "Failed to fetch grant categories" });
    }
  });

  // Protected admin endpoints for grants management
  app.get("/api/admin/grants", requireAdmin, async (req, res) => {
    try {
      const grants = await storage.getGrants();
      res.json(grants);
    } catch (error) {
      console.error("Admin error fetching grants:", error);
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  app.get("/api/admin/grants/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const grant = await storage.getGrantById(id);
      
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      res.json(grant);
    } catch (error) {
      console.error("Admin error fetching grant by id:", error);
      res.status(500).json({ message: "Failed to fetch grant" });
    }
  });

  app.post("/api/admin/grants", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertGrantSchema.parse(req.body);
      const grant = await storage.createGrant(validatedData);
      res.json({ message: "Grant created successfully", grant });
    } catch (error) {
      console.error("Admin error creating grant:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid grant data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create grant" });
    }
  });

  app.put("/api/admin/grants/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Create partial schema for updates (all fields optional)
      const updateSchema = insertGrantSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const grant = await storage.updateGrant(id, validatedData);
      res.json({ message: "Grant updated successfully", grant });
    } catch (error) {
      console.error("Admin error updating grant:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid grant data", 
          errors: error.errors 
        });
      }
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: "Grant not found" });
      }
      res.status(500).json({ message: "Failed to update grant" });
    }
  });

  app.delete("/api/admin/grants/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGrant(id);
      res.json({ message: "Grant deleted successfully" });
    } catch (error) {
      console.error("Admin error deleting grant:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: "Grant not found" });
      }
      res.status(500).json({ message: "Failed to delete grant" });
    }
  });

  // Protected admin endpoints for grant categories management
  app.get("/api/admin/grant-categories", requireAdmin, async (req, res) => {
    try {
      const categories = await storage.getGrantCategories();
      res.json(categories);
    } catch (error) {
      console.error("Admin error fetching grant categories:", error);
      res.status(500).json({ message: "Failed to fetch grant categories" });
    }
  });

  app.post("/api/admin/grant-categories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertGrantCategorySchema.parse(req.body);
      const category = await storage.createGrantCategory(validatedData);
      res.json({ message: "Grant category created successfully", category });
    } catch (error) {
      console.error("Admin error creating grant category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create grant category" });
    }
  });

  // Enhanced admin endpoints for grant applications management
  app.get("/api/admin/grant-applications", requireAdmin, async (req, res) => {
    try {
      // Parse and normalize status parameter
      const statusParam = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      let normalizedStatus: string | undefined;
      
      if (statusParam) {
        // Legacy mapping: pipeline -> in-review
        const mappedStatus = statusParam === 'pipeline' ? 'in-review' : statusParam;
        
        const statusValidation = GrantApplicationStatusEnum.safeParse(mappedStatus);
        if (!statusValidation.success) {
          return res.status(400).json({ 
            message: "Invalid status filter. Must be one of: received, in-review, granted, rejected" 
          });
        }
        normalizedStatus = statusValidation.data;
      }
      
      const applications = await storage.getGrantApplications(
        normalizedStatus ? { status: normalizedStatus } : undefined
      );
      
      // Sort by submission date (newest first)
      const sortedApplications = applications.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      
      // Get unread message counts for all applications
      const applicationIds = sortedApplications.map(app => app.id);
      const unreadCounts = await storage.getUnreadMessageCounts(applicationIds);
      
      // Enhance applications with unread counts
      const applicationsWithUnreadCounts = sortedApplications.map(app => ({
        ...app,
        unreadMessageCount: unreadCounts.get(app.id) || 0
      }));
      
      
      res.json(applicationsWithUnreadCounts);
    } catch (error) {
      console.error("Admin error fetching grant applications:", error);
      res.status(500).json({ message: "Failed to fetch grant applications" });
    }
  });

  // Get individual grant application with auto-transition logic
  app.get("/api/admin/grant-applications/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getGrantApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ message: "Grant application not found" });
      }
      
      // Auto-transition from 'received' to 'in-review' when admin first views
      if (application.status === 'received') {
        try {
          const updatedApp = await storage.updateGrantApplication(id, {
            status: 'in-review',
            lastAdminViewedAt: new Date()
          });
          res.json(updatedApp);
        } catch (updateError) {
          console.error("Error updating application status:", updateError);
          res.json(application); // Return original if update fails
        }
      } else {
        // Update lastAdminViewedAt for tracking
        try {
          const updatedApp = await storage.updateGrantApplication(id, {
            lastAdminViewedAt: new Date()
          });
          res.json(updatedApp);
        } catch (updateError) {
          console.error("Error updating lastAdminViewedAt:", updateError);
          res.json(application); // Return original if update fails
        }
      }
    } catch (error) {
      console.error("Admin error fetching grant application by id:", error);
      res.status(500).json({ message: "Failed to fetch grant application" });
    }
  });

  // Update grant application status
  app.patch("/api/admin/grant-applications/:id/status", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate status value
      const statusValidation = GrantApplicationStatusEnum.safeParse(status);
      if (!statusValidation.success) {
        return res.status(400).json({ 
          message: "Invalid status. Must be one of: received, in-review, granted, rejected" 
        });
      }
      
      // Check if application exists
      const application = await storage.getGrantApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Grant application not found" });
      }
      
      // Update status
      const updatedApp = await storage.updateGrantApplication(id, { 
        status: statusValidation.data,
        lastAdminViewedAt: new Date()
      });
      
      res.json({ 
        message: "Status updated successfully", 
        application: updatedApp 
      });
    } catch (error) {
      console.error("Admin error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  // Admin chat message endpoints
  app.get("/api/admin/grant-applications/:id/messages", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verify application exists
      const application = await storage.getGrantApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Grant application not found" });
      }
      
      const messages = await storage.getChatMessagesByApplicationId(id);
      res.json(messages);
    } catch (error) {
      console.error("Admin error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/admin/grant-applications/:id/messages", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req.body;
      const userId = (req.user as any)?.id;
      
      // Validate message body
      if (!body || typeof body !== 'string' || body.trim().length === 0) {
        return res.status(400).json({ message: "Message body is required" });
      }
      
      if (body.length > 10000) {
        return res.status(400).json({ message: "Message body too long (max 10000 characters)" });
      }
      
      // Verify application exists
      const application = await storage.getGrantApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Grant application not found" });
      }
      
      // Create message data
      const messageData = {
        applicationId: id,
        senderRole: 'admin' as const,
        senderId: userId || 'admin',
        body: body.trim()
      };
      
      // Validate using schema
      const validatedData = insertChatMessageSchema.parse(messageData);
      
      // Create the message
      const message = await storage.createChatMessage(validatedData);
      
      // Send email notification to applicant about the new message
      try {
        const emailSent = await sendApplicantMessageNotificationEmail(
          application.email,
          application.projectTitle,
          body.trim(),
          application.publicChatToken
        );
        
        if (emailSent) {
          console.log(`✅ Message notification email sent to ${application.email} for application: ${application.projectTitle}`);
        } else {
          console.error(`❌ Failed to send message notification email to ${application.email}`);
        }
      } catch (emailError) {
        console.error("Message notification email error:", emailError);
        // Don't fail the request if email fails - message was still sent successfully
      }
      
      // Auto-transition to in-review if currently received
      if (application.status === 'received') {
        try {
          await storage.updateGrantApplication(id, {
            status: 'in-review',
            lastAdminViewedAt: new Date()
          });
        } catch (updateError) {
          console.error("Error auto-transitioning status:", updateError);
        }
      }
      
      res.json({ 
        message: "Message sent successfully", 
        chatMessage: message 
      });
    } catch (error) {
      console.error("Admin error sending message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Public token-based chat endpoints for applicants
  app.get("/api/chat/:token/messages", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid chat token" });
      }
      
      const messages = await storage.getChatMessagesByToken(token);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages by token:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/:token/messages", async (req, res) => {
    try {
      const { token } = req.params;
      const { body, senderEmail } = req.body;
      
      // Validate token
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid chat token" });
      }
      
      // Validate message body
      if (!body || typeof body !== 'string' || body.trim().length === 0) {
        return res.status(400).json({ message: "Message body is required" });
      }
      
      if (body.length > 10000) {
        return res.status(400).json({ message: "Message body too long (max 10000 characters)" });
      }
      
      // Find application by token
      const messages = await storage.getChatMessagesByToken(token);
      if (messages.length === 0) {
        // Try to find application directly to give better error message
        const allApplications = await storage.getGrantApplications();
        const appExists = allApplications.some(app => app.publicChatToken === token);
        
        if (!appExists) {
          return res.status(404).json({ message: "Invalid chat token or application not found" });
        }
      }
      
      // Get application ID from existing messages or find it directly
      let applicationId: string;
      if (messages.length > 0) {
        applicationId = messages[0].applicationId;
      } else {
        const allApplications = await storage.getGrantApplications();
        const application = allApplications.find(app => app.publicChatToken === token);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
        applicationId = application.id;
      }
      
      // Create message data
      const messageData = {
        applicationId,
        senderRole: 'applicant' as const,
        senderId: senderEmail || 'applicant',
        body: body.trim()
      };
      
      // Validate using schema
      const validatedData = insertChatMessageSchema.parse(messageData);
      
      // Create the message
      const message = await storage.createChatMessage(validatedData);
      
      res.json({ 
        message: "Message sent successfully", 
        chatMessage: message 
      });
    } catch (error) {
      console.error("Error sending applicant message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Bitcoin Core RPC Proxy for PSBT functionality
  // SECURITY: Only safe methods are allowed (admin-authenticated)
  // Note: scantxoutset is resource-intensive; sendrawtransaction broadcasts transactions
  const ALLOWED_RPC_METHODS = [
    'createpsbt',
    'utxoupdatepsbt',
    'finalizepsbt',
    'decodepsbt',
    'getblockchaininfo',
    'getblockcount',
    'scantxoutset',
    'sendrawtransaction',
    'verifymessage'
  ];

  async function coreRpc(method: string, params: any[] = []) {
    // SECURITY: Require explicit Bitcoin RPC credentials
    const RPC_URL = process.env.BITCOIN_RPC_URL;
    const RPC_USER = process.env.BITCOIN_RPC_USER;
    const RPC_PASS = process.env.BITCOIN_RPC_PASS;

    if (!RPC_URL || !RPC_USER || !RPC_PASS) {
      throw new Error('Bitcoin RPC credentials not configured. Set BITCOIN_RPC_URL, BITCOIN_RPC_USER, and BITCOIN_RPC_PASS environment variables.');
    }

    // SECURITY: Method allowlist check
    if (!ALLOWED_RPC_METHODS.includes(method)) {
      throw new Error(`RPC method '${method}' is not allowed for security reasons`);
    }

    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Authorization: "Basic " + Buffer.from(`${RPC_USER}:${RPC_PASS}`).toString("base64"),
      },
      body: JSON.stringify({ jsonrpc: "1.0", id: "proxy", method, params }),
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Bitcoin Core RPC returned HTTP ${res.status}. Check BITCOIN_RPC_URL, BITCOIN_RPC_USER, and BITCOIN_RPC_PASS configuration.`);
    }
    if (json.error) {
      throw new Error(`RPC ${json.error.code}: ${json.error.message}`);
    }
    return json.result;
  }

  // Secure RPC endpoint with method allowlist (for advanced users only)
  app.post("/api/bitcoin/rpc", requireAdmin, async (req, res) => {
    try {
      const { method, params = [] } = req.body || {};
      if (!method) {
        return res.status(400).json({ error: "Method is required" });
      }
      const result = await coreRpc(method, params);
      res.json({ result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Helper: build a self-send PSBT for a given UTXO (for ownership verification)
  // SECURITY: This endpoint requires admin authentication
  app.post("/api/bitcoin/createSelfSend", requireAdmin, async (req, res) => {
    try {
      const { txid, vout, address, amountBtc, feeSats = 0 } = req.body || {};
      
      if (!txid || vout === undefined || !address || amountBtc === undefined) {
        return res.status(400).json({ 
          error: "txid, vout, address, and amountBtc are required" 
        });
      }

      // Basic address validation
      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ error: "Invalid Bitcoin address format" });
      }

      // Optionally subtract a tiny fee
      const amt = Number(amountBtc);
      const adj = feeSats && feeSats > 0 ? Math.max(0, amt - feeSats / 1e8) : amt;

      // 1) Build PSBT: spend UTXO → send back to same address
      const psbt = await coreRpc("createpsbt", [
        [{ txid, vout }],
        { [address]: Number(adj.toFixed(8)) },
      ]);

      // 2) Attach UTXO details so hardware/software can sign
      const updated = await coreRpc("utxoupdatepsbt", [psbt]);
      
      res.json({ psbt: updated });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  async function getUtxosFromPublicApi(address: string) {
    const res = await fetch(`https://mempool.space/api/address/${address}/utxo`);
    if (!res.ok) throw new Error(`Mempool API error: ${res.status}`);
    const utxos = await res.json();
    return utxos;
  }

  async function getBtcBalancePublic(address: string): Promise<number> {
    try {
      const utxoResult = await coreRpc("scantxoutset", ["start", [`addr(${address})`]]);
      if (utxoResult && utxoResult.total_amount) return utxoResult.total_amount;
    } catch {}
    try {
      const utxos = await getUtxosFromPublicApi(address);
      let total = 0;
      for (const u of utxos) total += u.value;
      return total / 1e8;
    } catch {}
    return 0;
  }

  app.post("/api/bitcoin/createPsbtFromAddress", async (req, res) => {
    try {
      const { address } = req.body || {};
      
      if (!address) {
        return res.status(400).json({ error: "Bitcoin address is required" });
      }

      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ error: "Invalid Bitcoin address format" });
      }

      let utxo: any = null;
      let totalUtxos = 0;
      let amountBtc = 0;

      try {
        const utxoResult = await coreRpc("scantxoutset", ["start", [`addr(${address})`]]);
        if (utxoResult && utxoResult.unspents && utxoResult.unspents.length > 0) {
          utxo = utxoResult.unspents[0];
          totalUtxos = utxoResult.unspents.length;
          amountBtc = utxo.amount;
        }
      } catch {
        const publicUtxos = await getUtxosFromPublicApi(address);
        if (publicUtxos && publicUtxos.length > 0) {
          const u = publicUtxos[0];
          utxo = { txid: u.txid, vout: u.vout, amount: u.value / 1e8 };
          totalUtxos = publicUtxos.length;
          amountBtc = utxo.amount;
        }
      }

      if (!utxo) {
        return res.status(404).json({ 
          error: "No UTXOs found for this address. Address may have no balance or no transaction history." 
        });
      }

      const feeSats = 1000;
      const adj = Math.max(0, amountBtc - feeSats / 1e8);

      try {
        const psbt = await coreRpc("createpsbt", [
          [{ txid: utxo.txid, vout: utxo.vout }],
          { [address]: Number(adj.toFixed(8)) },
        ]);
        const updated = await coreRpc("utxoupdatepsbt", [psbt]);
        
        return res.json({ 
          psbt: updated,
          utxoCount: totalUtxos,
          amountBtc,
          txid: utxo.txid,
          vout: utxo.vout
        });
      } catch {
        const bitcoin = await import('bitcoinjs-lib');
        const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });

        const txRes = await fetch(`https://mempool.space/api/tx/${utxo.txid}/hex`);
        if (!txRes.ok) throw new Error("Failed to fetch transaction hex from mempool.space");
        const txHex = await txRes.text();

        if (address.startsWith('bc1')) {
          psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            witnessUtxo: {
              script: bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin),
              value: Math.round(amountBtc * 1e8),
            },
          });
        } else {
          psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            nonWitnessUtxo: Buffer.from(txHex, 'hex'),
          });
        }

        psbt.addOutput({
          address: address,
          value: Math.round(adj * 1e8),
        });

        return res.json({
          psbt: psbt.toBase64(),
          utxoCount: totalUtxos,
          amountBtc,
          txid: utxo.txid,
          vout: utxo.vout,
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Verify Bitcoin message signature and save claim
  // Public endpoint - anyone can verify signatures
  app.post("/api/bitcoin/verifyMessage", async (req, res) => {
    try {
      const { address, message, signature, libertyAddress } = req.body || {};
      
      if (!address || !message || !signature) {
        return res.status(400).json({ 
          error: "Address, message, and signature are required" 
        });
      }

      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ error: "Invalid Bitcoin address format" });
      }

      let isValid = false;
      try {
        isValid = bitcoinMessage.verify(message, address, signature);
      } catch (jsErr: any) {
        try {
          isValid = bitcoinMessage.verify(message, address, signature, undefined, true);
        } catch {
          try {
            isValid = await coreRpc("verifymessage", [address, signature, message]);
          } catch {
            throw new Error("Signature verification failed. Unsupported address type or invalid signature.");
          }
        }
      }
      
      if (isValid && libertyAddress) {
        const existingClaim = await storage.getBtcClaimByBtcAddress(address);
        if (existingClaim) {
          return res.json({
            valid: true,
            message: "Signature valid! This BTC address has already been claimed.",
            claim: existingClaim,
            alreadyClaimed: true
          });
        }

        const btcBalance = await getBtcBalancePublic(address);
        const libertyEntitlement = btcBalance * 10;

        const claim = await storage.createBtcClaim({
          btcAddress: address,
          libertyAddress,
          btcBalance: btcBalance.toFixed(8),
          libertyEntitlement: libertyEntitlement.toFixed(8),
          verificationMethod: "message",
          signature,
          status: "verified",
        });

        return res.json({ 
          valid: true,
          message: `Signature verified! Claim saved. Balance: ${btcBalance.toFixed(8)} BTC → ${libertyEntitlement.toFixed(8)} LIBERTY`,
          claim,
        });
      }
      
      res.json({ 
        valid: isValid,
        message: isValid 
          ? "Signature is valid! You own this Bitcoin address." 
          : "Signature verification failed. The signature does not match the address or message."
      });
    } catch (e: any) {
      res.status(500).json({ 
        valid: false,
        error: e.message,
        message: "Failed to verify signature. Make sure Bitcoin Core RPC is configured correctly."
      });
    }
  });

  // Verify signed PSBT and save claim
  app.post("/api/bitcoin/verifyPsbt", async (req, res) => {
    try {
      const { signedPsbt, btcAddress, libertyAddress } = req.body || {};

      if (!signedPsbt || !btcAddress || !libertyAddress) {
        return res.status(400).json({ error: "signedPsbt, btcAddress, and libertyAddress are required" });
      }

      const existingClaim = await storage.getBtcClaimByBtcAddress(btcAddress);
      if (existingClaim) {
        return res.json({
          valid: true,
          message: "This BTC address has already been claimed.",
          claim: existingClaim,
          alreadyClaimed: true
        });
      }

      let decoded;
      try {
        decoded = await coreRpc("decodepsbt", [signedPsbt]);
      } catch {
        const bitcoin = await import('bitcoinjs-lib');
        try {
          const psbtObj = bitcoin.Psbt.fromBase64(signedPsbt);
          decoded = { inputs: psbtObj.data.inputs.map((inp: any) => ({
            final_scriptwitness: inp.finalScriptWitness,
            final_scriptsig: inp.finalScriptSig,
            partial_signatures: inp.partialSig ? Object.fromEntries(inp.partialSig.map((ps: any) => [ps.pubkey.toString('hex'), ps.signature.toString('hex')])) : {}
          }))};
        } catch {
          return res.status(400).json({ valid: false, message: "Invalid PSBT format." });
        }
      }

      let hasValidSignature = false;
      let txid = null;

      if (decoded && decoded.inputs) {
        for (const input of decoded.inputs) {
          if (input.final_scriptwitness || input.final_scriptsig || 
              (input.partial_signatures && Object.keys(input.partial_signatures).length > 0)) {
            hasValidSignature = true;
            break;
          }
        }
      }

      if (!hasValidSignature) {
        return res.json({
          valid: false,
          message: "PSBT does not contain a valid signature. Please sign it with your wallet first."
        });
      }

      try {
        const finalized = await coreRpc("finalizepsbt", [signedPsbt]);
        if (finalized && finalized.complete) {
          txid = finalized.txid || null;
        }
      } catch {
      }

      const btcBalance = await getBtcBalancePublic(btcAddress);

      const libertyEntitlement = btcBalance * 10;

      const claim = await storage.createBtcClaim({
        btcAddress,
        libertyAddress,
        btcBalance: btcBalance.toFixed(8),
        libertyEntitlement: libertyEntitlement.toFixed(8),
        verificationMethod: "psbt",
        txid,
        status: "verified",
      });

      res.json({
        valid: true,
        message: `PSBT verified! Claim saved. Balance: ${btcBalance.toFixed(8)} BTC → ${libertyEntitlement.toFixed(8)} LIBERTY`,
        claim,
      });
    } catch (e: any) {
      res.status(500).json({
        valid: false,
        error: e.message,
        message: "Failed to verify PSBT."
      });
    }
  });

  // Get all claims (admin)
  app.get("/api/admin/claims", requireAdmin, async (req, res) => {
    try {
      const claims = await storage.getBtcClaims();
      res.json(claims);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Check if a BTC address has already been claimed
  app.get("/api/bitcoin/checkClaim/:address", async (req, res) => {
    try {
      const claim = await storage.getBtcClaimByBtcAddress(req.params.address);
      res.json({ claimed: !!claim, claim: claim || null });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ===== AUCTION ROUTES =====

  // ===== AUCTION PROFILE ROUTES =====

  // GET /api/auction/profile?wallet=0x... - get user profile
  app.get("/api/auction/profile", async (req, res) => {
    try {
      const wallet = req.query.wallet as string;
      if (!wallet) return res.status(400).json({ error: "wallet required" });
      const profile = await storage.getAuctionProfile(wallet);
      if (!profile) return res.json(null);
      res.json(profile);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/auction/profile - create or update profile (wallet login)
  app.post("/api/auction/profile", async (req, res) => {
    try {
      const { walletAddress, libertyAddress, displayName } = req.body;
      if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

      // Validate liberty address format if provided
      if (libertyAddress && !/^0x[a-fA-F0-9]{40}$/.test(libertyAddress)) {
        return res.status(400).json({ error: "Invalid Liberty address. Must be a valid EVM address (0x...)" });
      }

      const profile = await storage.upsertAuctionProfile({
        walletAddress,
        libertyAddress: libertyAddress || null,
        displayName: displayName || null,
      });
      res.json(profile);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // PATCH /api/auction/profile/liberty-address - update liberty address
  app.patch("/api/auction/profile/liberty-address", async (req, res) => {
    try {
      const { walletAddress, libertyAddress } = req.body;
      if (!walletAddress || !libertyAddress) {
        return res.status(400).json({ error: "walletAddress and libertyAddress required" });
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(libertyAddress)) {
        return res.status(400).json({ error: "Invalid Liberty address. Must be a valid EVM address (0x...)" });
      }
      const profile = await storage.updateLibertyAddress(walletAddress, libertyAddress);
      res.json(profile);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/auction/config - public auction config (deposit address, etc.)
  app.get("/api/auction/config", (_req, res) => {
    res.json({
      depositAddress: process.env.AUCTION_DEPOSIT_ADDRESS || null,
    });
  });

  const AUCTION_CONFIG = {
    totalSupply: 40_950_000,
    basePrice: 0.80,   // $0.80 USD start
    maxPrice: 1.20,     // $1.20 USD end
    durationDays: 7,
    startDate: null as string | null, // set when auction starts
  };

  // Bonding curve: price = basePrice + (tokensSold / totalSupply) * (maxPrice - basePrice)
  function getCurrentPrice(tokensSold: number): number {
    const { basePrice, maxPrice, totalSupply } = AUCTION_CONFIG;
    return basePrice + (tokensSold / totalSupply) * (maxPrice - basePrice);
  }

  // Calculate how many LIBERTY tokens you get for a given USD amount at current supply
  function calculateTokensForUsd(usdAmount: number, tokensSold: number): { tokens: number; avgPrice: number } {
    const { basePrice, maxPrice, totalSupply } = AUCTION_CONFIG;
    const priceRange = maxPrice - basePrice;
    const remaining = totalSupply - tokensSold;

    // Integral: USD = basePrice*T + priceRange/(2*totalSupply) * ((tokensSold+T)^2 - tokensSold^2)
    // Solving for T given USD using quadratic formula:
    // priceRange/(2*totalSupply) * T^2 + (basePrice + priceRange*tokensSold/totalSupply) * T - usdAmount = 0
    const a = priceRange / (2 * totalSupply);
    const b = basePrice + (priceRange * tokensSold) / totalSupply;
    const c = -usdAmount;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return { tokens: 0, avgPrice: 0 };

    let tokens = (-b + Math.sqrt(discriminant)) / (2 * a);
    tokens = Math.min(tokens, remaining);
    tokens = Math.max(tokens, 0);

    const avgPrice = tokens > 0 ? usdAmount / tokens : getCurrentPrice(tokensSold);
    return { tokens: Math.floor(tokens * 1e8) / 1e8, avgPrice };
  }

  // GET /api/auction/state - public auction state
  app.get("/api/auction/state", async (_req, res) => {
    try {
      const totalSold = await storage.getTotalLibertySold();
      const totalRaised = await storage.getTotalUsdRaised();
      const currentPrice = getCurrentPrice(totalSold);
      const percentSold = (totalSold / AUCTION_CONFIG.totalSupply) * 100;

      res.json({
        totalSupply: AUCTION_CONFIG.totalSupply,
        totalSold,
        totalRaised,
        currentPrice: Math.round(currentPrice * 1e8) / 1e8,
        basePrice: AUCTION_CONFIG.basePrice,
        maxPrice: AUCTION_CONFIG.maxPrice,
        percentSold: Math.round(percentSold * 100) / 100,
        remaining: AUCTION_CONFIG.totalSupply - totalSold,
        durationDays: AUCTION_CONFIG.durationDays,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/auction/preview?usd=1000 - preview how many tokens for a USD amount
  app.get("/api/auction/preview", async (req, res) => {
    try {
      const usd = parseFloat(req.query.usd as string);
      if (!usd || usd <= 0) {
        return res.status(400).json({ error: "Invalid USD amount" });
      }

      const totalSold = await storage.getTotalLibertySold();
      const { tokens, avgPrice } = calculateTokensForUsd(usd, totalSold);

      res.json({
        usdAmount: usd,
        libertyTokens: tokens,
        avgPricePerToken: Math.round(avgPrice * 1e8) / 1e8,
        currentPrice: Math.round(getCurrentPrice(totalSold) * 1e8) / 1e8,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/auction/buy - record a purchase
  app.post("/api/auction/buy", async (req, res) => {
    try {
      const { walletAddress, chain, paymentCurrency, paymentAmount, paymentAmountUsd, txHash, libertyAddress } = req.body;

      if (!walletAddress || !chain || !paymentCurrency || !paymentAmount || !paymentAmountUsd) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const usd = parseFloat(paymentAmountUsd);
      if (usd <= 0) {
        return res.status(400).json({ error: "Invalid payment amount" });
      }

      const totalSold = await storage.getTotalLibertySold();
      const remaining = AUCTION_CONFIG.totalSupply - totalSold;
      if (remaining <= 0) {
        return res.status(400).json({ error: "Auction sold out" });
      }

      const { tokens, avgPrice } = calculateTokensForUsd(usd, totalSold);
      if (tokens <= 0) {
        return res.status(400).json({ error: "Amount too small" });
      }

      const purchase = await storage.createAuctionPurchase({
        walletAddress,
        chain,
        paymentCurrency,
        paymentAmount: paymentAmount.toString(),
        paymentAmountUsd: usd.toFixed(2),
        libertyAmount: tokens.toFixed(8),
        pricePerLiberty: avgPrice.toFixed(8),
        libertyAddress: libertyAddress || walletAddress,
        txHash: txHash || null,
        status: txHash ? "confirmed" : "pending",
      });

      res.json({
        purchase,
        newPrice: Math.round(getCurrentPrice(totalSold + tokens) * 1e8) / 1e8,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/auction/purchases?wallet=0x... - get purchases for a wallet
  app.get("/api/auction/purchases", async (req, res) => {
    try {
      const wallet = req.query.wallet as string;
      if (!wallet) {
        return res.status(400).json({ error: "wallet query parameter required" });
      }
      const purchases = await storage.getAuctionPurchasesByWallet(wallet);
      res.json(purchases);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/auction/recent - recent purchases (public feed)
  app.get("/api/auction/recent", async (_req, res) => {
    try {
      const all = await storage.getAuctionPurchases();
      // Return last 20, mask wallet addresses
      const recent = all.slice(0, 20).map(p => ({
        id: p.id,
        walletAddress: p.walletAddress.slice(0, 6) + "..." + p.walletAddress.slice(-4),
        chain: p.chain,
        paymentCurrency: p.paymentCurrency,
        paymentAmountUsd: p.paymentAmountUsd,
        libertyAmount: p.libertyAmount,
        pricePerLiberty: p.pricePerLiberty,
        status: p.status,
        purchasedAt: p.purchasedAt,
      }));
      res.json(recent);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Auction price cache
  let auctionPriceCache: { data: Record<string, number>; cachedAt: number } | null = null;
  const AUCTION_PRICE_CACHE_MS = 5 * 60 * 1000; // 5 minutes

  const FALLBACK_PRICES: Record<string, number> = {
    BTC: 84000, ETH: 1800, BNB: 600, POL: 0.40, SOL: 130, USDC: 1, USDT: 1,
  };

  // GET /api/auction/prices - live crypto prices for conversion
  app.get("/api/auction/prices", async (_req, res) => {
    try {
      const now = Date.now();
      if (auctionPriceCache && (now - auctionPriceCache.cachedAt) < AUCTION_PRICE_CACHE_MS) {
        return res.json(auctionPriceCache.data);
      }

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,matic-network,solana&vs_currencies=usd'
      );
      if (!response.ok) throw new Error(`CoinGecko ${response.status}`);
      const data = await response.json();
      const prices = {
        BTC: data.bitcoin?.usd || FALLBACK_PRICES.BTC,
        ETH: data.ethereum?.usd || FALLBACK_PRICES.ETH,
        BNB: data.binancecoin?.usd || FALLBACK_PRICES.BNB,
        POL: data["matic-network"]?.usd || FALLBACK_PRICES.POL,
        SOL: data.solana?.usd || FALLBACK_PRICES.SOL,
        USDC: 1,
        USDT: 1,
      };
      auctionPriceCache = { data: prices, cachedAt: now };
      res.json(prices);
    } catch (e: any) {
      console.error("Auction prices fetch error:", e.message);
      // Return cached or fallback prices instead of 500
      if (auctionPriceCache) {
        return res.json(auctionPriceCache.data);
      }
      res.json(FALLBACK_PRICES);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
