"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Brain, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AISummary } from "@/components/dashboard/ai-summary"
import { useSaveNote, useNote } from "@/hooks/use-notes"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  tags: z.string().optional(),
})

interface NoteEditorProps {
  id?: string
}

export function NoteEditor({ id }: NoteEditorProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'summary'>(id ? 'preview' : 'editor')

  const router = useRouter()
  const { toast } = useToast()

  const { mutateAsync: saveNote, isPending: isSaving } = useSaveNote()

  const { data: existingNote, isLoading: isFetching } = useNote(id || '')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  })

  // When note loads, populate the form
  useEffect(() => {
    if (existingNote) {
      form.reset({
        title: existingNote.title,
        content: existingNote.body,
        tags: (existingNote.tags ?? []).join(", "),
      })
    }
  }, [existingNote, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const tagsArray = values.tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? []

    try {
      await saveNote({
        id,
        title: values.title,
        body: values.content,
        tags: tagsArray,
      })

      toast({
        title: "Success!",
        description: id ? "Your note has been updated." : "Your note has been created.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
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
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSummary("This is an AI-generated summary of the note…")

      toast({
        title: "Summary generated",
        description: "AI summary has been generated successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate summary.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  if (id && isFetching) {
    return <p className="py-4 text-muted-foreground text-sm">Loading note...</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{id ? "Edit Note" : "Create New Note"}</h1>
        <div className="flex items-center gap-2">

          {activeTab === 'preview' && (
            <Button
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || form.getValues("content").length < 50}
            >
              {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Generate Summary
            </Button>
          )}
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Note
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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
                    <FormControl><Input placeholder="Note title" {...field} /></FormControl>
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
                    <FormControl><Textarea className="min-h-[300px]" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="work, personal" {...field} /></FormControl>
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
                {(form.getValues("tags") ?? "")
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} className="mr-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {tag}
                    </span>
                  ))}
              </CardDescription>
            </CardHeader>
            <CardContent>

              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {form.getValues("content")}
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
