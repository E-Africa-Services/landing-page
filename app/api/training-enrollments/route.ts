// API Route for Training Enrollment Submissions
// POST /api/training-enrollments

import { createClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

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
  "Talent Staffing": 0,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      fieldOfExperience,
      experienceLevel,
      skills,
      areaOfStudy,
      trainingProgram,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !trainingProgram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const price = trainingPrices[trainingProgram] || 0

    // Insert into training_enrollments table
    const { data, error } = await supabase
      .from("training_enrollments")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          country,
          field_of_experience: fieldOfExperience,
          experience_level: experienceLevel,
          skills: skills || [],
          area_of_study: areaOfStudy,
          training_program: trainingProgram,
          price,
          enrollment_status: "active",
          payment_status: price > 0 ? "pending" : "completed",
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
    }

    // TODO: Send confirmation email 

    // TODO: If free training, send access details

    return NextResponse.json({ success: true, data, requiresPayment: price > 0 }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
