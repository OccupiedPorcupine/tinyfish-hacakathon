import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Takes raw text from TinyFish and uses OpenAI to extract structured JSON.
 * @param rawContent - raw scraped text from TinyFish
 * @param instructions - what shape of JSON to produce
 */
export async function structureData<T>(rawContent: string, instructions: string): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a data extraction assistant. Given raw web content, extract and return structured JSON exactly matching the requested schema. Return ONLY valid JSON — no markdown, no explanation.',
      },
      {
        role: 'user',
        content: `Raw content:\n\n${rawContent}\n\n---\n\n${instructions}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('OpenAI returned empty response');
  return JSON.parse(content) as T;
}
