import { useState, useEffect, useRef } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { motion } from "motion/react";
import { ethers } from "ethers";

const CHAINS = [
  { id: "btc", name: "Bitcoin", currencies: ["BTC"] },
  { id: "eth", name: "Ethereum", currencies: ["ETH", "USDC", "USDT"] },
  { id: "bnb", name: "BNB Chain", currencies: ["BNB", "USDT"] },
  { id: "pol", name: "Polygon", currencies: ["POL", "USDT"] },
  { id: "sol", name: "Solana", currencies: ["SOL", "USDC", "USDT"] },
];

const CURRENCY_ICONS = {
  BTC: "₿", ETH: "Ξ", USDC: "$", USDT: "₮", BNB: "◆", POL: "⬡", SOL: "◎",
};

const TokenAuction = () => {
  const [activeTab, setActiveTab] = useState("BUY");
  const [selectedChain, setSelectedChain] = useState("eth");
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [payAmount, setPayAmount] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [previewTokens, setPreviewTokens] = useState(null);
  const [auctionState, setAuctionState] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [myPurchases, setMyPurchases] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buySuccess, setBuySuccess] = useState(null);
  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const [libertyAddress, setLibertyAddress] = useState("");
  const [profile, setProfile] = useState(null);
  const [pendingBuy, setPendingBuy] = useState(null);
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet, signer } = useWallet();

  // Fetch auction state
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/auction/state");
        if (res.ok) setAuctionState(await res.json());
      } catch (e) { console.error("Failed to fetch auction state", e); }
    };
    fetchState();
    const interval = setInterval(fetchState, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/auction/prices");
        if (res.ok) setCryptoPrices(await res.json());
      } catch (e) { console.error("Failed to fetch prices", e); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch/create user profile on wallet connect
  useEffect(() => {
    if (!account) { setProfile(null); setLibertyAddress(""); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/auction/profile?wallet=${account}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProfile(data);
            setLibertyAddress(data.libertyAddress || account);
          } else {
            // Auto-create profile
            const createRes = await fetch("/api/auction/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ walletAddress: account, libertyAddress: account }),
            });
            if (createRes.ok) {
              const newProfile = await createRes.json();
              setProfile(newProfile);
              setLibertyAddress(account);
            }
          }
        }
      } catch (e) { console.error("Failed to fetch profile", e); }
    };
    fetchProfile();
  }, [account]);

  // Fetch user purchases
  useEffect(() => {
    if (!account) { setMyPurchases([]); return; }
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`/api/auction/purchases?wallet=${account}`);
        if (res.ok) setMyPurchases(await res.json());
      } catch (e) { console.error("Failed to fetch purchases", e); }
    };
    fetchPurchases();
  }, [account, buySuccess]);

  // Fetch recent purchases
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/auction/recent");
        if (res.ok) setRecentPurchases(await res.json());
      } catch (e) { console.error("Failed to fetch recent", e); }
    };
    fetchRecent();
    const interval = setInterval(fetchRecent, 15000);
    return () => clearInterval(interval);
  }, []);

  // Calculate USD equivalent when pay amount or currency changes
  useEffect(() => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0 || !cryptoPrices[selectedCurrency]) {
      setUsdEquivalent(0);
      setPreviewTokens(null);
      return;
    }
    const isStablecoin = selectedCurrency === "USDC" || selectedCurrency === "USDT";
    const usd = isStablecoin ? amount : amount * cryptoPrices[selectedCurrency];
    setUsdEquivalent(usd);

    // Preview tokens
    const fetchPreview = async () => {
      try {
        const res = await fetch(`/api/auction/preview?usd=${usd}`);
        if (res.ok) setPreviewTokens(await res.json());
      } catch (e) { console.error("Failed to preview", e); }
    };
    const timeout = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timeout);
  }, [payAmount, selectedCurrency, cryptoPrices]);

  // Handle chain change
  const handleChainChange = (chainId) => {
    setSelectedChain(chainId);
    const chain = CHAINS.find(c => c.id === chainId);
    setSelectedCurrency(chain.currencies[0]);
    setPayAmount("");
  };

  // ERC20 USDC transfer ABI (just the transfer function)
  const ERC20_TRANSFER_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];

  // Stablecoin contract addresses per chain
  const STABLECOIN_CONTRACTS = {
    USDC: {
      eth: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      bnb: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      pol: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    },
    USDT: {
      eth: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      bnb: "0x55d398326f99059fF775485246999027B3197955",
      pol: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
  };

  // Both USDC and USDT use 6 decimals on these chains
  const STABLECOIN_DECIMALS = 6;

  // Handle buy — sends real on-chain transaction for EVM chains
  // Step 1: Show address confirmation popup before buying
  const handleBuyClick = () => {
    if (!isConnected) {
      connectModalRef.current?.showModal();
      return;
    }
    if (!payAmount || usdEquivalent <= 0) return;
    setShowAddressConfirm(true);
  };

  // Step 2: After user confirms address, proceed with actual purchase
  const handleConfirmAndBuy = async () => {
    // Validate liberty address
    if (!/^0x[a-fA-F0-9]{40}$/.test(libertyAddress)) {
      alert("Please enter a valid EVM address (0x...)");
      return;
    }

    setShowAddressConfirm(false);

    // Save/update liberty address in profile
    try {
      await fetch("/api/auction/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, libertyAddress }),
      });
    } catch (e) { console.error("Failed to update profile", e); }

    await executeBuy();
  };

  // Step 3: Execute the actual buy
  const executeBuy = async () => {
    if (!payAmount || usdEquivalent <= 0) return;

    // BTC and SOL are custodial — no on-chain tx from browser
    if (selectedChain === "btc" || selectedChain === "sol") {
      alert(`For ${selectedCurrency} payments, please send ${payAmount} ${selectedCurrency} to the deposit address shown after confirming. Your allocation will be recorded once confirmed.`);
      setLoading(true);
      setBuySuccess(null);
      try {
        const res = await fetch("/api/auction/buy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: account,
            chain: selectedChain,
            paymentCurrency: selectedCurrency,
            paymentAmount: payAmount,
            paymentAmountUsd: usdEquivalent.toFixed(2),
            libertyAddress,
            txHash: null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Purchase failed");
        setBuySuccess(data);
        setPayAmount("");
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // EVM chains — send real transaction via MetaMask/Phantom
    setLoading(true);
    setBuySuccess(null);
    try {
      // Fetch deposit address from server
      const configRes = await fetch("/api/auction/config");
      if (!configRes.ok) throw new Error("Failed to fetch auction config");
      const { depositAddress } = await configRes.json();
      if (!depositAddress) throw new Error("Deposit address not configured");

      if (!signer) throw new Error("Wallet signer not available. Please reconnect.");

      let txHash;

      if (selectedCurrency === "USDC" || selectedCurrency === "USDT") {
        // ERC20 stablecoin transfer
        const contractAddress = STABLECOIN_CONTRACTS[selectedCurrency]?.[selectedChain];
        if (!contractAddress) throw new Error(`${selectedCurrency} not supported on ${selectedChain}`);

        const contract = new ethers.Contract(contractAddress, ERC20_TRANSFER_ABI, signer);
        const amount = ethers.parseUnits(payAmount, STABLECOIN_DECIMALS);
        const tx = await contract.transfer(depositAddress, amount);
        txHash = tx.hash;
        // Wait for confirmation
        await tx.wait(1);
      } else {
        // Native token transfer (ETH, BNB, POL)
        const tx = await signer.sendTransaction({
          to: depositAddress,
          value: ethers.parseEther(payAmount),
        });
        txHash = tx.hash;
        // Wait for confirmation
        await tx.wait(1);
      }

      // Record purchase with tx hash
      const res = await fetch("/api/auction/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account,
          chain: selectedChain,
          paymentCurrency: selectedCurrency,
          paymentAmount: payAmount,
          paymentAmountUsd: usdEquivalent.toFixed(2),
          libertyAddress,
          txHash,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase recording failed");
      setBuySuccess(data);
      setPayAmount("");
    } catch (e) {
      if (e.code === "ACTION_REJECTED" || e.code === 4001) {
        // User rejected the transaction
      } else {
        alert(e.message || "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatUsd = (value) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);

  const formatNumber = (value, decimals = 2) => new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(value);

  const progressPercent = auctionState ? (auctionState.totalSold / auctionState.totalSupply) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="w-full bg-black flex flex-row items-center justify-between px-6 md:px-20 lg:px-80 h-[89px] border-b border-white/10">
        <a href="/">
          <img src={FullLogo} className="h-[45px] cursor-pointer" alt="Liberty Logo" />
        </a>
        <div className="flex flex-row font-bold items-center gap-7 text-[14px] text-white">
          <a href="/" className="hover:text-[#4A9390] transition-colors hidden md:block">HOME</a>
          {isConnected && (
            <a href="/auction/profile" className="hover:text-[#4A9390] transition-colors hidden md:block">MY PROFILE</a>
          )}
          <button
            onClick={() => {
              if (isConnected) {
                if (window.confirm("Disconnect wallet?")) disconnectWallet();
              } else {
                connectModalRef.current?.showModal();
              }
            }}
            className="flex flex-row gap-2 border-[#448986] border px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-all"
          >
            {isConnected ? truncateAddress(account) : "CONNECT WALLET"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            LIBERTY <span className="text-[#4A9390]">Token Sale</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            40,950,000 LIBERTY tokens available. Price starts at $0.80 and rises to $1.20.
            Early buyers get up to 1.5x more tokens.
          </p>
        </motion.div>

        {/* Auction Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-8 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">CURRENT PRICE</div>
              <div className="text-3xl font-bold text-[#4A9390]">
                {auctionState ? formatUsd(auctionState.currentPrice) : "—"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">TOKENS SOLD</div>
              <div className="text-3xl font-bold text-white">
                {auctionState ? formatNumber(auctionState.totalSold, 0) : "—"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">TOTAL RAISED</div>
              <div className="text-3xl font-bold text-white">
                {auctionState ? formatUsd(auctionState.totalRaised) : "—"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">REMAINING</div>
              <div className="text-3xl font-bold text-white">
                {auctionState ? formatNumber(auctionState.remaining, 0) : "—"}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>$0.80</span>
              <span>{formatNumber(progressPercent)}% sold</span>
              <span>$1.20</span>
            </div>
            <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden border border-[#4A9390]/20">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4A9390] to-[#6EB5B1] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Price Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 LIBERTY sold</span>
            <span>40,950,000 LIBERTY</span>
          </div>
        </motion.div>

        {/* Two Column Layout: Buy + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Buy Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-8"
          >
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8">
              {["BUY", "MY PURCHASES"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 font-semibold text-sm transition-all ${
                    activeTab === tab
                      ? "text-[#4A9390] border-b-2 border-[#4A9390]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "BUY" && (
              <div>
                {/* Chain Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-400 mb-3">SELECT CHAIN</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => handleChainChange(chain.id)}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedChain === chain.id
                            ? "bg-[#4A9390] text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {chain.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selector */}
                {CHAINS.find(c => c.id === selectedChain)?.currencies.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-400 mb-3">PAY WITH</label>
                    <div className="flex gap-3">
                      {CHAINS.find(c => c.id === selectedChain)?.currencies.map((curr) => (
                        <button
                          key={curr}
                          onClick={() => { setSelectedCurrency(curr); setPayAmount(""); }}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                            selectedCurrency === curr
                              ? "bg-[#4A9390] text-white"
                              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          {CURRENCY_ICONS[curr]} {curr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-400 mb-3">
                    AMOUNT ({selectedCurrency})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder={`Enter ${selectedCurrency} amount`}
                      className="w-full px-6 py-4 rounded-xl bg-black/60 border border-[#4A9390]/30 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A9390] placeholder-gray-600"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {usdEquivalent > 0 && `~ ${formatUsd(usdEquivalent)}`}
                    </div>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {(selectedCurrency === "USDC" || selectedCurrency === "USDT")
                    ? [100, 500, 1000, 5000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setPayAmount(amt.toString())}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                        >
                          ${formatNumber(amt, 0)}
                        </button>
                      ))
                    : selectedCurrency === "BTC"
                    ? [0.01, 0.05, 0.1, 0.5].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setPayAmount(amt.toString())}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                        >
                          {amt} BTC
                        </button>
                      ))
                    : [0.1, 0.5, 1, 5].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setPayAmount(amt.toString())}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                        >
                          {amt} {selectedCurrency}
                        </button>
                      ))
                  }
                </div>

                {/* Preview */}
                {previewTokens && usdEquivalent > 0 && (
                  <div className="bg-black/40 rounded-2xl p-5 mb-6 border border-[#4A9390]/20">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">You pay</span>
                      <span className="text-white font-semibold">
                        {payAmount} {selectedCurrency} ({formatUsd(usdEquivalent)})
                      </span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-sm">You receive</span>
                      <span className="text-[#4A9390] font-bold text-lg">
                        {formatNumber(previewTokens.libertyTokens, 4)} LIBERTY
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Avg price per token</span>
                      <span className="text-white font-semibold">
                        {formatUsd(previewTokens.avgPricePerToken)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buy Success */}
                {buySuccess && (
                  <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-5 mb-6">
                    <div className="text-green-400 font-bold mb-2">Purchase Recorded</div>
                    <div className="text-gray-300 text-sm">
                      You purchased <span className="text-white font-bold">{formatNumber(buySuccess.purchase.libertyAmount, 4)} LIBERTY</span> at
                      avg price {formatUsd(buySuccess.purchase.pricePerLiberty)}.
                      New curve price: {formatUsd(buySuccess.newPrice)}
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                <button
                  onClick={handleBuyClick}
                  disabled={loading || !payAmount || usdEquivalent <= 0}
                  className="w-full bg-gradient-to-r from-[#4A9390] to-[#2D5F5D] text-white px-8 py-5 rounded-xl font-bold text-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : !isConnected
                    ? "CONNECT WALLET TO BUY"
                    : !payAmount || usdEquivalent <= 0
                    ? "ENTER AMOUNT"
                    : `BUY LIBERTY — ${formatUsd(usdEquivalent)}`}
                </button>

                <p className="text-center text-xs mt-4 text-gray-500">
                  Tokens will be delivered at Liberty Chain mainnet launch (genesis block).
                </p>
              </div>
            )}

            {activeTab === "MY PURCHASES" && (
              <div>
                {!isConnected ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">🔒</div>
                    <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
                    <p className="text-gray-400 mb-6">Connect your wallet to view your purchases.</p>
                    <button
                      onClick={() => connectModalRef.current?.showModal()}
                      className="bg-[#4A9390] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3A7875] transition-all"
                    >
                      CONNECT WALLET
                    </button>
                  </div>
                ) : myPurchases.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">📭</div>
                    <h3 className="text-xl font-bold text-white mb-3">No Purchases Yet</h3>
                    <p className="text-gray-400">Buy LIBERTY tokens to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/40 rounded-2xl p-5 border border-[#4A9390]/20 mb-6">
                      <div className="text-gray-400 text-sm mb-1">TOTAL LIBERTY PURCHASED</div>
                      <div className="text-3xl font-bold text-[#4A9390]">
                        {formatNumber(myPurchases.reduce((sum, p) => sum + Number(p.libertyAmount), 0), 4)} LIBERTY
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        Total spent: {formatUsd(myPurchases.reduce((sum, p) => sum + Number(p.paymentAmountUsd), 0))}
                      </div>
                    </div>
                    {myPurchases.map((p) => (
                      <div key={p.id} className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold">
                            {formatNumber(p.libertyAmount, 4)} LIBERTY
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            p.status === "confirmed"
                              ? "bg-green-900/40 text-green-400"
                              : p.status === "failed"
                              ? "bg-red-900/40 text-red-400"
                              : "bg-yellow-900/40 text-yellow-400"
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{p.paymentAmount} {p.paymentCurrency} ({formatUsd(p.paymentAmountUsd)})</span>
                          <span>@ {formatUsd(p.pricePerLiberty)}/token</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {new Date(p.purchasedAt).toLocaleString()} via {p.chain.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* How It Works */}
            <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Choose Chain & Currency", desc: "Pay with BTC, ETH, BNB, POL, SOL, or USDC" },
                  { step: "2", title: "Enter Amount", desc: "See how many LIBERTY you'll receive at the current curve price" },
                  { step: "3", title: "Purchase", desc: "Your allocation is recorded on our system" },
                  { step: "4", title: "Receive at Launch", desc: "Tokens delivered in Liberty Chain genesis block" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-gray-500 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Pricing</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Price</span>
                  <span className="text-white font-semibold">$0.80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Price</span>
                  <span className="text-white font-semibold">$1.20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white font-semibold">40,950,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Raise</span>
                  <span className="text-white font-semibold">~$40,950,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">7 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Early Bird Multiplier</span>
                  <span className="text-[#4A9390] font-bold">1.5x</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-black/40 rounded-xl border border-[#4A9390]/10">
                <p className="text-xs text-gray-400">
                  Price increases linearly as tokens are sold. The earlier you buy, the lower the price.
                  Someone buying at $0.80 gets 11.2x more tokens than someone buying at $1.20 for the same USD amount.
                </p>
              </div>
            </div>

            {/* Token Economics */}
            <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Token Source</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Lost BTC (non-Satoshi)</span>
                  <span className="text-white">3,003,000 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Satoshi's Coins</span>
                  <span className="text-white">1,092,000 BTC</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400">Total Inaccessible</span>
                  <span className="text-white font-bold">4,095,000 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ratio</span>
                  <span className="text-white">1 BTC = 10 LIBERTY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Auction Supply</span>
                  <span className="text-[#4A9390] font-bold">40,950,000 LIBERTY</span>
                </div>
              </div>
            </div>

            {/* Accepted Payments */}
            <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Accepted Payments</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CURRENCY_ICONS).map(([currency, icon]) => (
                  <div key={currency} className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-white text-xs font-semibold">{currency}</div>
                    <div className="text-gray-500 text-xs">
                      {cryptoPrices[currency] && currency !== "USDC"
                        ? formatUsd(cryptoPrices[currency])
                        : currency === "USDC" ? "$1.00" : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Purchases Feed */}
        {recentPurchases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Purchases</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">BUYER</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">CHAIN</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">PAID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">RECEIVED</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">PRICE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-gray-300">{p.walletAddress}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{p.chain.toUpperCase()}</td>
                      <td className="py-3 px-4 text-sm text-white">{formatUsd(p.paymentAmountUsd)}</td>
                      <td className="py-3 px-4 text-sm text-[#4A9390] font-semibold">
                        {formatNumber(p.libertyAmount, 2)} LIBERTY
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">{formatUsd(p.pricePerLiberty)}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(p.purchasedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "When do I receive my LIBERTY tokens?",
                a: "At Liberty Chain mainnet launch. All auction allocations are baked into the genesis block, exactly like Ethereum's 2014 sale.",
              },
              {
                q: "How does the pricing work?",
                a: "Price starts at $0.80 and rises linearly to $1.20 as tokens are sold. The more tokens sold, the higher the price. Early buyers get up to 1.5x more tokens for the same dollar amount.",
              },
              {
                q: "What chains can I pay with?",
                a: "Bitcoin (BTC), Ethereum (ETH, USDC, USDT), BNB Chain (BNB, USDT), Polygon (POL, USDT), and Solana (SOL, USDC, USDT).",
              },
              {
                q: "Where do the 40.95M LIBERTY tokens come from?",
                a: "They represent provably inaccessible Bitcoin: 3M lost BTC + 1.09M Satoshi's coins = 4.095M BTC × 10 LIBERTY per BTC.",
              },
              {
                q: "Is there a minimum purchase?",
                a: "No minimum. Buy any amount you're comfortable with.",
              },
            ].map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl p-5">
                <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Address Confirmation Popup */}
      {showAddressConfirm && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowAddressConfirm(false)}
        >
          <div
            className="bg-gradient-to-b from-[#082A2D] to-black border border-[#4A9390]/30 rounded-2xl p-8 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Confirm Liberty Address</h3>
            <p className="text-gray-400 text-sm mb-6">
              This is the EVM address where you'll receive your LIBERTY tokens at mainnet launch.
              By default, it's your connected wallet address. You can change it now or later from your profile.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-400 mb-2">LIBERTY RECEIVING ADDRESS</label>
              <input
                type="text"
                value={libertyAddress}
                onChange={(e) => setLibertyAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#4A9390]/30 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9390]"
              />
            </div>

            <button
              onClick={() => { setLibertyAddress(account); }}
              className="text-[#4A9390] text-sm mb-6 hover:underline cursor-pointer"
            >
              Use connected wallet address
            </button>

            <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">You pay</span>
                <span className="text-white font-semibold">{payAmount} {selectedCurrency} ({formatUsd(usdEquivalent)})</span>
              </div>
              {previewTokens && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You receive</span>
                  <span className="text-[#4A9390] font-bold">{formatNumber(previewTokens.libertyTokens, 4)} LIBERTY</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddressConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndBuy}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4A9390] to-[#2D5F5D] text-white font-bold hover:opacity-90 transition-all"
              >
                Confirm & Buy
              </button>
            </div>
          </div>
        </div>
      )}

      <ConnectWalletModal ref={connectModalRef} />
    </div>
  );
};

export default TokenAuction;
