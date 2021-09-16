async function createQuestiongroup(lithiumPricing) {
  const args = await mockQuestionData();
  console.log("\n\n 📡 Creating mock question groups \n");
  for (var i = 0; i < args.length; i++) {
    await lithiumPricing.createQuestionGroup(...args[i]);
  }
}