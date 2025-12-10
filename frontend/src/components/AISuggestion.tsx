import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Alert, AlertDescription } from './ui/Alert'
import { Brain, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

interface SuggestionData {
  priority: string
  confidence: number
  explanation: string
}

interface AISuggestionProps {
  suggestion: SuggestionData | null
  loading?: boolean
  onAccept?: () => void
  onReject?: () => void
  onDismiss?: () => void
}

const priorityColors = {
  high: 'destructive',
  medium: 'secondary', 
  low: 'outline'
} as const

const confidenceColors = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-600'
  if (confidence >= 0.6) return 'text-yellow-600'
  return 'text-red-600'
}

const confidenceLabel = (confidence: number) => {
  if (confidence >= 0.8) return 'High'
  if (confidence >= 0.6) return 'Medium'
  return 'Low'
}

export default function AISuggestion({
  suggestion,
  loading = false,
  onAccept,
  onReject,
  onDismiss
}: AISuggestionProps) {
  if (!suggestion && !loading) {
    return null
  }

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-center gap-3 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">AI is analyzing...</p>
            <p className="text-xs text-blue-700">Getting priority suggestion based on task details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!suggestion) return null

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg text-purple-900">AI Suggestion</CardTitle>
          <Badge variant="outline" className="text-xs">
            {confidenceLabel(suggestion.confidence)} confidence
          </Badge>
        </div>
        <CardDescription className="text-purple-700">
          Based on task analysis, here's the recommended priority
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Suggestion Details */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <Badge variant={priorityColors[suggestion.priority as keyof typeof priorityColors]}>
              {suggestion.priority.toUpperCase()}
            </Badge>
            <span className={`text-sm font-medium ${confidenceColors(suggestion.confidence)}`}>
              {Math.round(suggestion.confidence * 100)}% confidence
            </span>
          </div>
        </div>

        {/* Explanation */}
        <Alert className="bg-white/80 border-purple-200">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800 text-sm">
            {suggestion.explanation}
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        {onAccept && onReject && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onAccept}
              className="flex-1 gap-2"
              size="sm"
            >
              <CheckCircle className="h-4 w-4" />
              Apply Suggestion
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1 gap-2"
              size="sm"
            >
              <AlertTriangle className="h-4 w-4" />
              Keep Current
            </Button>
          </div>
        )}

        {/* Dismiss Button */}
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="w-full text-purple-600 hover:text-purple-700"
          >
            Dismiss
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
