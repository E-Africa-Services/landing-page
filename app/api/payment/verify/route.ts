// API Route for Paystack Payment Verification
// POST /api/payment/verify

import { updatePaymentStatus, updateTrainingEnrollment, getPaymentByReference } from "@/lib/database-helpers"
import { PAYSTACK_CONFIG, formatAmountFromPaystack, type SupportedCurrency } from "@/lib/paystack"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    // Validate Paystack configuration
    if (!PAYSTACK_CONFIG.secretKey) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`${PAYSTACK_CONFIG.apiUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      console.error('Paystack verification failed:', paystackData)
      return NextResponse.json({ 
        error: "Payment verification failed", 
        details: paystackData.message 
      }, { status: 400 })
    }

    const transaction = paystackData.data
    const paymentStatus = transaction.status === 'success' ? 'completed' : 'failed'

    // Get existing payment record
    const payment = await getPaymentByReference(reference)
    
    // Calculate actual amount (convert from kobo/cents)
    const actualAmount = formatAmountFromPaystack(transaction.amount, payment.currency as SupportedCurrency)

    // Update payment record
    const updatedPayment = await updatePaymentStatus(reference, paymentStatus, {
      paystack_transaction_id: transaction.id,
      authorization_code: transaction.authorization?.authorization_code,
      gateway_response: transaction.gateway_response,
      paid_at: transaction.paid_at,
      fees: transaction.fees,
      actual_amount: actualAmount,
      verification_data: transaction,
    })

    // If payment successful, update enrollment status
    if (paymentStatus === 'completed') {
      await updateTrainingEnrollment(payment.enrollment_id, {
        payment_status: 'completed',
        enrollment_status: 'active',
      })

      // TODO: Send confirmation email with training access details
      // TODO: Send training materials/course access
    }

    return NextResponse.json({
      success: true,
      payment_status: paymentStatus,
      transaction: {
        reference: transaction.reference,
        amount: actualAmount,
        currency: transaction.currency,
        status: transaction.status,
        paid_at: transaction.paid_at,
        customer: {
          email: transaction.customer.email,
        },
      },
    }, { status: 200 })

  } catch (error) {
    console.error("Payment verification error:", error)
    
    // If payment record exists, mark as failed
    try {
      const { reference } = await request.json()
      if (reference) {
        await updatePaymentStatus(reference, 'failed', {
          error: error instanceof Error ? error.message : 'Verification failed',
          failed_at: new Date().toISOString(),
        })
      }
    } catch (updateError) {
      console.error("Failed to update payment status:", updateError)
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET method for webhook verification (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
  }

  try {
    const payment = await getPaymentByReference(reference)
    
    return NextResponse.json({
      success: true,
      payment_status: payment.payment_status,
      reference: payment.paystack_reference,
    }, { status: 200 })

  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }
}