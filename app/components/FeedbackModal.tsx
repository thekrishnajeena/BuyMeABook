'use client'

import { useEffect, useState } from "react"

export default function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener("open-feedback-modal", openHandler)
    return () => window.removeEventListener("open-feedback-modal", openHandler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending...")

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email }),
    })

    if (res.ok) {
      setStatus("✅ Feedback submitted!")
      setMessage("")
      setEmail("")
    } else {
      setStatus("❌ Something went wrong.")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-2">💭 Feedback & Suggestions</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your thoughts..."
            className="border p-2 rounded-md h-24"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="border p-2 rounded-md"
          />
          <button className="bg-black text-white py-2 rounded-md" type="submit">
            Submit
          </button>
        </form>
        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4">✕</button>
      </div>
    </div>
  )
}
