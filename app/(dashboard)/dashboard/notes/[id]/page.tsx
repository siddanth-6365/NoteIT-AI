import { NoteEditor } from "@/components/dashboard/note-editor"

interface NotePageProps {
  params: {
    id: string
  }
}

export default function NotePage({ params }: NotePageProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <NoteEditor id={params.id} />
    </div>
  )
}
