import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface AISummaryProps {
  summary: string
}

export function AISummary({ summary }: AISummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
      <CardHeader className="flex flex-row items-center gap-2">
        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <div>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>Generated using Groq API</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          <p>{summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
