"use client"

import Link from "next/link"

export default function Hero({ onSelectUserType }: { onSelectUserType: (type: "companies" | "individuals") => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Redefining Learning. Empowering Africa.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
          Transform your career or team with world-class training, consulting, and talent placement services designed
          for Africa's future.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/services?type=companies"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg text-lg inline-block text-center"
            onClick={() => onSelectUserType("companies")}
          >
            For Companies
          </Link>
          <Link
            href="/services?type=individuals"
            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all hover:shadow-lg text-lg inline-block text-center"
            onClick={() => onSelectUserType("individuals")}
          >
            For Individuals
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Professionals Trained</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <p className="text-muted-foreground">Companies Partnered</p>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <p className="text-muted-foreground">Countries Reached</p>
          </div>
        </div>
      </div>
    </section>
  )
}
