"use client"

import { useState } from "react"

export default function AIPlanner(){

  const [prompt,setPrompt] = useState("")
  const [result,setResult] = useState("")
  const [loading,setLoading] = useState(false)

  const generate = async () => {

    setLoading(true)

    const res = await fetch("/api/ai-plan",{
      method:"POST",
      body: JSON.stringify({prompt})
    })

    const data = await res.json()

    setResult(data.result)
    setLoading(false)
  }

  return(

    <section className="max-w-3xl mx-auto py-20">

      <h2 className="text-3xl font-semibold mb-6">
        Plan your Vung Tau trip with AI
      </h2>

      <textarea
        className="w-full border p-4 rounded-lg"
        rows={4}
        placeholder="Example: 2 day trip in Vung Tau with seafood and cafes..."
        onChange={(e)=>setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
      >
        Generate itinerary
      </button>

      {loading && <p>AI is planning your trip...</p>}

      {result && (
        <div className="mt-8 whitespace-pre-line">
          {result}
        </div>
      )}

    </section>

  )
}