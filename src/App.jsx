import "./App.css";
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

function App() {
  return (
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
  );
}

export default App;
