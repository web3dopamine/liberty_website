import { useState } from "react";
import SubscriptionModal from "./SubscriptionModal";

const StayUpdated = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showModal = (type, message) => {
    setModal({ isOpen: true, type, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', message: '' });
  };

  const handleSubscribe = async () => {
    setError("");

    if (!email.trim()) {
      showModal('warning', 'Please enter your email address to stay updated on Liberty Bitcoin news.');
      return;
    }

    if (!validateEmail(email)) {
      showModal('warning', 'Please enter a valid email address (e.g., example@email.com).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        showModal('success', "You'll receive updates about snapshot dates, claim periods, and major announcements straight to your inbox!");
        setEmail("");
      } else {
        if (data.message === "Email already subscribed") {
          showModal('info', "This email is already on our list! You'll continue to receive all Liberty Bitcoin updates.");
        } else {
          showModal('error', data.message || "Failed to subscribe. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showModal('error', "An error occurred while processing your subscription. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <div className="flex flex-col bg-black py-16 md:py-20 text-center items-center px-4">
      <div className="text-4xl md:text-6xl lg:text-[96px] text-white z-2">Stay Updated</div>
      <div className="text-[#99A1AF] text-lg md:text-xl lg:text-[24px] mt-6 md:mt-8 z-2 px-4">
        Get notified about snapshot dates, claim periods, and major announcements.
      </div>

      <div className="bg-white flex flex-col md:flex-row justify-between w-full md:w-[875px] h-auto md:h-[64px] rounded-4xl mt-12 md:mt-20 items-center p-3 md:p-0 gap-3 md:gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="outline-none border-none px-4 md:px-15 w-full md:w-[580px]"
          placeholder="E - M A I L"
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubscribe}
          disabled={isSubmitting}
          className="bg-[#2C6468] h-[64px] rounded-4xl px-6 md:px-12 flex text-white items-center justify-center text-base md:text-[20px] cursor-pointer hover:text-black hover:bg-[#2C6468]/50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto whitespace-nowrap"
        >
          {isSubmitting ? "SUBSCRIBING..." : "S U B S C R I B E"}
        </button>
      </div>
      {error && (
        <div className="text-red-400 mt-4 text-[14px]">{error}</div>
      )}
      
      <SubscriptionModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        message={modal.message}
      />
    </div>
  );
};

export default StayUpdated;
