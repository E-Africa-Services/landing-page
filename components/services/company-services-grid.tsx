"use client"

import { useState } from "react"
import Image from "next/image"

const companyServices = [
  {
    title: "Customer Success Training",
    description: "Build exceptional customer-centric teams",
    fullDescription:
      "Comprehensive training to develop customer success skills, strategies, and best practices for your team.",
    image: "/services/customer-success-training.jpg",
  },
  {
    title: "AI Automation",
    description: "Streamline operations with intelligent automation",
    fullDescription: "Implement AI-powered automation solutions to increase efficiency and reduce operational costs.",
    image: "/services/ai-automation.jpg",
  },
  {
    title: "CRM Integrations",
    description: "Seamless integration across your teams",
    fullDescription: "Expert guidance on integrating CRM systems across your organization for better collaboration.",
    image: "/services/crm-integrations.jpg",
  },
  {
    title: "LMS Software Integration",
    description: "Optimize your learning management systems",
    fullDescription: "Implement and optimize learning management systems tailored to your organization's needs.",
    image: "/services/lms-integration.jpg",
  },
  {
    title: "Talent Acquisition",
    description: "Find and recruit top African talent",
    fullDescription: "Access our network of vetted African professionals across various industries and skill levels.",
    image: "/services/talent-acquisition.jpg",
  },
  {
    title: "Workforce Development",
    description: "Build skills for tomorrow's challenges",
    fullDescription: "Strategic workforce development programs to upskill your team and prepare for future growth.",
    image: "/services/workforce-development.jpg",
  },
  {
    title: "IoT Consultancy & Training",
    description: "Master Internet of Things technology",
    fullDescription: "Expert consultancy and hands-on training for implementing IoT solutions in your business.",
    image: "/services/iot-consultancy.jpg",
  },
]

export default function CompanyServicesGrid({
  onSelectService,
}: {
  onSelectService: (service: string) => void
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companyServices.map((service, idx) => (
        <div
          key={idx}
          className={`relative h-80 rounded-xl overflow-hidden group cursor-pointer bg-card border border-border transition-all duration-500 ${
            hoveredIndex === idx ? "shadow-2xl scale-105" : "shadow-lg"
          }`}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Image Container with slide-up animation */}
          <div
            className={`absolute inset-0 transition-transform duration-500 ease-out ${
              hoveredIndex === idx ? "translate-y-full" : "translate-y-0"
            }`}
          >
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover"
              priority={idx < 3}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>

          {/* Title and Description positioned at bottom on image */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${
              hoveredIndex === idx ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1">{service.title}</h3>
            <p className="text-white/90 text-sm drop-shadow-md">{service.description}</p>
          </div>

          {/* Hover State - Content slides up with detailed info */}
          <div
            className={`absolute inset-0 bg-linear-to-b from-primary/95 to-primary/90 backdrop-blur p-6 flex flex-col justify-between transition-all duration-500 ${
              hoveredIndex === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-primary-foreground mb-3">{service.title}</h3>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">{service.fullDescription}</p>
            </div>
            <button
              onClick={() => onSelectService(service.title)}
              className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Request Discovery Call
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
