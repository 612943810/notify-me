import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import ChatBox from './components/ChatBox'

type Task = {
  id: number
  title: string
  description?: string
  due_date?: string | null
  priority: string
  status: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const resp = await axios.get(`${API_BASE}/tasks`)
      setTasks(resp.data)
    } catch (e) {
      setMessage('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function createTask(e?: Event) {
    e?.preventDefault()
    try {
      setLoading(true)
      const payload: any = { title }
      if (description) payload.description = description
      const resp = await axios.post(`${API_BASE}/tasks`, payload)
      setTitle('')
      setDescription('')
      setTasks((t) => [resp.data, ...t])
    } catch (err) {
      setMessage('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  async function suggestPriority(taskId: number) {
    try {
      setLoading(true)
      const resp = await axios.post(`${API_BASE}/tasks/${taskId}/suggest`)
      const data = resp.data
      setMessage(`Suggestion: ${data.priority} (confidence: ${data.confidence}) — ${data.explanation}`)
    } catch (err) {
      setMessage('Failed to get suggestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Notify Me — Tasks</h1>
      </header>

      <main>
        <section className="create">
          <h2>Create Task</h2>
          <form onSubmit={(e) => createTask(e)}>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <button type="submit" disabled={loading || !title}>
                {loading ? '...' : 'Create'}
              </button>
            </div>
          </form>
        </section>

        <section className="list">
          <h2>Tasks</h2>
          {loading && tasks.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {tasks.map((t) => (
                <li key={t.id} className="task">
                  <div className="task-main">
                    <strong>{t.title}</strong>
                    <div className="meta">
                      <span>priority: {t.priority}</span>
                      <span>status: {t.status}</span>
                      {t.due_date && <span>due: {new Date(t.due_date).toLocaleString()}</span>}
                    </div>
                    {t.description && <p className="desc">{t.description}</p>}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => suggestPriority(t.id)}>Suggest</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {message && (
          <div className="message">
            <p>{message}</p>
            <button onClick={() => setMessage(null)}>Dismiss</button>
          </div>
        )}
        <section className="chat">
          <h2>Agent Chat</h2>
          <ChatBox apiBase={API_BASE} onMessage={(m) => setMessage(m)} />
        </section>
      </main>
    </div>
  )
}

export default App
