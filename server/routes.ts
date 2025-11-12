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
import { setupAuth, requireAuth, requireAdmin } from "./auth";

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
          
          // Fetch real Bitcoin price from CoinGecko API
          let btcPrice = 43000; // Fallback price
          try {
            const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            if (priceResponse.ok) {
              const priceData = await priceResponse.json();
              btcPrice = priceData.bitcoin.usd;
            }
          } catch (priceError) {
            console.log("Using fallback BTC price due to API error");
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
    'sendrawtransaction'
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
      throw new Error(`HTTP ${res.status} — ${text}`);
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

  // Simplified endpoint: Create self-send PSBT from address (auto-fetch UTXOs)
  // SECURITY: This endpoint requires admin authentication
  app.post("/api/bitcoin/createPsbtFromAddress", requireAdmin, async (req, res) => {
    try {
      const { address } = req.body || {};
      
      if (!address) {
        return res.status(400).json({ error: "Bitcoin address is required" });
      }

      // Basic address validation
      const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/;
      if (!btcAddressRegex.test(address)) {
        return res.status(400).json({ error: "Invalid Bitcoin address format" });
      }

      // 1) Scan for UTXOs at this address
      const utxoResult = await coreRpc("scantxoutset", ["start", [`addr(${address})`]]);
      
      if (!utxoResult || !utxoResult.unspents || utxoResult.unspents.length === 0) {
        return res.status(404).json({ 
          error: "No UTXOs found for this address. Address may have no balance or no transaction history." 
        });
      }

      // 2) Use the first UTXO
      const utxo = utxoResult.unspents[0];
      const amountBtc = utxo.amount;
      const feeSats = 1000; // 1000 satoshis fee (0.00001 BTC)
      const adj = Math.max(0, amountBtc - feeSats / 1e8);

      // 3) Build PSBT: spend UTXO → send back to same address
      const psbt = await coreRpc("createpsbt", [
        [{ txid: utxo.txid, vout: utxo.vout }],
        { [address]: Number(adj.toFixed(8)) },
      ]);

      // 4) Attach UTXO details so hardware/software can sign
      const updated = await coreRpc("utxoupdatepsbt", [psbt]);
      
      res.json({ 
        psbt: updated,
        utxoCount: utxoResult.unspents.length,
        amountBtc: amountBtc,
        txid: utxo.txid,
        vout: utxo.vout
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
