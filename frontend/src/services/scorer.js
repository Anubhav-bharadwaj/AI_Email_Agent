export function scoreEmail(text) {
  if (!text) return { professionalism: 0, clarity: 0, grammar: 0, spamRisk: 0, overall: 0 };

  const lowerText = text.toLowerCase();
  
  // Professionalism (Check for formatting, greetings, sign-offs)
  let profScore = 70;
  if (lowerText.includes('dear') || lowerText.includes('hi') || lowerText.includes('hello')) profScore += 10;
  if (lowerText.includes('best regards') || lowerText.includes('sincerely') || lowerText.includes('thanks')) profScore += 10;
  if (!lowerText.includes('bro') && !lowerText.includes('dude') && !lowerText.includes('wtf')) profScore += 10;

  // Clarity (Check length and sentence count)
  let clarityScore = 80;
  const sentences = text.split(/[.!?]+/).length;
  if (sentences > 3 && sentences < 15) clarityScore += 15;
  if (text.length > 200 && text.length < 1500) clarityScore += 5;

  // Grammar (Heuristic: no multiple spaces, proper capitalization at start of sentences)
  let grammarScore = 85;
  if (text.includes('  ')) grammarScore -= 10; // Double spaces
  if (/[a-z]\.[a-z]/i.test(text)) grammarScore -= 5; // Missing space after period
  
  // Spam Risk (Lower is better, but we will return a score where 100 means NO spam risk)
  // Inverse scoring for spam
  let spamScore = 100;
  const spamWords = ['free', 'buy now', 'guarantee', 'act now', 'click here', '$$$', 'urgent', 'winner'];
  let spamCount = 0;
  spamWords.forEach(word => {
    if (lowerText.includes(word)) {
      spamCount++;
      spamScore -= 15;
    }
  });
  if (text.toUpperCase() === text && text.length > 20) spamScore -= 40; // All caps
  
  // Ensure bounds 0-100
  profScore = Math.max(0, Math.min(100, profScore));
  clarityScore = Math.max(0, Math.min(100, clarityScore));
  grammarScore = Math.max(0, Math.min(100, grammarScore));
  spamScore = Math.max(0, Math.min(100, spamScore));

  const overall = Math.round((profScore + clarityScore + grammarScore + spamScore) / 4);

  return {
    professionalism: profScore,
    clarity: clarityScore,
    grammar: grammarScore,
    spamRisk: spamScore,
    overall
  };
}
