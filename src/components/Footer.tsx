import React, { useState } from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useLotteryStore } from '../store/lotteryStore';
import { ResultConfigModal } from './ResultConfigModal';

export const Footer: React.FC = () => {
  const { prizeTiers, showResults, toggleResultsVisibility, addPrizeTier } = useLotteryStore();
  const [configTierId, setConfigTierId] = useState<string | null>(null);

  // Sort tiers to ensure consolation prize is first, followed by numbered prizes
  const sortedTiers = [...prizeTiers].sort((a, b) => {
    if (a.id === 'consolation') return -1;
    if (b.id === 'consolation') return 1;
    return prizeTiers.indexOf(a) - prizeTiers.indexOf(b);
  });

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8 transition-opacity duration-300" style={{ opacity: showResults ? 1 : 0 }}>
            {sortedTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setConfigTierId(tier.id)}
                className="text-sm text-center hover:text-pink-400 transition-colors"
              >
                <div className="font-semibold text-pink-400">{tier.config.title}</div>
                <div className="text-white">{tier.wonCount} / {tier.count}</div>
              </button>
            ))}
            <button
              onClick={addPrizeTier}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5 text-pink-400" />
            </button>
          </div>
          
          <button
            onClick={toggleResultsVisibility}
            className="rounded-full p-2 transition-colors hover:bg-gray-800"
            aria-label={showResults ? '結果を非表示' : '結果を表示'}
          >
            {!showResults ? (
              <EyeOff className="h-5 w-5 text-pink-400" />
            ) : (
              <Eye className="h-5 w-5 text-pink-400" />
            )}
          </button>
        </div>
      </footer>

      <ResultConfigModal
        tierId={configTierId}
        onClose={() => setConfigTierId(null)}
      />
    </>
  );
};