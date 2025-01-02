export function calculateAccuracy(totalMistakes: number, totalChars: number) {
  if (totalChars === 0) return "0"; // Handle edge case where totalChars is 0
  const accuracy = (1 - totalMistakes / totalChars) * 100;
  return accuracy.toFixed(0); // Round to nearest whole number as a string
}
