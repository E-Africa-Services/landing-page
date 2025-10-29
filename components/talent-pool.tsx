"use client"

import { useState } from "react"

export default function TalentPool() {
  const [step, setStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    fieldOfExperience: "",
    experienceLevel: "",
    skills: [] as string[],
    cv: null as File | null,
    videoUrl: "",
  })

  const countries = [
    "Nigeria",
    "Kenya",
    "Ghana",
    "South Africa",
    "Uganda",
    "Rwanda",
    "Ethiopia",
    "Tanzania",
    "Cameroon",
    "Other",
  ]
  const fields = ["Technology", "Sales", "Customer Service", "Marketing", "Finance", "HR", "Operations", "Other"]
  const levels = ["Entry Level", "Mid Level", "Senior", "Executive"]
  const skillOptions = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Technical Skills",
    "Project Management",
    "Data Analysis",
    "Sales",
    "Customer Service",
  ]

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

  // Validation functions for each step
  const validateStep1 = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) errors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!formData.country) errors.country = "Country is required"
    
    return errors
  }

  const validateStep2 = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.fieldOfExperience) errors.fieldOfExperience = "Field of experience is required"
    if (!formData.experienceLevel) errors.experienceLevel = "Experience level is required"
    if (!formData.cv) errors.cv = "CV upload is required"
    
    return errors
  }

  const validateStep3 = () => {
    const errors: Record<string, string> = {}
    
    if (formData.skills.length === 0) errors.skills = "Please select at least one skill"
    
    return errors
  }

  const handleNext = () => {
    let errors: Record<string, string> = {}
    
    if (step === 1) {
      errors = validateStep1()
    } else if (step === 2) {
      errors = validateStep2()
    } else if (step === 3) {
      errors = validateStep3()
    }
    
    setValidationErrors(errors)
    
    if (Object.keys(errors).length === 0 && step < 4) {
      setStep(step + 1)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handleFileChange = (file: File | null) => {
    setFormData({ ...formData, cv: file })
    
    // Clear CV validation error when user uploads a file
    if (validationErrors.cv && file) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated.cv
        return updated
      })
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    alert("Thank you for joining our talent pool! We'll review your profile and get back to you soon.")
    setStep(1)
    setFormData({
      fullName: "",
      email: "",
      country: "",
      fieldOfExperience: "",
      experienceLevel: "",
      skills: [],
      cv: null,
      videoUrl: "",
    })
  }

  return (
    <section id="talent" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Join Our Talent Pool</h2>
          <p className="text-lg text-muted-foreground">
            Showcase your skills and connect with opportunities across Africa and beyond
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {num}
                </div>
                <span className="text-sm text-muted-foreground">
                  {num === 1 ? "Personal" : num === 2 ? "Profile" : num === 3 ? "Skills" : "Video"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.fullName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                  placeholder="Your full name"
                />
                {validationErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                  placeholder="your@email.com"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.country
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {validationErrors.country && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">Professional Profile</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Field of Experience *</label>
                <select
                  value={formData.fieldOfExperience}
                  onChange={(e) => handleInputChange('fieldOfExperience', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.fieldOfExperience
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                >
                  <option value="">Select your field</option>
                  {fields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                {validationErrors.fieldOfExperience && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.fieldOfExperience}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Experience Level *</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.experienceLevel
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                >
                  <option value="">Select your level</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {validationErrors.experienceLevel && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.experienceLevel}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload CV *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                    validationErrors.cv
                      ? "border-red-500 focus:ring-red-200"
                      : "border-border focus:ring-primary/20"
                  }`}
                />
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                {validationErrors.cv && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.cv}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">Select Your Skills *</h3>
              <p className="text-muted-foreground mb-4">Choose all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 rounded-lg border-2 transition-all text-left font-medium ${
                      formData.skills.includes(skill)
                        ? "border-primary bg-primary/10 text-primary"
                        : `bg-background text-foreground hover:border-primary/50 ${
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
          )}

          {/* Step 4: Video */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">Video Introduction (Optional)</h3>
              <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-border">
                <p className="text-foreground font-medium mb-2">Record or Upload Your Video</p>
                <p className="text-muted-foreground text-sm mb-4">
                  Tell us about yourself, your experience, and why you're interested in joining our talent pool. Speak
                  clearly and professionally. Max 2 minutes, under 50MB.
                </p>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="Paste video URL or upload file"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
