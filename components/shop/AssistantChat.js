import { useEffect, useRef, useState } from 'react'
import { answer, SUGGESTIONS } from '../../lib/assistant'
import { useCart } from '../cart/CartContext'
import { formatPrice, STORES } from '../../lib/products'

// QSV AI — floating shopping assistant panel.
// `seedQuery` (optional) is asked automatically the first time the panel opens,
// e.g. when a shopper enters a category verse and wants a guided tour.
export default function AssistantChat({ open, onClose, seedQuery }) {
  const { addItem } = useCart()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "I'm QSV AI. I know every product in every store in the Verse — ask me to find, compare, or recommend anything.",
      products: []
    }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)
  const seeded = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open && seedQuery && !seeded.current) {
      seeded.current = true
      send(seedQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seedQuery])

  if (!open) return null

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || thinking) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setThinking(true)
    try {
      // Small artificial delay so the exchange reads naturally in a demo
      await new Promise((r) => setTimeout(r, 450))
      const res = await answer(q)
      setMessages((m) => [...m, { role: 'assistant', text: res.reply, products: res.products || [] }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Something glitched on my end — ask me that again?', products: [] }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] flex flex-col bg-gradient-to-b from-[#0a0a24] to-[#120538] border border-violet-400/40 rounded-2xl shadow-2xl shadow-violet-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-violet-400/25 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
          <h2 className="text-white font-semibold text-sm">QSV AI</h2>
          <span className="text-[10px] uppercase tracking-wider text-violet-300/60 border border-violet-400/30 rounded px-1.5 py-0.5">Shopping Assistant</span>
        </div>
        <button onClick={onClose} aria-label="Close assistant" className="text-gray-400 hover:text-white text-xl leading-none">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-cyan-500/20 text-cyan-100 border border-cyan-400/30'
                  : 'bg-violet-500/15 text-gray-200 border border-violet-400/20'
              }`}
            >
              {m.text}
            </div>
            {m.products && m.products.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {m.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-black/40 border border-violet-400/15 rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{p.name}</p>
                      <p className="text-[11px]">
                        <span style={{ color: STORES[p.store].color }}>{p.store}</span>
                        <span className="text-yellow-300/80 ml-2">★ {p.rating}</span>
                      </p>
                    </div>
                    <span className="text-cyan-300 text-xs font-semibold">{formatPrice(p.price)}</span>
                    <button
                      onClick={() => addItem(p.id)}
                      className="px-2 py-1 text-[11px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded hover:bg-cyan-500/40 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="bg-violet-500/15 border border-violet-400/20 rounded-xl px-3 py-2 text-sm text-violet-300 w-16 text-center animate-pulse">
            •••
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-200 hover:bg-violet-500/30 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="p-3 border-t border-violet-400/25 bg-black/30 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any product…"
          className="flex-1 bg-black/50 border border-violet-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/70"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 transition-opacity"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
