import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-void text-white flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-4">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan/70">
          404
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold">
          Page not found
        </h1>
        <p className="max-w-md text-gray-400">
          The page you&rsquo;re looking for doesn&rsquo;t exist anymore.
        </p>
      </section>
      <Footer />
    </main>
  )
}


