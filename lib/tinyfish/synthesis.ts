import {
  gapRadarSynthesisSystemPrompt,
  gapRadarSynthesisUserPayload,
} from "@/lib/tinyfish/prompts";
import type { GapRadarScanInput, SynthesisPayload, TinyFishAgentRawResult } from "@/lib/tinyfish/types";

export async function synthesizeGapRadar(
  input: GapRadarScanInput,
  agentResults: TinyFishAgentRawResult[],
): Promise<SynthesisPayload | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const userContent = gapRadarSynthesisUserPayload(input, agentResults);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: gapRadarSynthesisSystemPrompt() },
          { role: "user", content: userContent },
        ],
        temperature: 0.35,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    return JSON.parse(raw) as SynthesisPayload;
  } catch {
    return null;
  }
}
