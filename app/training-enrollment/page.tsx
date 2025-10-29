"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import TrainingEnrollmentForm from "@/components/services/training-enrollment-form"

function TrainingEnrollmentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const training = searchParams.get("training")

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Training Enrollment</h1>
          <p className="text-lg text-muted-foreground">
            Join our expert-led training programs and transform your career
          </p>
        </div>
        
        <TrainingEnrollmentForm
          training={training}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}

export default function TrainingEnrollmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainingEnrollmentContent />
    </Suspense>
  )
}