import { useState, useEffect } from 'react'
import { Button } from './components/ui/Button'
import { LayoutGrid } from 'lucide-react'
import { ThemeToggle } from './components/ThemeToggle'

// Simple type for our tasks
type Task = {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
}

// Simple TaskForm component
function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  onSubmit,
  loading
}: {
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-lg">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <h3 className="text-lg font-medium">Add New Task</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 border rounded"
          disabled={loading}
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="w-full p-2 border rounded"
          rows={3}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  )
}

// Simple TaskList component
function TaskList({
  tasks,
  onDelete,
  onUpdateStatus,
  suggestingTaskId
}: {
  tasks: Task[]
  onDelete: (id: number) => void
  onUpdateStatus: (id: number, status: 'todo' | 'in-progress' | 'done') => void
  suggestingTaskId: number | null
}) {
  if (tasks.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No tasks yet. Add one above!</div>
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
              <div className="mt-2 text-xs text-muted-foreground">
                Status: <span className="font-medium">{task.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(task.id, 'done')}
                disabled={suggestingTaskId === task.id}
              >
                Complete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                disabled={suggestingTaskId === task.id}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ChatBox component with message history and improved styling
function ChatBox({ onMessage }: { onMessage: (message: string) => void }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message }
    setMessages(prev => [...prev, userMessage])
    
    // Show loading state
    setIsLoading(true)
    const loadingMessage = { role: 'assistant' as const, content: 'Thinking...' }
    setMessages(prev => [...prev, loadingMessage])
    
    try {
      // Call the onMessage callback with the user's message
      onMessage(message)
      
      // Simulate a response (in a real app, this would be an API call)
      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: 'I received your message: ' + message 
          }
          return newMessages
        })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }
        return newMessages
      })
      setIsLoading(false)
    }
    
    setMessage('')
  }

  return (
    <div className="border border-border/40 rounded-xl p-4 h-full bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Assistant</h3>
      </div>
      
      <div className="h-64 overflow-y-auto mb-4 rounded-lg p-3 bg-muted/10 border border-border/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Ask me anything about your tasks! I can help you manage them better.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary/90 text-primary-foreground' 
                      : 'bg-muted/50 text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-sm border border-border/40 rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:outline-none transition-all"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          )}
        </Button>
      </form>
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');
  const [suggestingTaskId, setSuggestingTaskId] = useState<number | null>(null);

  // Add some sample tasks for better visualization
  useEffect(() => {
    if (tasks.length === 0) {
      setTasks([
        {
          id: 1,
          title: 'Complete project proposal',
          description: 'Write and submit the project proposal by Friday',
          status: 'in-progress',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Review pull requests',
          description: 'Review and merge pending pull requests in the repository',
          status: 'todo',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Update documentation',
          description: 'Update API documentation with the latest changes',
          status: 'todo',
          priority: 'low'
        }
      ]);
    }
  }, []);

  // Handler functions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority: 'medium'
    }
    
    setTasks(prev => [...prev, newTask])
    setTitle('')
    setDescription('')
  }

  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const handleUpdateStatus = (id: number, status: 'todo' | 'in-progress' | 'done') => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status } : task
      )
    )
  }

  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message)
    // In a real app, this would send the message to a server
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-pattern">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TaskFlow</h1>
                <p className="text-sm text-muted-foreground">Organize, prioritize, and conquer your tasks</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg border border-border/30">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2 font-medium rounded-md transition-all duration-200 ${
                activeTab === 'tasks' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Tasks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 font-medium rounded-md transition-all duration-200 ${
                activeTab === 'chat' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Chat</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'tasks' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <TaskForm 
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                loading={suggestingTaskId !== null}
              />
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Your Tasks</h3>
                <TaskList 
                  tasks={tasks} 
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                  suggestingTaskId={suggestingTaskId}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <ChatBox onMessage={handleSendMessage} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ChatBox onMessage={handleSendMessage} />
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default App
