import { useState, useEffect, useRef } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";
import { motion } from "motion/react";

const TokenAuction = () => {
  const [activeTab, setActiveTab] = useState("MY ALLOCATION");
  const [bidAmount, setBidAmount] = useState("");
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();

  const auctionData = {
    totalCommitted: 1390735255,
    raiseCap: 49950000,
    oversubscribed: 27.8,
    hypotheticalFDV: 27814705109,
    maxFDVCap: 999000000,
    clearingPrice: 0.0999,
    status: "LIVE"
  };

  const topBids = [
    { bidder: "0x20e9...a8af", maxPrice: 0.0999, amount: 10994, time: "21 days ago" },
    { bidder: "0x39c8...ae14", maxPrice: 0.0999, amount: 3800, time: "21 days ago" },
    { bidder: "0x489b...ef62", maxPrice: 0.0999, amount: 2650, time: "21 days ago" },
    { bidder: "0x3deb...352c", maxPrice: 0.0999, amount: 17500, time: "21 days ago" },
    { bidder: "0x8ec2...6ebc", maxPrice: 0.0999, amount: 5167, time: "21 days ago" },
    { bidder: "0x4e62...2dcf", maxPrice: 0.0999, amount: 4998, time: "21 days ago" },
    { bidder: "0x47d0...bdc2", maxPrice: 0.0999, amount: 50046, time: "21 days ago" },
    { bidder: "0x787d...ce55", maxPrice: 0.0999, amount: 61000, time: "21 days ago" },
    { bidder: "0x5df2...fc56", maxPrice: 0.0999, amount: 50000, time: "21 days ago" },
    { bidder: "0x49b1...0695", maxPrice: 0.0999, amount: 101684, time: "21 days ago" },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePlaceBid = () => {
    if (!isConnected) {
      connectModalRef.current?.showModal();
      return;
    }
    alert("Bid placement will be implemented with smart contract integration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="w-full bg-black flex flex-row items-center justify-between px-20 lg:px-80 h-[89px] border-b border-white/10">
        <a href="/">
          <img src={FullLogo} className="h-[45px] cursor-pointer" alt="Liberty Logo" />
        </a>
        <div className="flex flex-row font-bold items-center gap-7 text-[14px] text-white">
          <a href="/" className="hover:text-[#4A9390] transition-colors">HOME</a>
          <a href="/#calculator" className="hover:text-[#4A9390] transition-colors">CALCULATOR</a>
          <a href="/ownership" className="hover:text-[#4A9390] transition-colors">CLAIM</a>
          <a href="/#developers" className="hover:text-[#4A9390] transition-colors">DEVELOPERS</a>
          <button 
            onClick={() => {
              if (isConnected) {
                const confirmDisconnect = window.confirm('Do you want to disconnect your wallet?');
                if (confirmDisconnect) {
                  disconnectWallet();
                }
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
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            LBTY Token <span className="text-[#4A9390]">Auction</span>
          </h1>
          <p className="text-gray-400 text-xl">
            Participate in the Liberty Bitcoin token sale
          </p>
        </motion.div>

        {/* Oversubscription Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-[#2D5F5D]/20 to-black border border-[#4A9390]/30 rounded-3xl p-8 mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">OVERSUBSCRIPTION</h2>
            <div className="inline-block bg-[#4A9390] text-white px-6 py-2 rounded-full text-sm font-bold">
              Auction Status: {auctionData.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/40 rounded-2xl p-6 border border-[#4A9390]/20">
              <div className="text-gray-400 text-sm mb-2">TOTAL COMMITTED AT MAX PRICE</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(auctionData.totalCommitted)}</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 border border-[#4A9390]/20">
              <div className="text-gray-400 text-sm mb-2">RAISE CAP</div>
              <div className="text-3xl font-bold text-[#4A9390]">{formatCurrency(auctionData.raiseCap)}</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 border border-[#4A9390]/20">
              <div className="text-gray-400 text-sm mb-2">OVERSUBSCRIBED BY</div>
              <div className="text-3xl font-bold text-white">{auctionData.oversubscribed}X</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-2xl p-6 border border-[#4A9390]/20">
              <div className="text-gray-400 text-sm mb-2">HYPOTHETICAL FDV WITH ALL COMMITS</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(auctionData.hypotheticalFDV)}</div>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 border border-[#4A9390]/20">
              <div className="text-gray-400 text-sm mb-2">MAX FDV CAP</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(auctionData.maxFDVCap)}</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-[#4A9390] to-[#2D5F5D] rounded-2xl p-6">
              <div className="text-white text-sm mb-2">💎 CLEARING PRICE</div>
              <div className="text-5xl font-bold text-white">${auctionData.clearingPrice.toFixed(4)}</div>
            </div>
          </div>
        </motion.div>

        {/* Top Bids Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Top Bids</h2>
            <button className="text-[#4A9390] hover:text-[#3A7875] font-semibold text-sm">
              MORE →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">BIDDER</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">MAX PRICE</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">AMOUNT</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">BID TIME</th>
                </tr>
              </thead>
              <tbody>
                {topBids.map((bid, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm text-gray-900">{bid.bidder}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-[#4A9390]/10 text-[#4A9390] px-3 py-1 rounded-full text-sm font-semibold">
                        ${bid.maxPrice.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">{formatCurrency(bid.amount)}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{bid.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex border-b border-gray-200">
            {["MY ALLOCATION", "FACTS", "HOW IT WORKS", "TIMELINE", "FAQ"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? "bg-[#4A9390] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "MY ALLOCATION" && (
              <div>
                {!isConnected ? (
                  <div className="text-center py-12">
                    <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h3>
                    <p className="text-gray-600 mb-6">You need to connect your wallet first to view your allocation.</p>
                    <button
                      onClick={() => connectModalRef.current?.showModal()}
                      className="inline-flex items-center gap-2 bg-[#4A9390] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3A7875] transition-all transform hover:scale-105"
                    >
                      CONNECT WALLET
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#4A9390]/10 to-transparent border border-[#4A9390]/30 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Token Allocation</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">MY ALLOCATION</div>
                          <div className="text-2xl font-bold text-gray-900">--</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">STATUS</div>
                          <div className="text-2xl font-bold text-gray-900">--</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">MAX TOKEN PRICE</div>
                          <div className="text-2xl font-bold text-gray-900">--</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">DISCOUNT</div>
                          <div className="text-2xl font-bold text-gray-900">N/A</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Bid Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">TOTAL BID AMOUNT</span>
                          <span className="font-bold text-gray-900">--</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ALLOCATED AMOUNT</span>
                          <span className="font-bold text-gray-900">--</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DISCOUNT</span>
                          <span className="font-bold text-gray-900">N/A</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Total Refund</h3>
                      <div className="text-3xl font-bold text-gray-900">--</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "FACTS" && (
              <div className="space-y-6">
                <div className="bg-[#4A9390]/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Auction Facts</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Token Allocation:</strong> 5% of total LBTY supply (500M tokens)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Price Range:</strong> $0.01 - $0.50 per LBTY</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Minimum Bid:</strong> $1,000 USDT</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Maximum Bid:</strong> $100,000 USDT per wallet</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Duration:</strong> 72 hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#4A9390] font-bold">•</span>
                      <span><strong>Payment:</strong> USDT on Ethereum</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "HOW IT WORKS" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">English Auction Mechanism</h3>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Connect & Place Bid</h4>
                      <p className="text-gray-600">Connect your wallet and enter your bid amount (min $1,000, max $100,000).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Price Discovery</h4>
                      <p className="text-gray-600">The auction starts at $0.01 and increases based on demand until it reaches the ceiling price or time expires.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Allocation</h4>
                      <p className="text-gray-600">If oversubscribed, tokens are allocated proportionally. Priority given to verified BTC holders.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Claim Tokens</h4>
                      <p className="text-gray-600">After auction ends, claim your LBTY tokens. Excess funds are automatically refunded.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "TIMELINE" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Auction Timeline</h3>
                <div className="relative border-l-2 border-[#4A9390] pl-8 space-y-8">
                  <div>
                    <div className="absolute -left-3 w-6 h-6 bg-[#4A9390] rounded-full"></div>
                    <div className="text-sm text-gray-500 mb-1">Q1 2026</div>
                    <h4 className="font-bold text-gray-900 mb-2">Auction Opens</h4>
                    <p className="text-gray-600">Public sale begins with 72-hour bidding period</p>
                  </div>
                  <div>
                    <div className="absolute -left-3 w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-500 mb-1">Q1 2026 + 3 days</div>
                    <h4 className="font-bold text-gray-900 mb-2">Auction Closes</h4>
                    <p className="text-gray-600">Final price determined, allocations calculated</p>
                  </div>
                  <div>
                    <div className="absolute -left-3 w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-500 mb-1">February 10, 2026</div>
                    <h4 className="font-bold text-gray-900 mb-2">Token Distribution</h4>
                    <p className="text-gray-600">LBTY tokens distributed to participants</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "FAQ" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2">Who can participate?</h4>
                    <p className="text-gray-600">Anyone with a compatible wallet and USDT. Verified BTC holders get priority allocation.</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2">What happens if I don't get my full allocation?</h4>
                    <p className="text-gray-600">Excess funds are automatically refunded to your wallet after the auction ends.</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2">Are there lock-up periods?</h4>
                    <p className="text-gray-600">Optional: 6-month (5% discount), 12-month (10% discount), or 24-month (15% discount) lock-ups available.</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2">When do I receive my tokens?</h4>
                    <p className="text-gray-600">Tokens are distributed on February 10, 2026 at 12:00 AM UTC (main launch date).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Place Bid Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-[#4A9390] to-[#2D5F5D] rounded-3xl p-8 mt-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Place Your Bid</h2>
          
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="mb-6 text-lg">Connect your wallet to participate in the auction</p>
              <button
                onClick={() => connectModalRef.current?.showModal()}
                className="bg-white text-[#4A9390] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                CONNECT WALLET
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">BID AMOUNT (USDT)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Min: $1,000 | Max: $100,000"
                  className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => setBidAmount("1000")}
                  className="bg-white/20 hover:bg-white/30 py-3 rounded-lg font-semibold transition-all"
                >
                  $1K
                </button>
                <button
                  onClick={() => setBidAmount("5000")}
                  className="bg-white/20 hover:bg-white/30 py-3 rounded-lg font-semibold transition-all"
                >
                  $5K
                </button>
                <button
                  onClick={() => setBidAmount("10000")}
                  className="bg-white/20 hover:bg-white/30 py-3 rounded-lg font-semibold transition-all"
                >
                  $10K
                </button>
                <button
                  onClick={() => setBidAmount("100000")}
                  className="bg-white/20 hover:bg-white/30 py-3 rounded-lg font-semibold transition-all"
                >
                  MAX
                </button>
              </div>

              <button
                onClick={handlePlaceBid}
                disabled={!bidAmount || parseFloat(bidAmount) < 1000 || parseFloat(bidAmount) > 100000}
                className="w-full bg-white text-[#4A9390] px-8 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                PLACE BID
              </button>

              <p className="text-center text-sm mt-4 text-white/80">
                By placing a bid, you agree to the auction terms and conditions
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <ConnectWalletModal ref={connectModalRef} />
    </div>
  );
};

export default TokenAuction;
