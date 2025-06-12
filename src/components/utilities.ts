export function calculateScore(guess: string, correct: number): number {
  if (guess === undefined || guess === "") return 0;
  const g = Number(guess);
  if (isNaN(g)) return 0;
  const diff = Math.abs(g - correct);

  const maxScore = 1000;
  const spread = 16; // Smaller = sharper drop, bigger = more forgiving
  const maxDiff = 150; // 0 after this

  if (diff >= maxDiff) return 0;

  // Pure Gaussian (bell curve)
  const score = maxScore * Math.exp(-0.5 * (diff / spread) ** 2);
  return Math.round(score);
}