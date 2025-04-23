export default function Loader({ message }: { message: string }) {
  return (
    <div className="py-10 flex flex-col items-center justify-center">
      <span className="animate-spin rounded-full border-4 border-t-transparent border-primary h-10 w-10 mb-4" />
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  )
}