import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Supercharge Your Notes with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                NoteGenius helps you capture ideas, organize thoughts, and get AI-powered summaries to boost your
                productivity.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 p-4 dark:from-purple-950/30 dark:to-indigo-950/30 md:p-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
                  <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-8 w-20 rounded bg-purple-200 dark:bg-purple-800" />
                    <div className="h-8 w-20 rounded bg-indigo-200 dark:bg-indigo-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
