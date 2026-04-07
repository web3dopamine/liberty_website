import { useState, useEffect, useRef } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { motion } from "motion/react";

const AuctionProfile = () => {
  const [profile, setProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [libertyAddress, setLibertyAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();

  // Fetch profile
  useEffect(() => {
    if (!account) { setProfile(null); setPurchases([]); return; }
    const fetchData = async () => {
      try {
        const [profileRes, purchasesRes] = await Promise.all([
          fetch(`/api/auction/profile?wallet=${account}`),
          fetch(`/api/auction/purchases?wallet=${account}`),
        ]);
        if (profileRes.ok) {
          const data = await profileRes.json();
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
        if (purchasesRes.ok) setPurchases(await purchasesRes.json());
      } catch (e) { console.error("Failed to fetch profile data", e); }
    };
    fetchData();
  }, [account]);

  const handleSaveAddress = async () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(libertyAddress)) {
      alert("Please enter a valid EVM address (0x...)");
      return;
    }
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/auction/profile/liberty-address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, libertyAddress }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setProfile(updated);
      setEditingAddress(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const formatUsd = (value) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);

  const formatNumber = (value, decimals = 2) => new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(value);

  const totalLiberty = purchases.reduce((sum, p) => sum + Number(p.libertyAmount), 0);
  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.paymentAmountUsd), 0);
  const avgPrice = totalLiberty > 0 ? totalSpent / totalLiberty : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="w-full bg-black flex flex-row items-center justify-between px-6 md:px-20 lg:px-80 h-[89px] border-b border-white/10">
        <a href="/">
          <img src={FullLogo} className="h-[45px] cursor-pointer" alt="Liberty Logo" />
        </a>
        <div className="flex flex-row font-bold items-center gap-7 text-[14px] text-white">
          <a href="/" className="hover:text-[#4A9390] transition-colors hidden md:block">HOME</a>
          <a href="/auction" className="hover:text-[#4A9390] transition-colors hidden md:block">AUCTION</a>
          <a href="/ownership" className="hover:text-[#4A9390] transition-colors hidden md:block">CLAIM</a>
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-6 opacity-30">🔒</div>
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view your auction profile and purchase history.</p>
            <button
              onClick={() => connectModalRef.current?.showModal()}
              className="bg-[#4A9390] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3A7875] transition-all"
            >
              CONNECT WALLET
            </button>
          </motion.div>
        ) : (
          <>
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-gray-400 font-mono">{account}</p>
              {profile?.createdAt && (
                <p className="text-gray-600 text-sm mt-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-1">TOTAL LIBERTY</div>
                <div className="text-3xl font-bold text-[#4A9390]">{formatNumber(totalLiberty, 4)}</div>
              </div>
              <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-1">TOTAL SPENT</div>
                <div className="text-3xl font-bold text-white">{formatUsd(totalSpent)}</div>
              </div>
              <div className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-1">AVG PRICE PER TOKEN</div>
                <div className="text-3xl font-bold text-white">{avgPrice > 0 ? formatUsd(avgPrice) : "—"}</div>
              </div>
            </motion.div>

            {/* Liberty Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-2xl p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Liberty Chain Address</h2>
                {!editingAddress && (
                  <button
                    onClick={() => setEditingAddress(true)}
                    className="text-[#4A9390] text-sm font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">
                This is the EVM address where you'll receive your LIBERTY tokens at mainnet launch.
              </p>

              {editingAddress ? (
                <div>
                  <input
                    type="text"
                    value={libertyAddress}
                    onChange={(e) => setLibertyAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#4A9390]/30 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9390] mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setLibertyAddress(profile?.libertyAddress || account); setEditingAddress(false); }}
                      className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setLibertyAddress(account)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-[#4A9390] text-sm hover:bg-white/5"
                    >
                      Use wallet address
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      disabled={saving}
                      className="px-6 py-2 rounded-xl bg-[#4A9390] text-white text-sm font-semibold hover:bg-[#3A7875] disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="bg-black/40 rounded-xl px-4 py-3 border border-white/5 flex-1 font-mono text-sm text-white overflow-hidden text-ellipsis">
                    {profile?.libertyAddress || account}
                  </div>
                  {saveSuccess && (
                    <span className="text-green-400 text-sm font-semibold">Saved</span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Purchase History */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Purchase History</h2>
                <a href="/auction" className="text-[#4A9390] text-sm font-semibold hover:underline">
                  Buy More
                </a>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 opacity-30">📭</div>
                  <p className="text-gray-400 mb-4">No purchases yet.</p>
                  <a
                    href="/auction"
                    className="inline-block bg-[#4A9390] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3A7875] transition-all"
                  >
                    Go to Auction
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((p) => (
                    <div key={p.id} className="bg-black/30 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-white font-bold text-lg">
                            {formatNumber(p.libertyAmount, 4)} LIBERTY
                          </span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          p.status === "confirmed"
                            ? "bg-green-900/40 text-green-400"
                            : p.status === "failed"
                            ? "bg-red-900/40 text-red-400"
                            : "bg-yellow-900/40 text-yellow-400"
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs">Paid</div>
                          <div className="text-gray-300">{p.paymentAmount} {p.paymentCurrency}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">USD Value</div>
                          <div className="text-gray-300">{formatUsd(p.paymentAmountUsd)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Price/Token</div>
                          <div className="text-gray-300">{formatUsd(p.pricePerLiberty)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Chain</div>
                          <div className="text-gray-300">{p.chain.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span>{new Date(p.purchasedAt).toLocaleString()}</span>
                        {p.txHash && (
                          <span className="font-mono">{p.txHash.slice(0, 10)}...{p.txHash.slice(-6)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>

      <ConnectWalletModal ref={connectModalRef} />
    </div>
  );
};

export default AuctionProfile;
