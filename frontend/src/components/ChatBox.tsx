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
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            Start a conversation with the AI agent
          </div>
        ) : (
          history.map((h, i) => (
            <div key={i} className={`p-3 rounded-lg ${
              h.role === 'user'
                ? 'bg-primary text-primary-foreground ml-8'
                : 'bg-muted text-muted-foreground mr-8'
            }`}>
              <div className="font-medium mb-1">
                {h.role === 'user' ? 'You:' : 'Agent:'}
              </div>
              <div className="text-sm">
                {h.role === 'user' ? h.text : JSON.stringify(h.data, null, 2)}
              </div>
              {h.role === 'agent' && h.data && h.data.suggested_task && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => approveSuggestion(h.data.suggested_task)}
                    disabled={loading}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 disabled:opacity-50"
                  >
                    Approve Suggestion
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the agent (e.g. 'Add meeting tomorrow at 2pm')"
          className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={!input || loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
