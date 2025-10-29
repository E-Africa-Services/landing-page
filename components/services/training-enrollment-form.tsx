"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

const trainingPrices: Record<string, number> = {
  "LinkedIn Optimization": 49,
  "CV Optimization": 29,
  "AI Automation Training": 79,
  "Sales & Rebranding": 59,
  "Voice Coaching & Tonality": 39,
  "CRM Training": 49,
  "AI Prompt Engineering": 69,
  "Email Marketing": 44,
  "Interview Preparation": 34,
  "Personal Goal Setting": 54,
  "Job Opportunities": 0,
  "Talent Staffing": 0,
}

export default function TrainingEnrollmentForm({
  training,
  onBack,
}: {
  training: string | null
  onBack: () => void
}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    fieldOfExperience: "",
    experienceLevel: "",
    skills: [] as string[],
    areaOfStudy: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Validation functions for each step
  const validateStep1 = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.country) errors.country = "Country is required"
    
    return errors
  }

  const validateStep2 = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.fieldOfExperience) errors.fieldOfExperience = "Field of experience is required"
    if (!formData.experienceLevel) errors.experienceLevel = "Experience level is required"
    if (formData.skills.length === 0) errors.skills = "Please select at least one skill"
    
    return errors
  }

  const handleNextStep = () => {
    let errors: Record<string, string> = {}
    
    if (step === 1) {
      errors = validateStep1()
    } else if (step === 2) {
      errors = validateStep2()
    }
    
    setValidationErrors(errors)
    
    if (Object.keys(errors).length === 0) {
      setStep(step + 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
    
    // Clear skills validation error when user selects a skill
    if (validationErrors.skills) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated.skills
        return updated
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Training enrollment form submitted:", formData)

    const price = trainingPrices[training || ""] || 0

    if (price > 0) {
      // Redirect to payment page
      const encodedData = encodeURIComponent(JSON.stringify(formData))
      router.push(`/payment?training=${encodeURIComponent(training || "")}&data=${encodedData}`)
    } else {
      // Free training - just show success
      setSubmitted(true)
      setTimeout(() => {
        onBack()
        setSubmitted(false)
      }, 3000)
    }
  }

  const price = trainingPrices[training || ""] || 0

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Enrollment Successful!</h3>
        <p className="text-muted-foreground mb-4">
          Welcome to {training}! Check your email for next steps and access details.
        </p>
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl border border-border animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Enroll in {training}</h2>
          <p className="text-muted-foreground mt-1">Step {step} of 3</p>
        </div>
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                    validationErrors.firstName 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="John"
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                    validationErrors.lastName 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="Doe"
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

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
                placeholder="john@example.com"
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.country 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-border focus:border-primary"
                }`}
              >
                <option value="">Select your country</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Uganda">Uganda</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Egypt">Egypt</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.country && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
              )}
            </div>
          </>
        )}

        {/* Step 2: Experience & Skills */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Field of Experience *</label>
              <select
                name="fieldOfExperience"
                value={formData.fieldOfExperience}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.fieldOfExperience 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-border focus:border-primary"
                }`}
              >
                <option value="">Select your field</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.fieldOfExperience && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.fieldOfExperience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience Level *</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors ${
                  validationErrors.experienceLevel 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-border focus:border-primary"
                }`}
              >
                <option value="">Select your level</option>
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (2-5 years)</option>
                <option value="Senior">Senior (5-10 years)</option>
                <option value="Expert">Expert (10+ years)</option>
              </select>
              {validationErrors.experienceLevel && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.experienceLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Key Skills *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Communication",
                  "Leadership",
                  "Problem Solving",
                  "Time Management",
                  "Teamwork",
                  "Creativity",
                  "Technical",
                  "Analytical",
                ].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.skills.includes(skill)
                        ? "bg-primary text-primary-foreground border-primary"
                        : `bg-background hover:border-primary ${
                            validationErrors.skills ? "border-red-500" : "border-border"
                          }`
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {validationErrors.skills && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.skills}</p>
              )}
            </div>
          </>
        )}

        {/* Step 3: Additional Info */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Area of Study / Specialization</label>
              <input
                type="text"
                name="areaOfStudy"
                value={formData.areaOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g., Computer Science, Business Administration"
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Training Summary</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Training:</span> {training}
                </p>
                <p>
                  <span className="font-medium text-foreground">Name:</span> {formData.firstName} {formData.lastName}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email:</span> {formData.email}
                </p>
                {price > 0 && (
                  <p>
                    <span className="font-medium text-foreground">Price:</span> ${price}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {price > 0 ? "Proceed to Payment" : "Complete Enrollment"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
