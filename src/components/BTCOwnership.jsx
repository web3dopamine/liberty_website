import { useState, useEffect, useRef } from "react";
import { FullLogo } from "../assets/images";
import { useWallet } from "../contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";

const LibertyAddressModal = ({ isOpen, address, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
          Confirm Your Liberty Address
        </h3>
        <p className="text-gray-600 text-sm text-center mb-5">
          Please verify that this is the correct address. Your LIBERTY tokens will be sent <strong>only</strong> to this address and this action <strong>cannot be changed</strong> later.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 mb-1">Your Liberty Address</div>
          <div className="text-sm font-mono text-gray-900 break-all">{address}</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#4A9390] text-white rounded-xl font-semibold hover:bg-[#3A7875] transition-all"
          >
            I Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

async function safeJsonFetch(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server error: Bitcoin Core RPC is not reachable. Please contact support.");
  }
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

const BTCOwnership = () => {
  const [activeTab, setActiveTab] = useState("psbt");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [unsignedPsbt, setUnsignedPsbt] = useState("");
  const [signedPsbt, setSignedPsbt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [utxoInfo, setUtxoInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [msgAddress, setMsgAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  
  const connectModalRef = useRef(null);
  const { account, isConnected, truncateAddress, disconnectWallet } = useWallet();

  useEffect(() => {
    if (isConnected && account && !addressConfirmed) {
      setShowAddressModal(true);
    }
    if (!isConnected) {
      setAddressConfirmed(false);
    }
  }, [isConnected, account]);

  const handleGeneratePsbt = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }
    
    if (!bitcoinAddress.trim()) {
      setErrorMessage("Bitcoin address is required. Please enter your Bitcoin address.");
      return;
    }

    setIsGenerating(true);
    setUnsignedPsbt("");
    setUtxoInfo(null);
    setErrorMessage("");

    try {
      const data = await safeJsonFetch("/api/bitcoin/createPsbtFromAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: bitcoinAddress }),
      });

      setUnsignedPsbt(data.psbt);
      setUtxoInfo({
        utxoCount: data.utxoCount,
        amountBtc: data.amountBtc,
        txid: data.txid,
        vout: data.vout,
      });
    } catch (error) {
      setErrorMessage(error.message);
      console.error("PSBT generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (unsignedPsbt) {
      navigator.clipboard.writeText(unsignedPsbt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [psbtResult, setPsbtResult] = useState(null);
  const [isVerifyingPsbt, setIsVerifyingPsbt] = useState(false);

  const handleVerifySignature = async () => {
    if (!signedPsbt.trim()) {
      setErrorMessage("Please paste a signed PSBT or raw transaction.");
      return;
    }
    if (!isConnected || !account) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    setIsVerifyingPsbt(true);
    setPsbtResult(null);
    setErrorMessage("");

    try {
      const data = await safeJsonFetch("/api/bitcoin/verifyPsbt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedPsbt: signedPsbt,
          btcAddress: bitcoinAddress,
          libertyAddress: account,
        }),
      });
      setPsbtResult(data);
    } catch (error) {
      setPsbtResult({ valid: false, message: error.message || "Failed to verify PSBT" });
    } finally {
      setIsVerifyingPsbt(false);
    }
  };

  const handleVerifyMessage = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }
    
    if (!msgAddress.trim() || !signature.trim()) {
      setErrorMessage("Please enter both Bitcoin address and signature.");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setErrorMessage("");

    try {
      const data = await safeJsonFetch("/api/bitcoin/verifyMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          address: msgAddress, 
          signature: signature,
          message: `I claim ${account} for Bitcoin address ${msgAddress}`,
          libertyAddress: account
        }),
      });

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
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Claiming <span className="text-[#4A9390]">Liberty</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Link your Bitcoin address to your Liberty address in 3 simple steps.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#4A9390]/10 border border-[#4A9390]/30 rounded-full px-4 py-2 text-[#4A9390] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No Broadcast Required
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300 text-sm">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Copied Toast */}
        {copied && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in">
            Copied to clipboard!
          </div>
        )}

        {/* Wallet Connection Required Notice */}
        {!isConnected && (
          <div className="bg-gradient-to-r from-[#4A9390]/20 to-[#2D5F5D]/20 border-2 border-[#4A9390] rounded-2xl p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-[#4A9390]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Step 1: Connect Your Wallet</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Connect your wallet to see your Liberty address where you'll receive LIBERTY tokens.
            </p>
            <button
              onClick={() => connectModalRef.current?.showModal()}
              className="inline-flex items-center gap-2 bg-[#4A9390] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3A7875] transition-all transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Wallet
            </button>
          </div>
        )}

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
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Link Your Bitcoin Address</h2>
          </div>

          <div className="space-y-4">
            {/* Liberty Address - Connected Wallet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liberty Address (Where You'll Receive LIBERTY)
              </label>
              <input
                type="text"
                value={account || ""}
                readOnly
                placeholder="Connect wallet to see your Liberty address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm cursor-not-allowed"
              />
            </div>

            {/* Bitcoin Address - Manual Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bitcoin Address
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={bitcoinAddress}
                  onChange={(e) => setBitcoinAddress(e.target.value)}
                  placeholder="bc1q8h03x5f8ny6gk1lm9qfg0vkg8s4bsdl3kg0..."
                  disabled={!isConnected}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleGeneratePsbt}
                  disabled={!isConnected || isGenerating || !bitcoinAddress.trim()}
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
                disabled={!isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleCopy}
              disabled={!isConnected || !unsignedPsbt}
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
              3
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Your Signature
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signed PSBT (Paste your signed PSBT here)
              </label>
              <textarea
                value={signedPsbt}
                onChange={(e) => setSignedPsbt(e.target.value)}
                placeholder="Paste your signed PSBT (starts with cPSBT) or raw transaction hex..."
                rows="6"
                disabled={!isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleVerifySignature}
              disabled={!isConnected || !signedPsbt.trim() || isVerifyingPsbt}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#4A9390] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A7875] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isVerifyingPsbt ? "Verifying..." : "Verify & Complete Claim"}
            </button>

            {psbtResult && (
              <div className={`rounded-lg p-4 mt-4 ${
                psbtResult.valid 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {psbtResult.valid ? (
                    <span className="font-semibold text-green-800">Claim Saved Successfully!</span>
                  ) : (
                    <span className="font-semibold text-red-800">Verification Failed</span>
                  )}
                </div>
                <p className={`text-sm mt-2 ${psbtResult.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {psbtResult.message}
                </p>
                {psbtResult.claim && (
                  <div className="mt-3 text-sm text-green-700 space-y-1">
                    <div>BTC Balance: <strong>{psbtResult.claim.btcBalance} BTC</strong></div>
                    <div>LIBERTY Entitlement: <strong>{psbtResult.claim.libertyEntitlement} LIBERTY</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

            {/* Footer Note */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                By verifying your signature, you're linking your Bitcoin address to your Liberty address. No transactions are broadcast to the network.
              </p>
            </div>
          </>
        )}

        {/* Message Signature Tab Content */}
        {activeTab === "message" && (
          <>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Link Your Bitcoin Address</h2>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>How it works:</strong> Sign a message linking your Liberty address to your Bitcoin address 
                  using your Bitcoin wallet (XVerse, Unisat, OKX, Ledger, etc.).
                </p>
              </div>

              {/* Liberty Address - Connected Wallet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liberty Address (Where You'll Receive LIBERTY)
                </label>
                <input
                  type="text"
                  value={account || ""}
                  readOnly
                  placeholder="Connect wallet to see your Liberty address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm cursor-not-allowed"
                />
              </div>

              {/* Bitcoin Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bitcoin Address
                </label>
                <input
                  type="text"
                  value={msgAddress}
                  onChange={(e) => setMsgAddress(e.target.value)}
                  placeholder="bc1q... or 1... or 3..."
                  disabled={!isConnected}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Message to Sign (Display Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Sign (Copy this exact text)
                </label>
                <div className="relative">
                  <textarea
                    value={msgAddress && account ? `I claim ${account} for Bitcoin address ${msgAddress}` : "Enter Bitcoin address and connect wallet first..."}
                    readOnly
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={() => {
                      if (msgAddress && account) {
                        navigator.clipboard.writeText(`I claim ${account} for Bitcoin address ${msgAddress}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    disabled={!isConnected || !msgAddress}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    COPY
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Step 3 - Verify Signature */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#4A9390] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Signature</h2>
            </div>

            <div className="space-y-4">
              {/* Signature Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature (Paste the signature from your Bitcoin wallet)
                </label>
                <textarea
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Paste your signature here..."
                  rows="4"
                  disabled={!isConnected}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9390] focus:border-transparent font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyMessage}
                disabled={!isConnected || isVerifying || !msgAddress.trim() || !signature.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4A9390] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A7875] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isVerifying ? "Verifying..." : "Verify & Complete Claim"}
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
                  {verificationResult.claim && (
                    <div className="mt-3 text-sm text-green-700 space-y-1">
                      <div>BTC Balance: <strong>{verificationResult.claim.btcBalance} BTC</strong></div>
                      <div>LIBERTY Entitlement: <strong>{verificationResult.claim.libertyEntitlement} LIBERTY</strong></div>
                    </div>
                  )}
                  
                  {/* Share on X Button - Only show when valid */}
                  {verificationResult.valid && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `I just verified my Bitcoin ownership and linked it to my Liberty address! 🚀\n\nReady to claim LIBERTY tokens at 1:10 ratio when Liberty Bitcoin launches! ₿\n\n#LibertyBitcoin #LIBERTY #Bitcoin`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                      </a>
                    </div>
                  )}
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
          </>
        )}
      </div>

      <ConnectWalletModal ref={connectModalRef} />
      <LibertyAddressModal
        isOpen={showAddressModal}
        address={account}
        onConfirm={() => {
          setAddressConfirmed(true);
          setShowAddressModal(false);
        }}
        onClose={() => {
          setShowAddressModal(false);
          disconnectWallet();
        }}
      />
    </div>
  );
};

export default BTCOwnership;
