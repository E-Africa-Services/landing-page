"use client"

import { useEffect, useState } from "react"

export default function TrainingSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-11-29").getTime()
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="training" className="py-20 bg-linear-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Training Programs</h2>
          <p className="text-lg text-muted-foreground">Transform your skills with our expert-led training programs</p>
        </div>

        {/* Free Training Countdown */}
        <div className="mb-12 bg-card rounded-lg border border-border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-4">
                Limited Time Offer
              </span>
              <h3 className="text-3xl font-bold text-foreground mb-4">Free Training Webinar</h3>
              <p className="text-muted-foreground mb-6">
                Join our exclusive free training session on November 29th. Learn industry secrets and get certified.
              </p>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Register Now
              </button>
            </div>

            {/* Countdown Timer */}
            <div className="flex flex-row flex-wrap justify-center  gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{String(item.value).padStart(2, "0")}</div>
                  <div className="text-xs text-muted-foreground uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LinkedIn Challenge */}
        <div className="bg-card rounded-lg border border-border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-muted rounded-lg p-8 text-center">
                <div className="text-6xl font-bold text-primary mb-2">30</div>
                <p className="text-muted-foreground">Day Challenge</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-block px-4 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-semibold mb-4">
                Most Popular
              </span>
              <h3 className="text-3xl font-bold text-foreground mb-4">LinkedIn Optimization Masterclass</h3>
              <p className="text-muted-foreground mb-6">
                Build your LinkedIn portfolio from scratch with our comprehensive 30-day challenge. Get noticed by
                recruiters and land your dream job.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Complete profile optimization
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Content strategy & posting
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Networking best practices
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Personal branding mastery
                </li>
              </ul>
              <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold">
                Join 30-Day Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
