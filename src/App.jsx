import "./App.css";
import { useState, useEffect } from "react";
import CheckYourEligibility from "./components/CheckYourEligibility";
import ClaimYourLBTC from "./components/ClaimYourLBTC";
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
import AdminPanel from "./components/AdminPanel";
import { WalletProvider } from "./contexts/WalletContext";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/admin') {
    return <AdminPanel />;
  }

  return (
    <WalletProvider>
      <div>
        <TopSection />
        <LaunchCountdown />
        <MarqueeText />
        <LBTCCalculator />
        <CheckYourEligibility />
        <ProjectPhases />
        <WhyLiberty />
        <ClaimYourLBTC />
        <Treasury />
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
