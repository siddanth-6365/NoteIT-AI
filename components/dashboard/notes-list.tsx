'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useNotes, useDeleteNote } from '@/hooks/use-notes'
import Loader from '@/components/dashboard/loader'

interface NotesListProps {
  /** If provided, only show the first N notes */
  limit?: number
}

export function NotesList({ limit }: NotesListProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const { data: notes = [], isLoading } = useNotes()
  const { mutate: remove } = useDeleteNote()

  // Filter by search
  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase()) ||
      (n.tags ?? []).some((t: string) => t.toLowerCase().includes(search.toLowerCase())),
  )

  // Apply limit if given
  const displayed = typeof limit === 'number' ? filtered.slice(0, limit) : filtered

  const handleDelete = (id: string) =>
    remove(id, {
      onSuccess: () =>
        toast({ title: 'Note deleted', description: 'Your note was removed.' }),
      onError: (e) =>
        toast({ title: 'Error', description: String(e), variant: 'destructive' }),
    })

  if (isLoading)
    return (
      <Loader message="Loading your notes…" />
    )

  return (
    <div className="space-y-4">
      {/* only show search if unlimited */}
      {!limit && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div>
            <h3 className="text-lg font-semibold">No notes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {search ? 'Nothing matches your search.' : 'Create your first note!'}
            </p>
            {!search && (
              <Button onClick={() => router.push('/dashboard/notes/new')} className="mt-4">
                Create a note
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((note) => (
            <Card key={note.id}>
              <Link href={`/dashboard/notes/${note.id}`}>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{note.body}</CardDescription>
                </CardHeader>
              </Link>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(note.tags ?? []).map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between ">
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete note?</AlertDialogTitle>
                      <AlertDialogDescription>This action can’t be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(note.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
