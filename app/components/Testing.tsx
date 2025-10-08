'use client'

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function TestingBanner() {
  return (
    <div className="flex justify-center w-100">
      <span className="bg-yellow-400 text-black text-sm font-medium px-3 py-1 rounded-full shadow-md">
        🚧 Testing Mode
      </span>
    
     <button
        onClick={() => {
          const event = new CustomEvent('open-feedback-modal')
          window.dispatchEvent(event)
        }}
        className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
      >
        Give Feedback
      </button>
     
    </div>
  )
}

export function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const openHandler = () => {setOpen(true) 
        setMessage("")
    setEmail("")}
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
      setOpen(false)
      toast.success("Feedback submitted!")
    } else {
      setStatus("❌ Something went wrong.")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-2 text-black">💭 Feedback & Suggestions</h2>
        <button onClick={() => setOpen(false)} className="text-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your thoughts..."
            className="border p-2 rounded-md h-24 text-black"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            className="border p-2 rounded-md text-black"
          />
          <button className="bg-black text-white py-2 rounded-md" type="submit">
            Submit
          </button>
        </form>
        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
        
      </div>
    </div>
  )
}