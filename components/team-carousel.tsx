"use client"
import Image from "next/image"

import { useState, useEffect } from "react"

const teamMembers = [
  {
    name: "Clinton Imemeh",
    role: "Founder & CEO",
    image: "/clinton.jpg",
  },
  {
    name: "Gideon Adesoji",
    role: "Operations Manager",
    image: "/gideon.jpeg",
  },
  {
    name: "Paul Joel Osagie",
    role: "Backend Cloud Engineer",
    image: "/paul.jpeg",
  },
  {
    name: "Godstime Erubami",
    role: "Fullstack Engineer",
    image: "/gt-new.jpg",
  },
  {
    name: "Abigail Patrick",
    role: "Digital Marketer",
    image: "/abigai.jpeg",
  },

]

export default function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const getVisibleMembers = () => {
    const visibleCount = 3
    const members = []
    for (let i = 0; i < visibleCount; i++) {
      members.push(teamMembers[(currentIndex + i) % teamMembers.length])
    }
    return members
  }

  const handlePrev = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length)
  }

  return (
    <section id="team" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground">
            Passionate professionals dedicated to transforming Africa's future
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 sm:max-w-6xl mx-auto">
            {getVisibleMembers().map((member, idx) => (
              <div
                key={idx}
                className="group animate-fade-in w-full"
                style={{
                  animation: `fadeIn 0.6s ease-in-out ${idx * 0.1}s`,
                }}
              >
                {/* Portrait Image - Small and Professional */}
                <div className="relative mb-4 overflow-hidden rounded-lg bg-muted h-64 w-full">
                  <Image
                    fill
                    src={member.image || "/placeholder.svg?height=256&width=256&query=professional portrait"}
                    alt={member.name}
                    className="w-full h-full object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <h4 className="font-semibold text-base">{member.name}</h4>
                      <p className="font-medium text-sm">{member.role}</p>
                    </div>
                  </div>
                </div>


                {/* Member Info */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110"
              aria-label="Previous team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {teamMembers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false)
                    setCurrentIndex(idx)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30 w-2"
                  }`}
                  aria-label={`Go to team member ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110"
              aria-label="Next team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {isAutoPlay ? "⏸ Auto-playing" : "▶ Paused"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out forwards;
        }
      `}</style>
    </section>
  )
}
