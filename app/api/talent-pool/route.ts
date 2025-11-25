// API Route for Talent Pool Registration
// POST /api/talent-pool

import { createClient } from "@/lib/supabase-server"
import { sendTalentPoolEmails } from "@/lib/email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { fullName, email, country, fieldOfExperience, experienceLevel, skills, cvUrl, videoUrl } = body

    // Validate required fields
    if (!fullName || !email || !country || !fieldOfExperience || !experienceLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase.from("talent_pool_profiles").select("id").eq("email", email).single()

    if (existing) {
      return NextResponse.json({ error: "Email already registered in talent pool" }, { status: 409 })
    }

    // Insert into talent_pool_profiles table
    const { data, error } = await supabase
      .from("talent_pool_profiles")
      .insert([
        {
          full_name: fullName,
          email,
          country,
          field_of_experience: fieldOfExperience,
          experience_level: experienceLevel,
          skills: skills || [],
          cv_url: cvUrl,
          video_url: videoUrl,
          profile_status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to register in talent pool" }, { status: 500 })
    }

    // Send confirmation emails to candidate and company
    // Don't let email failures block the talent pool registration
    if (data && data[0]) {
      const profile = data[0]
      
      // Send emails asynchronously (don't wait for completion)
      sendTalentPoolEmails(profile)
        .then((result) => {
          console.log('📧 Talent pool email results:', {
            candidateEmailSent: result.candidateEmailSent,
            companyEmailSent: result.companyEmailSent,
            profileId: profile.id,
          })
        })
        .catch((err) => {
          console.error('❌ Error in talent pool email sending:', err)
        })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
