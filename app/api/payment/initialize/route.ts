// API Route for Paystack Payment Initialization
// POST /api/payment/initialize

import { createClient } from "@/lib/supabase-server"
import { createPayment } from "@/lib/database-helpers"
import { PAYSTACK_CONFIG, formatAmountForPaystack, type SupportedCurrency } from "@/lib/paystack"
import { validatePaymentAmountWithDetails, createAmountValidationError } from "@/lib/payment-validation"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      enrollmentId,
      paymentReference,
      amount,
      currency,
      email,
      trainingProgram,
      customerName,
    } = body

    // Validate required fields
    if (!enrollmentId || !paymentReference || !amount || !currency || !email || !trainingProgram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // SECURITY: Validate amount matches expected training price
    const validation = validatePaymentAmountWithDetails(amount, trainingProgram, currency as SupportedCurrency)
    if (!validation.isValid) {
      console.error(`Payment amount mismatch: expected ${validation.expectedPrice}, received ${validation.actualAmount} for ${trainingProgram} in ${currency}`)
      return NextResponse.json({ 
        error: "Invalid payment amount",
        details: createAmountValidationError(validation.expectedPrice, validation.actualAmount, currency as SupportedCurrency, trainingProgram)
      }, { status: 400 })
    }

    // Validate Paystack configuration
    if (!PAYSTACK_CONFIG.secretKey) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    // Convert amount to Paystack format (kobo/cents)
    const paystackAmount = formatAmountForPaystack(amount, currency as SupportedCurrency)

    // Initialize payment with Paystack
    const paystackResponse = await fetch(`${PAYSTACK_CONFIG.apiUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: paymentReference,
        amount: paystackAmount,
        email: email,
        currency: currency,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          enrollment_id: enrollmentId,
          training_program: trainingProgram,
          customer_name: customerName,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData)
      return NextResponse.json({ 
        error: "Payment initialization failed", 
        details: paystackData.message 
      }, { status: 400 })
    }

    // Create payment record in database
    const paymentData = {
      enrollment_id: enrollmentId,
      training_program: trainingProgram,
      amount: amount,
      currency: currency,
      payment_status: "pending" as const,
      paystack_reference: paymentReference,
      paystack_access_code: paystackData.data.access_code,
      payment_method: "card",
      payment_gateway: "paystack",
      metadata: {
        customer_name: customerName,
        paystack_data: paystackData.data,
      },
      fees_paid: 0,
    }

    const payment = await createPayment(paymentData)

    return NextResponse.json({
      success: true,
      data: {
        access_code: paystackData.data.access_code,
        authorization_url: paystackData.data.authorization_url,
        reference: paymentReference,
        payment_id: payment.id,
      },
    }, { status: 200 })

  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}