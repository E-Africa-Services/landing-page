"use client"

import type React from "react"

import { useState } from "react"

export default function DiscoveryCallForm({
  service,
  onBack,
}: {
  service: string | null
  onBack: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    whatsapp: "",
    service: service || "",
    requirements: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.businessName.trim()) errors.businessName = "Business name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.service) errors.service = "Please select a service"
    if (!formData.requirements.trim()) errors.requirements = "Please describe your requirements"
    
    return errors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    setValidationErrors(errors)
    
    if (Object.keys(errors).length === 0) {
      console.log("[v0] Discovery call form submitted:", formData)
      setSubmitted(true)
      setTimeout(() => {
        onBack()
        setSubmitted(false)
      }, 3000)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Request Received!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest. Our team will contact you within 24 hours to schedule your discovery call.
        </p>
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Book Discovery Call</h2>
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                validationErrors.name 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-primary"
              }`}
              placeholder="John Doe"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                validationErrors.businessName 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-primary"
              }`}
              placeholder="Your Company"
            />
            {validationErrors.businessName && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.businessName}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                validationErrors.email 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-primary"
              }`}
              placeholder="john@company.com"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                validationErrors.phone 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-border focus:border-primary"
              }`}
              placeholder="+234 XXX XXX XXXX"
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WhatsApp Number</label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            placeholder="+234 XXX XXX XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Service Interested In *</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
              validationErrors.service 
                ? "border-red-500 focus:border-red-500" 
                : "border-border focus:border-primary"
            }`}
          >
            <option value="">Select a service</option>
            <option value="Customer Success Training">Customer Success Training</option>
            <option value="AI Automation">AI Automation</option>
            <option value="CRM Integrations">CRM Integrations</option>
            <option value="LMS Software Integration">LMS Software Integration</option>
            <option value="Talent Acquisition">Talent Acquisition</option>
            <option value="Workforce Development">Workforce Development</option>
            <option value="IoT Consultancy & Training">IoT Consultancy & Training</option>
          </select>
          {validationErrors.service && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.service}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">What do you need from us? *</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors resize-none ${
              validationErrors.requirements 
                ? "border-red-500 focus:border-red-500" 
                : "border-border focus:border-primary"
            }`}
            placeholder="Tell us about your specific needs and goals..."
          />
          {validationErrors.requirements && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.requirements}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Send Request
        </button>
      </form>
    </div>
  )
}
