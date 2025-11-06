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
import ParallaxSection from "./components/ParallaxSection";

function App() {
  return (
    <div>
      <TopSection />
      <ParallaxSection offset={30}>
        <LaunchCountdown />
      </ParallaxSection>
      <ParallaxSection offset={40}>
        <MarqueeText />
      </ParallaxSection>
      <ParallaxSection offset={50}>
        <LBTCCalculator />
      </ParallaxSection>
      <ParallaxSection offset={35}>
        <CheckYourEligibility />
      </ParallaxSection>
      <ParallaxSection offset={45}>
        <ProjectPhases />
      </ParallaxSection>
      <ParallaxSection offset={40}>
        <WhyLiberty />
      </ParallaxSection>
      <ParallaxSection offset={50}>
        <ClaimYourLBTC />
      </ParallaxSection>
      <ParallaxSection offset={55}>
        <Treasury />
      </ParallaxSection>
      <ParallaxSection offset={40}>
        <DeveloperGrantsProgram />
      </ParallaxSection>
      <ParallaxSection offset={45}>
        <GrantApplicationProcess />
      </ParallaxSection>
      <ParallaxSection offset={35}>
        <NewsAndUpdates />
      </ParallaxSection>
      <ParallaxSection offset={40}>
        <StayUpdated />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <JoinTheRevolution />
      </ParallaxSection>
      <ParallaxSection offset={20}>
        <Footer />
      </ParallaxSection>
    </div>
  );
}

export default App;
