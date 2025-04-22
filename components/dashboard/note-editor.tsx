"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AISummary } from "@/components/dashboard/ai-summary"
import { Brain, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  tags: z.string().optional(),
})

interface NoteEditorProps {
  id?: string
  isNew?: boolean
}

// Mock note data
const mockNote = {
  id: "1",
  title: "Meeting Notes",
  content:
    "Discussed project timeline and deliverables with the team. We agreed on the following milestones:\n\n1. Design phase: 2 weeks\n2. Development phase: 4 weeks\n3. Testing phase: 2 weeks\n4. Deployment: 1 week\n\nKey decisions:\n- Use React for frontend\n- Use Node.js for backend\n- Use PostgreSQL for database\n- Use AWS for hosting",
  tags: "work,project,meeting",
}

export function NoteEditor({ id, isNew = false }: NoteEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isNew
      ? {
          title: "",
          content: "",
          tags: "",
        }
      : {
          title: mockNote.title,
          content: mockNote.content,
          tags: mockNote.tags,
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true)

    try {
      // This would be replaced with actual Supabase data operations
      console.log("Saving note:", values)

      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: isNew ? "Your note has been created." : "Your note has been updated.",
      })

      if (isNew) {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateSummary = async () => {
    const content = form.getValues("content")

    if (!content || content.length < 50) {
      toast({
        title: "Not enough content",
        description: "Please add more content to generate a summary.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSummary(true)
    setSummary(null)

    try {
      // This would be replaced with actual Groq API call
      console.log("Generating summary for:", content)

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock summary response
      const mockSummary =
        "This note contains meeting notes discussing a project timeline with specific phases: 2 weeks for design, 4 weeks for development, 2 weeks for testing, and 1 week for deployment. Key technology decisions include using React, Node.js, PostgreSQL, and AWS."

      setSummary(mockSummary)

      toast({
        title: "Summary generated",
        description: "AI summary has been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{isNew ? "Create New Note" : "Edit Note"}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || form.getValues("content").length < 50}
          >
            {isGeneratingSummary ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {summary && <TabsTrigger value="summary">AI Summary</TabsTrigger>}
        </TabsList>
        <TabsContent value="editor" className="space-y-4 py-4">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Note title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your note here..." className="min-h-[300px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="work, project, idea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="preview" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>{form.getValues("title") || "Untitled Note"}</CardTitle>
              <CardDescription>
                {form.getValues("tags")
                  ? form
                      .getValues("tags")
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="mr-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        >
                          {tag}
                        </span>
                      ))
                  : "No tags"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {form
                  .getValues("content")
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
            </CardFooter>
          </Card>
        </TabsContent>
        {summary && (
          <TabsContent value="summary" className="py-4">
            <AISummary summary={summary} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
