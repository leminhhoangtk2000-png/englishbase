import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <h1 className="text-6xl font-extrabold font-headline text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Page Not Found</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
