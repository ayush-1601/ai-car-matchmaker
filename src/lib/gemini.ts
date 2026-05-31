import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!API_KEY) {
  throw new Error("Missing environment variable GOOGLE_GENERATIVE_AI_API_KEY");
}

const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

type GenerateOptions = {
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
  timeoutMs?: number;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function attemptGenerateRaw(prompt: string, opts?: GenerateOptions): Promise<string> {
  const anyModel = model as any;

  if (typeof anyModel.generateContent === "function") {
    const result = await anyModel.generateContent({ input: prompt, temperature: opts?.temperature });
    if (result?.response?.text) return await result.response.text();
    return String(result?.output ?? JSON.stringify(result));
  }

  if (typeof anyModel.generate === "function") {
    const res = await anyModel.generate({ input: prompt, temperature: opts?.temperature });
    if (typeof res.outputText === "string") return res.outputText;
    if (res?.candidates?.[0]?.output) return res.candidates[0].output;
    return JSON.stringify(res);
  }

  if (typeof anyModel.chat === "function") {
    const res = await anyModel.chat([{ role: "user", content: prompt }]);
    if (typeof res.outputText === "string") return res.outputText;
    return JSON.stringify(res);
  }

  throw new Error("Incompatible Gemini SDK: no supported generation method found on model");
}

export async function generateText(prompt: string, opts?: GenerateOptions): Promise<string> {
  const maxRetries = opts?.maxRetries ?? 3;
  const baseDelay = 300;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const txt = await attemptGenerateRaw(prompt, opts);
      if (typeof txt !== "string") throw new Error("Model returned non-string output");
      return txt;
    } catch (err: any) {
      const isLast = attempt === maxRetries;
      const status = err?.status || err?.code || err?.statusCode;
      const isRetryable = !status || (typeof status === "number" && status >= 500) || String(err).toLowerCase().includes("timeout") || String(err).toLowerCase().includes("network");

      if (isLast || !isRetryable) {
        const wrapped = new Error(`Gemini generation failed after ${attempt + 1} attempt(s): ${err?.message ?? err}`);
        (wrapped as any).cause = err;
        throw wrapped;
      }

      const backoff = Math.round(baseDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4));
      await sleep(backoff);
    }
  }

  throw new Error("Unreachable: generateText exhausted retries");
}

export async function generateJson<T>(
  prompt: string,
  validator?: (value: unknown) => value is T,
  opts?: GenerateOptions
): Promise<T> {
  const txt = await generateText(prompt, opts);

  try {
    const match = txt.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : txt;
    const parsed = JSON.parse(jsonStr) as unknown;

    if (validator) {
      if (validator(parsed)) return parsed;
      throw new Error("Parsed JSON did not match expected shape");
    }

    return parsed as T;
  } catch (err: any) {
    const e = new Error(`Failed to parse JSON from Gemini output: ${err?.message ?? err}`);
    (e as any).raw = txt;
    throw e;
  }
}

export default {
  model,
  generateText,
  generateJson,
};
