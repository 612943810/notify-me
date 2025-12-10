import { useState } from 'react'
import axios from 'axios'

type Props = {
  apiBase: string
  onMessage?: (msg: string) => void
}

export default function ChatBox({ apiBase, onMessage }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  async function send() {
    if (!input) return
    setLoading(true)
    const userMsg = { role: 'user', text: input }
    setHistory((h) => [...h, userMsg])
    try {
      const resp = await axios.post(`${apiBase}/agent/chat`, { message: input })
      const data = resp.data
      setHistory((h) => [...h, { role: 'agent', data }])
      if (onMessage) onMessage(JSON.stringify(data))
    } catch (err) {
      setHistory((h) => [...h, { role: 'agent', data: { error: 'Request failed' } }])
    } finally {
      setInput('')
      setLoading(false)
    }
  }

  async function approveSuggestion(suggested: any) {
    setLoading(true)
    try {
      const resp = await axios.post(`${apiBase}/agent/chat`, { message: JSON.stringify(suggested), automated: true })
      const data = resp.data
      setHistory((h) => [...h, { role: 'agent', data }])
      if (onMessage) onMessage(JSON.stringify(data))
    } catch (err) {
      setHistory((h) => [...h, { role: 'agent', data: { error: 'Execute failed' } }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-history">
        {history.map((h, i) => (
          <div key={i} className={`chat-line ${h.role}`}>
            {h.role === 'user' ? <strong>You:</strong> : <strong>Agent:</strong>}
            <div className="chat-content">
              {h.role === 'user' ? h.text : JSON.stringify(h.data)}
              {h.role === 'agent' && h.data && h.data.suggested_task && (
                <div className="suggest-actions">
                  <button onClick={() => approveSuggestion(h.data.suggested_task)} disabled={loading}>
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message the agent (e.g. 'Add meeting tomorrow at 2pm')" />
        <button onClick={send} disabled={!input || loading}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
