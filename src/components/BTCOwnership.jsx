import { useState } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";

const BTCOwnership = () => {
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [unsignedPsbt, setUnsignedPsbt] = useState("");
  const [signedPsbt, setSignedPsbt] = useState("");
  const { account, isConnected, truncateAddress } = useWallet();

  const handleCopy = () => {
    if (unsignedPsbt) {
      navigator.clipboard.writeText(unsignedPsbt);
      alert("Copied to clipboard!");
    }
  };

  const handleVerifySignature = () => {
    if (!signedPsbt.trim()) {
      alert("Please paste a signed PSBT or raw transaction");
      return;
    }
    // Verification logic would go here
    alert("Verification functionality will be implemented");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="w-full bg-black flex flex-row items-center justify-between px-20 lg:px-80 h-[89px] border-b border-white/10">
        <a href="/">
          <img src={FullLogo} className="h-[45px] cursor-pointer" alt="Liberty Logo" />
        </a>
        <div className="flex flex-row font-bold items-center gap-7 text-[14px] text-white">
          <a href="/" className="hover:text-[#4A9390] transition-colors">ELIGIBILITY</a>
          <a href="/" className="hover:text-[#4A9390] transition-colors">DEVELOPERS</a>
          <a href="/" className="hover:text-[#4A9390] transition-colors">BEGINNINGS</a>
          <a href="/" className="hover:text-[#4A9390] transition-colors">COMMUNITY</a>
          <button className="flex flex-row gap-2 border-[#448986] border px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
            {isConnected ? truncateAddress(account) : "CONNECT WALLET"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Page Title */}
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            Bitcoin Address <span className="text-[#4A9390]">Ownership</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Prove ownership without broadcasting. Sign and verify PSBTs.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#4A9390]/10 border border-[#4A9390]/30 rounded-full px-4 py-2 text-[#4A9390] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No Broadcast Required
          </div>
        </div>

        {/* Create Self-Send PSBT Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Self-Send PSBT</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitcoin Address
              </label>
              <input
                type="text"
                value={bitcoinAddress}
                onChange={(e) => setBitcoinAddress(e.target.value)}
                placeholder="bc1q8h03x5f8ny6gk1lm9qfg0vkg8s4bsdl3kg0..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unsigned PSBT (base64)
              </label>
              <textarea
                value={unsignedPsbt}
                onChange={(e) => setUnsignedPsbt(e.target.value)}
                placeholder="Your unsigned PSBT will appear here..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm bg-gray-50"
              />
            </div>

            <button
              onClick={handleCopy}
              disabled={!unsignedPsbt}
              className="inline-flex items-center gap-2 bg-[#4A9390] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A7875] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              COPY
            </button>
          </div>
        </div>

        {/* Verify Signed PSBT Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Signed PSBT or Raw Tx (No Broadcast)
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste signed PSBT (base64) starts with cPSBT or raw tx hex
              </label>
              <textarea
                value={signedPsbt}
                onChange={(e) => setSignedPsbt(e.target.value)}
                placeholder="cPSBT..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={handleVerifySignature}
              className="inline-flex items-center gap-2 bg-[#4A9390] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A7875] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Signature
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            No transactions are broadcast to the network. Everything happens locally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BTCOwnership;
