/**
 * Multi-Modal Embeddings with OpenRouter
 * Supports text + image inputs for semantic search and similarity
 */

export interface EmbeddingInput {
  text?: string;
  imageUrl?: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get multi-modal embedding (text + image)
 */
export async function getMultiModalEmbedding(
  input: EmbeddingInput,
  apiKey: string,
  options?: {
    model?: string;
    siteUrl?: string;
    siteTitle?: string;
  }
): Promise<EmbeddingResponse> {
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  if (input.text) {
    content.push({ type: 'text', text: input.text });
  }

  if (input.imageUrl) {
    content.push({
      type: 'image_url',
      image_url: { url: input.imageUrl },
    });
  }

  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': options?.siteUrl || 'https://your-site.com',
      'X-OpenRouter-Title': options?.siteTitle || 'Your App',
    },
    body: JSON.stringify({
      model: options?.model || 'nvidia/llama-nemotron-embed-vl-1b-v2:free',
      input: [{ content }],
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Embeddings API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();

  return {
    embedding: data.data[0].embedding,
    model: data.model,
    usage: data.usage,
  };
}

/**
 * Get text-only embedding
 */
export async function getTextEmbedding(
  text: string,
  apiKey: string,
  options?: {
    model?: string;
    siteUrl?: string;
    siteTitle?: string;
  }
): Promise<EmbeddingResponse> {
  return getMultiModalEmbedding({ text }, apiKey, options);
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find most similar items using embeddings
 */
export async function findSimilar<T>(
  query: EmbeddingInput,
  items: Array<{ data: T; embedding: number[] }>,
  apiKey: string,
  topK: number = 5
): Promise<Array<{ data: T; similarity: number }>> {
  const queryEmbedding = await getMultiModalEmbedding(query, apiKey);

  const similarities = items.map((item) => ({
    data: item.data,
    similarity: cosineSimilarity(queryEmbedding.embedding, item.embedding),
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Example: Semantic search with text and images
 */
export async function semanticSearch(apiKey: string) {
  // Example documents with embeddings
  const documents = [
    {
      id: 1,
      text: 'A beautiful sunset over the ocean',
      imageUrl: 'https://example.com/sunset.jpg',
    },
    {
      id: 2,
      text: 'A cat sleeping on a couch',
      imageUrl: 'https://example.com/cat.jpg',
    },
    {
      id: 3,
      text: 'Mountains covered in snow',
      imageUrl: 'https://example.com/mountains.jpg',
    },
  ];

  // Generate embeddings for all documents
  console.log('Generating embeddings for documents...');
  const embeddedDocs = await Promise.all(
    documents.map(async (doc) => {
      const { embedding } = await getMultiModalEmbedding(
        { text: doc.text, imageUrl: doc.imageUrl },
        apiKey
      );
      return { data: doc, embedding };
    })
  );

  // Search with text query
  console.log('\\nSearching for: "ocean view"');
  const results = await findSimilar(
    { text: 'ocean view' },
    embeddedDocs,
    apiKey,
    3
  );

  console.log('\\nTop results:');
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.data.text} (similarity: ${result.similarity.toFixed(3)})`);
  });

  return results;
}

/**
 * Example: Image similarity search
 */
export async function imageSimilaritySearch(
  queryImageUrl: string,
  imageUrls: string[],
  apiKey: string
) {
  console.log('Generating embeddings for images...');

  // Generate embeddings for all images
  const embeddedImages = await Promise.all(
    imageUrls.map(async (url) => {
      const { embedding } = await getMultiModalEmbedding({ imageUrl: url }, apiKey);
      return { data: url, embedding };
    })
  );

  // Find similar images
  const results = await findSimilar(
    { imageUrl: queryImageUrl },
    embeddedImages,
    apiKey,
    5
  );

  console.log('\\nMost similar images:');
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.data} (similarity: ${result.similarity.toFixed(3)})`);
  });

  return results;
}
