import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {

  const { prompt } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are a travel expert for Vung Tau Vietnam.
Create a detailed travel itinerary.
Return structured text.
`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return Response.json({
    result: completion.choices[0].message.content
  })
}