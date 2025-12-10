import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Calendar, MessageCircle, CheckCircle, Circle, AlertCircle } from 'lucide-react'

type Task = {
  id: number
  title: string
  description?: string
  due_date?: string | null
  priority: string
  status: string
}

interface TaskCardProps {
  task: Task
  onSuggestPriority: (taskId: number) => void
  loading?: boolean
}

const priorityColors = {
  high: 'destructive',
  medium: 'secondary', 
  low: 'outline'
} as const

const statusIcons = {
  completed: CheckCircle,
  in_progress: AlertCircle,
  pending: Circle
} as const

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export default function TaskCard({ task, onSuggestPriority, loading = false }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <StatusIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <CardTitle className="text-lg leading-tight truncate">{task.title}</CardTitle>
          </div>
          <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <CardDescription className="line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {task.due_date && (
              <div className={`flex items-center gap-1 ${isOverdue(task.due_date) ? 'text-destructive' : ''}`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.due_date)}</span>
                {isOverdue(task.due_date) && <span className="text-xs">(overdue)</span>}
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSuggestPriority(task.id)}
            disabled={loading}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Suggest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
