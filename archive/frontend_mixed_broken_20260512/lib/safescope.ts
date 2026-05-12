export async function analyzePhoto(base64: string) {
  // 🔥 MOCK AI (replace later with real model)

  // Simple keyword simulation based on image size/randomness
  // This keeps your flow working immediately

  const hazards = [
    'Unguarded edge',
    'Loose electrical wiring',
    'Trip hazard (debris)',
    'Missing PPE',
    'Improper ladder use'
  ];

  const random = hazards[Math.floor(Math.random() * hazards.length)];

  return {
    hazard: random,
    confidence: 0.78
  };
}

