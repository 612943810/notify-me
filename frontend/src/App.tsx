import { useState, useEffect } from 'react'
import { Button } from './components/ui/Button'
import { LayoutGrid } from 'lucide-react'
import { ThemeToggle } from './components/ThemeToggle'
import ChatBox from './components/ChatBox'

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
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={3}
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Task'}
        </Button>
      </form>
    </div>
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
    return <div className="text-muted-foreground text-center py-12">No tasks yet. Add one above!</div>
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{task.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'done'
                    ? 'bg-success/10 text-success'
                    : task.status === 'in-progress'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {task.status.replace('-', ' ')}
                </span>
                <span className="text-xs text-muted-foreground">
                  Priority: <span className="font-medium capitalize">{task.priority}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {task.status !== 'done' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(task.id, 'done')}
                  disabled={suggestingTaskId === task.id}
                  className="text-xs"
                >
                  Complete
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                disabled={suggestingTaskId === task.id}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
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



function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');
  const [suggestingTaskId] = useState<number | null>(null);

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg border border-border/30 w-fit">
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <TaskForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                loading={suggestingTaskId !== null}
              />

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>
                <TaskList
                  tasks={tasks}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                  suggestingTaskId={suggestingTaskId}
                />
              </div>
            </div>
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-medium mb-4">AI Assistant</h3>
                <div className="h-[500px] min-h-[400px]">
                  <ChatBox apiBase="http://localhost:8000" onMessage={handleSendMessage} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="h-[600px] min-h-[500px]">
              <ChatBox apiBase="http://localhost:8000" onMessage={handleSendMessage} />
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
