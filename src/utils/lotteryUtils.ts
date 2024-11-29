import { PrizeTier } from '../types/lottery';

export const calculateLotteryResult = (prizeTiers: PrizeTier[]): string | null => {
  // 全ての景品が配布済みかチェック
  if (prizeTiers.every(tier => tier.wonCount >= tier.count)) {
    return null;
  }

  // 抽選確率の計算
  const random = Math.random() * 100;
  let currentProbability = 0;

  // 通常の景品の抽選（参加賞以外）
  for (const tier of prizeTiers) {
    // 参加賞はスキップ
    if (tier.id === 'consolation') continue;
    
    // 在庫切れの景品はスキップ
    if (tier.wonCount >= tier.count) continue;

    currentProbability += tier.probability;
    if (random <= currentProbability) {
      console.log(`Won prize: ${tier.id} with probability ${currentProbability} (random: ${random})`);
      return tier.id;
    }
  }

  // 参加賞の確認
  const consolationTier = prizeTiers.find(t => t.id === 'consolation');
  if (consolationTier && consolationTier.wonCount < consolationTier.count) {
    console.log('Consolation prize awarded');
    return 'consolation';
  }

  console.log('No prize awarded');
  return null;
};