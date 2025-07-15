import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          Made by{" "}
          <Link
            href="https://gabrielongzm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            Gabriel Ong
          </Link>
          . Source code{" "}
          <Link
            href="https://github.com/gongahkia/uku"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline transition-colors"
          >
            here
          </Link>
          .
        </div>
      </div>
    </footer>
  )
}