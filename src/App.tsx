import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LotteryButton } from './components/LotteryButton';
import { ResultModal } from './components/ResultModal';
import { SettingsModal } from './components/SettingsModal';
import { AnticipationModal } from './components/AnticipationModal';
import { useLotteryStore } from './store/lotteryStore';

const App: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAnticipation, setShowAnticipation] = useState(false);
  const [pendingResult, setPendingResult] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { addResult } = useLotteryStore();

  const handleResult = (tierId: string) => {
    console.log('Lottery result received:', tierId);
    setPendingResult(tierId);
    setShowAnticipation(true);
  };

  const handleAnticipationComplete = () => {
    console.log('Anticipation complete, showing result:', pendingResult);
    if (pendingResult) {
      setResult(pendingResult);
      setPendingResult(null);
    }
    setShowAnticipation(false);
  };

  const handleResultClose = () => {
    console.log('Closing result modal');
    setResult(null);
  };

  const handleResultMount = (tierId: string | null) => {
    console.log('Result modal mounted, adding result:', tierId);
    if (tierId) {
      addResult(tierId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onOpenSettings={() => setShowSettings(true)} />
      
      <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LotteryButton onResult={handleResult} />
      </main>

      <Footer />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <AnticipationModal
        isOpen={showAnticipation}
        onComplete={handleAnticipationComplete}
      />

      <ResultModal
        tierId={result}
        onClose={handleResultClose}
        onMount={handleResultMount}
      />
    </div>
  );
};

export default App;