import "./App.css";
import { useState, useEffect } from "react";
import CheckYourEligibility from "./components/CheckYourEligibility";
import DeveloperGrantsProgram from "./components/DeveloperGrantsProgram";
import Footer from "./components/Footer";
import GrantApplicationProcess from "./components/GrantApplicationProcess";
import JoinTheRevolution from "./components/JoinTheRevolution";
import LaunchCountdown from "./components/LaunchCountdown";
import LBTCCalculator from "./components/LBTCCalculator";
import MarqueeText from "./components/MarqueeText";
import NewsAndUpdates from "./components/NewsAndUpdates";
import ProjectPhases from "./components/ProjectPhases";
import StayUpdated from "./components/StayUpdated";
import TopSection from "./components/TopSection";
import Treasury from "./components/Treasury";
import WhyLiberty from "./components/WhyLiberty";
import VideoShowcase from "./components/VideoShowcase";
import ClaimLiberty from "./components/ClaimLiberty";
import AdminPanel from "./components/AdminPanel";
import BTCOwnership from "./components/BTCOwnership";
import TokenAuction from "./components/TokenAuction";
import PageLoader from "./components/PageLoader";
import { WalletProvider } from "./contexts/WalletContext";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (currentPath === '/admin') {
    return <AdminPanel />;
  }

  if (currentPath === '/ownership') {
    return (
      <WalletProvider>
        <BTCOwnership />
      </WalletProvider>
    );
  }

  if (currentPath === '/auction') {
    return (
      <WalletProvider>
        <TokenAuction />
      </WalletProvider>
    );
  }

  return (
    <WalletProvider>
      <PageLoader isLoading={isLoading} />
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <TopSection />
        <LaunchCountdown />
        <MarqueeText />
        <VideoShowcase />
        <LBTCCalculator />
        <CheckYourEligibility />
        <ProjectPhases />
        <WhyLiberty />
        <Treasury />
        <ClaimLiberty />
        <DeveloperGrantsProgram />
        <GrantApplicationProcess />
        <NewsAndUpdates />
        <StayUpdated />
        <JoinTheRevolution />
        <Footer />
      </div>
    </WalletProvider>
  );
}

export default App;
