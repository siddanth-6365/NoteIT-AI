"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Brain, Loader2, Save, Volume2, VolumeX, Pause } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AISummary } from "@/components/dashboard/ai-summary"
import Loader from "@/components/dashboard/loader"
import { useSaveNote, useNote } from "@/hooks/use-notes"
import { generateSummary, enhanceNote } from "@/lib/api/ai"
import { speakText, stopSpeaking } from "@/lib/speechUtils"

// --- Schema ---
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  tags: z.string().optional(),
})

// --- Enhance Modal ---
interface EnhanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  onApply: (newContent: string) => void
}
function EnhanceDialog({
  open,
  onOpenChange,
  content,
  onApply,
}: EnhanceDialogProps) {
  const [instructions, setInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEnhance = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const rewritten = await enhanceNote(content, instructions)
      setResult(rewritten)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to enhance note.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={() => onOpenChange(true)}>
          <Brain className="mr-1 h-4 w-4" /> Enhance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Enhance Note</DialogTitle>
          <DialogDescription>
            Optionally add instructions (tone, style, focus).
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <>
            <Textarea
              className="w-full mb-4"
              placeholder="e.g. Make it more concise and engaging"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
            <DialogFooter className="justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleEnhance} disabled={isLoading || !content}>
                {isLoading
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  : <Brain className="mr-2 h-4 w-4" />}
                Enhance
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="prose whitespace-pre-wrap max-w-none mb-4">
              {result}
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  onApply(result)
                  onOpenChange(false)
                  setResult(null)
                  setInstructions("")
                }}
              >
                Apply
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Discard
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

//Main Editor 
interface NoteEditorProps { id?: string }
export function NoteEditor({ id }: NoteEditorProps) {
  const router = useRouter()
  const { toast } = useToast()

  // fetch / save
  const { data: existingNote, isLoading: isFetching } = useNote(id || "")
  const { mutateAsync: saveNote, isPending: isSaving } = useSaveNote()

  // form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "", tags: "" },
  })

  // populate if editing
  useEffect(() => {
    if (existingNote) {
      form.reset({
        title: existingNote.title,
        content: existingNote.body,
        tags: (existingNote.tags ?? []).join(", "),
      })
    }
  }, [existingNote, form])

  // tabs
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "summary">(
    id ? "preview" : "editor"
  )

  // AI summary
  const [summary, setSummary] = useState<string | null>(null)
  const [isGenSum, setIsGenSum] = useState(false)

  // Enhance modal
  const [showEnhance, setShowEnhance] = useState(false)

  // save/update
  async function onSubmit(vals: z.infer<typeof formSchema>) {
    const tagsArr = vals.tags
      ?.split(",")
      .map((t) => t.trim()).filter(Boolean) ?? []

    try {
      await saveNote({ id, title: vals.title, body: vals.content, tags: tagsArr })
      toast({ title: "Success!", description: id ? "Updated" : "Saved" })
      router.push("/dashboard")
    } catch {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  // generate summary
  const handleGenerateSummary = async () => {
    const c = form.getValues("content")
    if (!c || c.length < 50) {
      toast({ title: "Not enough content", variant: "destructive" })
      return
    }
    setIsGenSum(true)
    setSummary(null)
    try {
      const s = await generateSummary(c)
      setSummary(s)
      setActiveTab("summary")
      toast({ title: "Summary generated" })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsGenSum(false)
    }
  }

  if (id && isFetching) return <Loader message="Loading note…" />

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex items-left justify-between">
        <h1 className="text-2xl font-semibold">
          {id ? "Edit Note" : "New Note"}
        </h1>
        <div className="flex gap-2">
          {activeTab === "preview" && (
            <Button
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={isGenSum || form.getValues("content").length < 50}
            >
              {isGenSum
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Brain className="mr-2 h-4 w-4" />}
              Summarize
            </Button>
          )}
          {activeTab === "editor" && (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Save className="mr-2 h-4 w-4" />}
              {id ? "Update Note" : "Save Note"}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {summary && <TabsTrigger value="summary">Summary</TabsTrigger>}
        </TabsList>

        {/* EDITOR */}
        <TabsContent value="editor" className="space-y-4">
          <Form {...form}>
            <form className="space-y-6">
              <FormField control={form.control} name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Note title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Content</FormLabel>
                      <div className="flex gap-1">
                        {/* Enhance */}
                        <EnhanceDialog
                          open={showEnhance}
                          onOpenChange={setShowEnhance}
                          content={field.value}
                          onApply={(txt) => form.setValue("content", txt)}
                        />
                      </div>
                    </div>
                    <FormControl>
                      <Textarea {...field} className="min-h-[200px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="work, personal" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        {/* PREVIEW */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{form.getValues("title") || "Untitled"}</CardTitle>
                <CardDescription>
                  {(form.getValues("tags") ?? "")
                    .split(",").map(t => t.trim()).filter(Boolean)
                    .map(tag => (
                      <span
                        key={tag}
                        className="mr-2 inline-block rounded-full dark:text-white text-gray-900 bg-purple-100 px-2 py-0.5 text-xs dark:bg-purple-800"
                      >
                        {tag}
                      </span>
                    ))}
                </CardDescription>
              </div>
              {/* TTS controls */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speakText(form.getValues("content"), "en-US")}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => stopSpeaking()}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert whitespace-pre-wrap">
                {form.getValues("content")}
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* AI SUMMARY */}
        {summary && (
          <TabsContent value="summary" className="py-4">
            <AISummary summary={summary} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
