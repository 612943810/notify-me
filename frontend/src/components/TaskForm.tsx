import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Plus, Loader2 } from 'lucide-react'

interface TaskFormProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onSubmit: (e?: React.FormEvent) => void
  loading?: boolean
  disabled?: boolean
}

export default function TaskForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  loading = false,
  disabled = false
}: TaskFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Task
        </CardTitle>
        <CardDescription>
          Add a new task to your list. Title is required, description is optional.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              disabled={loading || disabled}
              className="transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Add a detailed description (optional)..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={loading || disabled}
              className="min-h-[100px] transition-all resize-none"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading || disabled || !title.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
