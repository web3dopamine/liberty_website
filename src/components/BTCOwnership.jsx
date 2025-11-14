import { useState, useEffect } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";

const BTCOwnership = () => {
  const [activeTab, setActiveTab] = useState("psbt");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [unsignedPsbt, setUnsignedPsbt] = useState("");
  const [signedPsbt, setSignedPsbt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [utxoInfo, setUtxoInfo] = useState(null);
  
  // Message signature states
  const [msgAddress, setMsgAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const { account, isConnected, truncateAddress } = useWallet();

  // Auto-fill address from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressFromUrl = urlParams.get('address');
    if (addressFromUrl) {
      setBitcoinAddress(addressFromUrl);
      setMsgAddress(addressFromUrl);
    }
  }, []);

  const handleGeneratePsbt = async () => {
    if (!bitcoinAddress.trim()) {
      alert("Please enter a Bitcoin address");
      return;
    }

    setIsGenerating(true);
    setUnsignedPsbt("");
    setUtxoInfo(null);

    try {
      const response = await fetch("/api/bitcoin/createPsbtFromAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: bitcoinAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate PSBT");
      }

      setUnsignedPsbt(data.psbt);
      setUtxoInfo({
        utxoCount: data.utxoCount,
        amountBtc: data.amountBtc,
        txid: data.txid,
        vout: data.vout,
      });
    } catch (error) {
      alert(error.message || "Failed to generate PSBT. Make sure Bitcoin Core RPC is configured.");
      console.error("PSBT generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleVerifyMessage = async () => {
    if (!msgAddress.trim() || !signature.trim()) {
      alert("Please enter both Bitcoin address and signature");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch("/api/bitcoin/verifyMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          address: msgAddress, 
          signature: signature,
          message: `I own this Bitcoin address: ${msgAddress}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify signature");
      }

      setVerificationResult({
        valid: data.valid,
        message: data.message
      });
    } catch (error) {
      setVerificationResult({
        valid: false,
        message: error.message || "Failed to verify signature"
      });
    } finally {
      setIsVerifying(false);
    }
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
          <a href="/" className="hover:text-[#4A9390] transition-colors">RESOURCES</a>
          <a href="/" className="hover:text-[#4A9390] transition-colors">COMMUNITY</a>
          <button className="flex flex-row gap-2 border-[#448986] border px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
            {isConnected ? truncateAddress(account) : "CONNECT WALLET"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Bitcoin Address <span className="text-[#4A9390]">Ownership</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Prove ownership without broadcasting. Choose your verification method.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#4A9390]/10 border border-[#4A9390]/30 rounded-full px-4 py-2 text-[#4A9390] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No Broadcast Required
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("psbt")}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === "psbt"
                ? "text-[#4A9390] border-b-2 border-[#4A9390]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            PSBT Method
          </button>
          <button
            onClick={() => setActiveTab("message")}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === "message"
                ? "text-[#4A9390] border-b-2 border-[#4A9390]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Message Signature
          </button>
        </div>

        {/* PSBT Tab Content */}
        {activeTab === "psbt" && (
          <>
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
              <div className="flex gap-3">
                <input
                  type="text"
                  value={bitcoinAddress}
                  onChange={(e) => setBitcoinAddress(e.target.value)}
                  placeholder="bc1q8h03x5f8ny6gk1lm9qfg0vkg8s4bsdl3kg0..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent"
                />
                <button
                  onClick={handleGeneratePsbt}
                  disabled={isGenerating || !bitcoinAddress.trim()}
                  className="px-6 py-3 bg-[#4A9390] text-white rounded-lg font-semibold hover:bg-[#3A7875] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isGenerating ? "Generating..." : "Generate PSBT"}
                </button>
              </div>
              {utxoInfo && (
                <div className="mt-2 text-sm text-gray-600">
                  ✓ Found {utxoInfo.utxoCount} UTXO(s). Using {utxoInfo.amountBtc.toFixed(8)} BTC from txid: {utxoInfo.txid.slice(0, 16)}...
                </div>
              )}
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
          </>
        )}

        {/* Message Signature Tab Content */}
        {activeTab === "message" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify Message Signature</h2>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>How it works:</strong> Sign the message "I own this Bitcoin address: [your-address]" 
                  with your Bitcoin wallet (XVerse, Unisat, OKX, Ledger, etc.) and paste the signature below to verify ownership.
                </p>
              </div>

              {/* Bitcoin Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitcoin Address
                </label>
                <input
                  type="text"
                  value={msgAddress}
                  onChange={(e) => setMsgAddress(e.target.value)}
                  placeholder="bc1q... or 1... or 3..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent"
                />
              </div>

              {/* Message to Sign (Display Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Sign (Copy this exact text)
                </label>
                <div className="relative">
                  <textarea
                    value={msgAddress ? `I own this Bitcoin address: ${msgAddress}` : "Enter address first..."}
                    readOnly
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => {
                      if (msgAddress) {
                        navigator.clipboard.writeText(`I own this Bitcoin address: ${msgAddress}`);
                        alert("Message copied to clipboard!");
                      }
                    }}
                    disabled={!msgAddress}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-semibold disabled:opacity-50"
                  >
                    COPY
                  </button>
                </div>
              </div>

              {/* Signature Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature (from your wallet)
                </label>
                <textarea
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Paste signature here..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyMessage}
                disabled={isVerifying || !msgAddress.trim() || !signature.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4A9390] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A7875] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isVerifying ? "Verifying..." : "Verify Signature"}
              </button>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`rounded-lg p-4 ${
                  verificationResult.valid 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {verificationResult.valid ? (
                      <>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold text-green-800">✅ Signature Valid!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-semibold text-red-800">❌ Signature Invalid</span>
                      </>
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${verificationResult.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {verificationResult.message}
                  </p>
                </div>
              )}

              {/* Help Text */}
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  Simple and fast verification compatible with most Bitcoin wallets.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BTCOwnership;
