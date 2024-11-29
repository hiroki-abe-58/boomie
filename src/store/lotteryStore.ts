import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PrizeTier } from '../types/lottery';

interface LotteryState {
  settings: {
    anticipationDuration: number;
    logoUrl: string;
  };
  prizeTiers: PrizeTier[];
  showResults: boolean;
  updateSettings: (settings: Partial<LotteryState['settings']>) => void;
  updatePrizeTier: (id: string, tier: Partial<PrizeTier>) => void;
  addPrizeTier: () => void;
  removePrizeTier: (id: string) => void;
  addResult: (tierId: string) => void;
  reset: () => void;
  toggleResultsVisibility: () => void;
}

const createDefaultResultConfig = (title: string, isFirst: boolean = false) => ({
  title,
  modalText: title,
  sound1: isFirst 
    ? 'https://shussher.net/static/sound/lottery-success.mp3'
    : title === '参加賞'
    ? 'https://shussher.net/static/sound/lottery-bad.mp3'
    : 'https://shussher.net/static/sound/lottery-normal.mp3',
  sound1Volume: 50,
  sound2: isFirst
    ? 'https://shussher.net/static/sound/lottery-success-voice.mp3'
    : title === '参加賞'
    ? 'https://shussher.net/static/sound/lottery-bad-voice.mp3'
    : 'https://shussher.net/static/sound/lottery-normal-voice.mp3',
  sound2Volume: 70,
});

const initialSettings = {
  anticipationDuration: 2,
  logoUrl: 'https://shussher.net/static/img/icon/logo.png',
};

const initialPrizeTiers: PrizeTier[] = [
  {
    id: 'consolation',
    probability: 0,
    count: 100,
    wonCount: 0,
    config: createDefaultResultConfig('参加賞'),
  },
  {
    id: 'first',
    probability: 10,
    count: 2,
    wonCount: 0,
    config: createDefaultResultConfig('1等', true),
  },
  {
    id: 'second',
    probability: 20,
    count: 5,
    wonCount: 0,
    config: createDefaultResultConfig('2等'),
  },
];

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      settings: initialSettings,
      prizeTiers: initialPrizeTiers,
      showResults: true,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updatePrizeTier: (id, tier) =>
        set((state) => ({
          prizeTiers: state.prizeTiers.map((t) =>
            t.id === id ? { ...t, ...tier } : t
          ),
        })),
      addPrizeTier: () =>
        set((state) => {
          const nonConsolationTiers = state.prizeTiers.filter(t => t.id !== 'consolation');
          const nextTierNumber = nonConsolationTiers.length + 1;
          
          const newTier: PrizeTier = {
            id: `tier${Date.now()}`,
            probability: 20,
            count: 5,
            wonCount: 0,
            config: createDefaultResultConfig(`${nextTierNumber}等`),
          };
          return {
            prizeTiers: [...state.prizeTiers, newTier],
          };
        }),
      removePrizeTier: (id) =>
        set((state) => ({
          prizeTiers: state.prizeTiers.filter((t) => t.id !== id),
        })),
      addResult: (tierId) =>
        set((state) => {
          const tier = state.prizeTiers.find((t) => t.id === tierId);
          if (!tier || tier.wonCount >= tier.count) {
            return state;
          }
          return {
            prizeTiers: state.prizeTiers.map((t) =>
              t.id === tierId ? { ...t, wonCount: t.wonCount + 1 } : t
            ),
          };
        }),
      toggleResultsVisibility: () =>
        set((state) => ({
          showResults: !state.showResults,
        })),
      reset: () =>
        set({
          settings: initialSettings,
          prizeTiers: initialPrizeTiers,
          showResults: true,
        }),
    }),
    {
      name: 'lottery-storage',
      skipHydration: false,
    }
  )
);