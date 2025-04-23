import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { NotesList } from '@/components/dashboard/notes-list'

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Recent Notes</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/notes/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
          <Link href="/dashboard/notes/all">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
      </div>

      {/* show only the 6 most recently updated */}
      <NotesList limit={6} />
    </div>
  )
}
