import { NoteEditor } from "@/components/dashboard/note-editor"

export default function NewNotePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <NoteEditor  />
    </div>
  )
}
