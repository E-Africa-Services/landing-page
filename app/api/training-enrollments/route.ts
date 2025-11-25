// API Route for Training Enrollment Submissions
// POST /api/training-enrollments

import { createClient } from "@/lib/supabase-server"
import { getTrainingPrice } from "@/lib/training-prices"
import { generatePaymentReference, type SupportedCurrency } from "@/lib/paystack"
import { sendEnrollmentEmails } from "@/lib/email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📥 Received enrollment request:", body)
    
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
      currency = 'USD' as SupportedCurrency,
    } = body

    console.log("✅ Extracted fields:", { firstName, lastName, email, trainingProgram, currency })

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !trainingProgram) {
      console.error("❌ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const price = getTrainingPrice(trainingProgram, currency)
    const paymentReference = price > 0 ? generatePaymentReference() : null
    
    console.log("💰 Price calculated:", { price, currency, paymentReference })

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
          currency,
          payment_reference: paymentReference,
          enrollment_status: "active",
          payment_status: price > 0 ? "pending" : "completed",
        },
      ])
      .select()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }
    
    console.log("✅ Enrollment created in database:", data[0]?.id)

    // Send confirmation emails to candidate and company
    // Don't let email failures block the enrollment
    if (data && data[0]) {
      const enrollment = data[0]
      
      // Prepare enrollment data with full_name for email templates
      const enrollmentData = {
        id: enrollment.id,
        full_name: `${enrollment.first_name} ${enrollment.last_name}`,
        email: enrollment.email,
        phone: enrollment.phone,
        country: enrollment.country,
        training_program: enrollment.training_program,
        training_type: 'Online Training', // You can customize this based on your data
        training_duration: undefined, // Add if you have duration data
        enrollment_status: enrollment.enrollment_status,
        payment_reference: enrollment.payment_reference,
        currency: enrollment.currency,
        created_at: enrollment.created_at,
      }

      // Send emails asynchronously (don't wait for completion)
      sendEnrollmentEmails(enrollmentData)
        .then((result) => {
          console.log('📧 Email sending results:', {
            candidateEmailSent: result.candidateEmailSent,
            companyEmailSent: result.companyEmailSent,
            enrollmentId: enrollment.id,
          })
        })
        .catch((err) => {
          console.error('❌ Error in email sending process:', err)
        })
    }

    // TODO: If free training, send access details

    console.log("✅ Sending response:", { enrollmentId: data[0].id, requiresPayment: price > 0 })
    
    return NextResponse.json({ 
      success: true, 
      data: {
        enrollmentId: data[0].id,
        paymentReference,
        requiresPayment: price > 0,
        currency,
        amount: price,
        enrollment: data[0]
      }
    }, { status: 201 })
  } catch (error) {
    console.error("❌ API error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
