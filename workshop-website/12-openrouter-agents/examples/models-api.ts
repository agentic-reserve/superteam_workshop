/**
 * OpenRouter Models API
 * Discover and filter available models dynamically
 */

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider?: {
    is_moderated: boolean;
  };
}

/**
 * Fetch all available models from OpenRouter
 */
export async function fetchModels(): Promise<OpenRouterModel[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = await res.json();
  return data.data;
}

/**
 * Find models by criteria
 */
export async function findModels(filter: {
  author?: string;        // e.g., 'anthropic', 'openai', 'google'
  minContext?: number;    // e.g., 100000 for 100k context
  maxPromptPrice?: number; // e.g., 0.001 for cheap models
  nameContains?: string;  // e.g., 'claude', 'gpt'
}): Promise<OpenRouterModel[]> {
  const models = await fetchModels();
  
  return models.filter((m) => {
    if (filter.author && !m.id.startsWith(filter.author + '/')) return false;
    if (filter.minContext && m.context_length < filter.minContext) return false;
    if (filter.maxPromptPrice) {
      const price = parseFloat(m.pricing.prompt);
      if (price > filter.maxPromptPrice) return false;
    }
    if (filter.nameContains && !m.id.toLowerCase().includes(filter.nameContains.toLowerCase())) {
      return false;
    }
    return true;
  });
}

/**
 * Get models sorted by price (cheapest first)
 */
export async function getCheapestModels(limit: number = 10): Promise<OpenRouterModel[]> {
  const models = await fetchModels();
  
  return models
    .sort((a, b) => parseFloat(a.pricing.prompt) - parseFloat(b.pricing.prompt))
    .slice(0, limit);
}

/**
 * Get models with largest context windows
 */
export async function getLargestContextModels(limit: number = 10): Promise<OpenRouterModel[]> {
  const models = await fetchModels();
  
  return models
    .sort((a, b) => b.context_length - a.context_length)
    .slice(0, limit);
}

/**
 * Compare models by criteria
 */
export function compareModels(models: OpenRouterModel[]): void {
  console.log('\n📊 Model Comparison\n');
  console.log('Model ID'.padEnd(50), 'Context', 'Prompt Price', 'Completion Price');
  console.log('-'.repeat(100));
  
  models.forEach((m) => {
    console.log(
      m.id.padEnd(50),
      m.context_length.toString().padEnd(8),
      `$${m.pricing.prompt}`.padEnd(13),
      `$${m.pricing.completion}`
    );
  });
}

/**
 * Example usage
 */
export async function demonstrateModelsAPI() {
  console.log('🔍 Discovering OpenRouter Models...\n');

  // Get all Claude models
  console.log('1. Claude Models:');
  const claudeModels = await findModels({ author: 'anthropic' });
  console.log(`Found ${claudeModels.length} Claude models`);
  claudeModels.slice(0, 3).forEach((m) => console.log(`  - ${m.id}`));

  // Get models with 100k+ context
  console.log('\n2. Large Context Models (100k+):');
  const longContextModels = await findModels({ minContext: 100000 });
  console.log(`Found ${longContextModels.length} models`);
  longContextModels.slice(0, 3).forEach((m) => {
    console.log(`  - ${m.id} (${m.context_length} tokens)`);
  });

  // Get cheap models
  console.log('\n3. Cheapest Models:');
  const cheapModels = await getCheapestModels(5);
  cheapModels.forEach((m) => {
    console.log(`  - ${m.id} ($${m.pricing.prompt}/token)`);
  });

  // Get GPT models
  console.log('\n4. GPT Models:');
  const gptModels = await findModels({ author: 'openai' });
  console.log(`Found ${gptModels.length} GPT models`);
  gptModels.slice(0, 3).forEach((m) => console.log(`  - ${m.id}`));

  // Compare top 5 models
  console.log('\n5. Top 5 Models Comparison:');
  const topModels = await fetchModels();
  compareModels(topModels.slice(0, 5));

  return {
    claudeModels,
    longContextModels,
    cheapModels,
    gptModels,
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateModelsAPI().catch(console.error);
}
