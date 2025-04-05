import React, { useState } from "react";
import Envelope from "../components/Envelope";
import ProposalLetter from "../components/ProposalLetter";
import Celebration from "../components/Celebration";
import MPINScreen from "../components/MPINScreen";
import ButterflyBackground from "../components/ButterflyBackground";
import AnniversaryCountdown from "../components/AnniversaryCountdown";

const Index = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);

  // Set anniversary date to April 7, 2025
  const anniversaryDate = new Date(2025, 3, 7);

  const handleResponse = (response: boolean) => {
    if (response) {
      setShowCelebration(true);
    }
  };

  const handleMPINSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  if (!isAuthenticated) {
    return <MPINScreen onSuccess={handleMPINSuccess} />;
  }

  if (showCountdown) {
    return (
      <AnniversaryCountdown
        onNext={handleCountdownComplete}
        anniversaryDate={anniversaryDate}
      />
    );
  }

  if (showCelebration) {
    return <Celebration />;
  }

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <ButterflyBackground />
      {!isEnvelopeOpen ? (
        <Envelope onClick={() => setIsEnvelopeOpen(true)} />
      ) : (
        <ProposalLetter onResponse={handleResponse} />
      )}
    </div>
  );
};

export default Index;
