"use client"

import { useEffect, useState } from "react"
import Image from "next/image"


export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("about-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      title: "Expert Training",
      description: "World-class training programs designed by industry experts for real-world impact",
      icon: "/book-preview.png",
    },
    {
      title: "Strategic Consulting",
      description: "Tailored consulting services to optimize your team's performance and growth",
      icon: "/strategy-1.png",
    },
    {
      title: "Talent Placement",
      description: "Connect with top African talent across multiple industries and skill levels",
      icon: "/light_brain-preview.png",
    },
    {
      title: "Career Development",
      description: "Personalized mentorship and coaching to accelerate your professional journey",
      icon: "/career-preview.png",
    },
  ]

  return (
    <section id="about-section" className="py-20 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">About E-Africa Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            We are a technology-backed company dedicated to transforming careers and empowering organizations across
            Africa through innovative training, strategic consulting, and talent placement solutions.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left side - Text */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">What We Do</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                E-Africa Services bridges the gap between talent and opportunity across Africa. We specialize in
                providing comprehensive training programs, expert consulting services, and strategic talent placement
                that drives real business results.
              </p>
              <p>
                Our mission is to unlock the potential of African professionals and organizations by delivering
                cutting-edge solutions in customer success, AI automation, CRM integration, workforce development, and
                much more.
              </p>
              <p>
                Whether you're a company looking to upskill your team or an individual seeking career advancement, we
                provide the tools, knowledge, and connections you need to succeed in today's competitive landscape.
              </p>
            </div>
          </div>

          {/* Right side - Features */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-background rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={68}
                    height={68}
                    className="inline-block"
                  />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Overview */}
        <div
          className={`bg-background rounded-lg border border-border p-8 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Our Comprehensive Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Companies */}
            <div>
              <h4 className="text-lg font-semibold text-primary mb-4">For Companies</h4>
              <ul className="space-y-3">
                {[
                  "Customer Success Training",
                  "AI Automation Implementation",
                  "CRM Integration & Optimization",
                  "LMS Software Integration",
                  "Talent Acquisition Services",
                  "Workforce Development Programs",
                  "IoT Consultancy & Training",
                ].map((service, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Individuals */}
            <div>
              <h4 className="text-lg font-semibold text-secondary mb-4">For Individuals</h4>
              <ul className="space-y-3">
                {[
                  "LinkedIn Optimization Training",
                  "CV Optimization & Branding",
                  "AI Automation Training",
                  "Sales & Personal Rebranding",
                  "Personal Goal Setting & Mentorship",
                  "Voice Coaching & Tonality Testing",
                  "CRM & AI Prompt Engineering Training",
                  "Email Marketing & Interview Prep",
                  "Job Opportunities & Talent Staffing",
                ].map((service, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center p-6 rounded-lg bg-background border border-border hover:border-accent hover:shadow-lg transition-all duration-300">
            <div className="text-4xl font-bold text-accent mb-2">Africa-First</div>
            <p className="text-muted-foreground">Designed specifically for African professionals and organizations</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-background border border-border hover:border-accent hover:shadow-lg transition-all duration-300">
            <div className="text-4xl font-bold text-accent mb-2">Tech-Powered</div>
            <p className="text-muted-foreground">Using advanced algorithms to match talent with opportunities</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-background border border-border hover:border-accent hover:shadow-lg transition-all duration-300">
            <div className="text-4xl font-bold text-accent mb-2">Multilingual</div>
            <p className="text-muted-foreground">Supporting English, French, Portuguese, Chinese, and more</p>
          </div>
        </div>
      </div>
    </section>
  )
}
