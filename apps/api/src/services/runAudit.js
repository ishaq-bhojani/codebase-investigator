import OpenAI from 'openai'

import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.GROQ_API_KEY)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

export async function runAudit({
  question,
  investigatorOutput,
  chunks
}) {
  const prompt = `
You are an independent auditor.

Your job:
- verify claims
- detect hallucinations
- detect unsupported reasoning
- detect contradictions
- detect risky recommendations

Return JSON.
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
          investigatorOutput,
          chunks
        })
      }
    ]
  })

  function safeParseLLM(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Empty LLM output");
    }

    // remove fences
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    // extract JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found in model output");
    }

    const jsonString = text.slice(start, end + 1);

    return JSON.parse(jsonString);
  }

  return safeParseLLM(response.output_text);
}
