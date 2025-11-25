// API Route for Submitting Discovery Call Requests
// POST /api/discovery-calls

import { createClient } from "@/lib/supabase-server"
import { sendDiscoveryCallEmails } from "@/lib/email"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Validate required fields
    const { name, businessName, email, phone, service, requirements, whatsapp } = body

    if (!name || !businessName || !email || !phone || !service || !requirements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert into discovery_calls table
    const { data, error } = await supabase
      .from("discovery_calls")
      .insert([
        {
          name,
          business_name: businessName,
          email,
          phone,
          whatsapp,
          service,
          requirements,
          status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to submit discovery call request" }, { status: 500 })
    }

    // Send confirmation emails to client and company
    // Don't let email failures block the discovery call submission
    if (data && data[0]) {
      const discoveryCall = data[0]
      
      // Send emails asynchronously (don't wait for completion)
      sendDiscoveryCallEmails(discoveryCall)
        .then((result) => {
          console.log('📧 Discovery call email results:', {
            clientEmailSent: result.clientEmailSent,
            companyEmailSent: result.companyEmailSent,
            discoveryCallId: discoveryCall.id,
          })
        })
        .catch((err) => {
          console.error('❌ Error in discovery call email sending:', err)
        })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
