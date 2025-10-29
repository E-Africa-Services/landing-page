"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="shrink-0">
          <div className="flex items-center gap-2">
            {/*  logo */}
            <Image src="/logo-white.png" alt="E-Africa Logo" width={140} height={140} />            
          </div>
          </Link>
          

          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/#talent" className="text-foreground hover:text-primary transition-colors">
              Talent Pool
            </Link>
            <Link href="/#training" className="text-foreground hover:text-primary transition-colors">
              Training
            </Link>
            <Link href="#team" className="text-foreground hover:text-primary transition-colors">
              Team
            </Link>
            <Link href="/#talent" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-3 ml-4 hover:bg-muted rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/services" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Services
            </Link>
            <Link href="#talent" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Talent Pool
            </Link>
            <Link href="#training" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Training
            </Link>
            <Link href="#team" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
              Team
            </Link>
            <Link href="/#talent" className="block px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded mx-4 mt-2 text-center">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
