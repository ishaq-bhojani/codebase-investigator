import OpenAI from 'openai'

import dotenv from 'dotenv'
dotenv.config()

import { retrieveRelevantChunks } from './retrieveRelevantChunks.js'
import { runAudit } from './runAudit.js'
import { getState, updateState } from './stateStore.js'
console.log(process.env.GROQ_API_KEY)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

export async function investigateQuestion({
  repoId,
  question,
  conversationId
}) {
  const state = getState(conversationId)

  const chunks = await retrieveRelevantChunks({
    repoId,
    question,
    state
  })

  const prompt = `
You are a senior code investigator.

Only make claims grounded in evidence.

Return ONLY valid JSON.
- No markdown
- No fences
- All keys must be double quoted
- No comments
- No trailing commas

Return JSON:
{
  answer,
  claims,
  citations
}
`

  const response = await client.responses.create({
    model: 'llama-3.3-70b-versatile',
    input: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: JSON.stringify({
          question,
          state,
          chunks
        })
      }
    ]
  })

  function safeParseLLM(text) {
    if (!text) throw new Error("Empty LLM output");

    // remove fences aggressively
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    // extract JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found");
    }

    const jsonString = text.slice(start, end + 1);

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("FAILED JSON:\n", jsonString);
      throw e;
    }
  }

  const cleaned = safeParseLLM(response.output_text)
  console.log(cleaned);

  const parsed = cleaned

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid parsed LLM output");
  }

  const audit = await runAudit({
    question,
    investigatorOutput: cleaned,
    chunks
  })

  updateState(conversationId, {
    ...state,
    establishedFacts: [
      ...state.establishedFacts,
      ...(parsed.claims || [])
    ]
  })

  return {
    ...parsed,
    audit
  }
}
