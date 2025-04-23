import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { NotesList } from '@/components/dashboard/notes-list'

export default function AllNotesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">All Notes</h1>
        <Link href="/dashboard/notes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      {/* unlimited */}
      <NotesList />
    </div>
  )
}
