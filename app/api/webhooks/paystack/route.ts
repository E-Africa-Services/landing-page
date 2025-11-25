// API Route for Paystack Webhooks
// POST /api/webhooks/paystack

import { updatePaymentStatus, updateTrainingEnrollment, getPaymentByReference } from "@/lib/database-helpers"
import { formatAmountFromPaystack, type SupportedCurrency } from "@/lib/paystack"
import { validatePaymentAmount, createAmountValidationError } from "@/lib/payment-validation"
import { type NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // Verify webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret || !signature) {
      console.error('Missing webhook secret or signature')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
    if (hash !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Paystack webhook received:', event.event, event.data?.reference)

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data)
        break
        
      case 'charge.failed':
        await handleChargeFailed(event.data)
        break
        
      case 'charge.pending':
        await handleChargePending(event.data)
        break
        
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference
    const payment = await getPaymentByReference(reference)
    
    // Calculate actual amount
    const actualAmount = formatAmountFromPaystack(data.amount, payment.currency as SupportedCurrency)

    // SECURITY: Validate payment amount matches expected training price
    const trainingProgram = data.metadata?.training_program || payment.training_program
    if (trainingProgram) {
      const isValidAmount = validatePaymentAmount(actualAmount, trainingProgram, payment.currency as SupportedCurrency)
      if (!isValidAmount) {
        console.error(`Webhook payment amount validation failed for ${trainingProgram} in ${payment.currency}`)
        
        // Mark payment as failed due to amount mismatch
        await updatePaymentStatus(reference, 'failed', {
          paystack_transaction_id: data.id,
          failure_reason: `Amount validation failed for ${trainingProgram}`,
          webhook_data: data,
        })
        
        await updateTrainingEnrollment(payment.enrollment_id, {
          payment_status: 'failed',
          enrollment_status: 'cancelled', // Use cancelled instead of pending for failed payments
        })
        
        return
      }
    }

    // Update payment status
    await updatePaymentStatus(reference, 'completed', {
      paystack_transaction_id: data.id,
      authorization_code: data.authorization?.authorization_code,
      gateway_response: data.gateway_response,
      paid_at: data.paid_at,
      fees: data.fees,
      actual_amount: actualAmount,
      webhook_data: data,
    })

    // Update enrollment status
    await updateTrainingEnrollment(payment.enrollment_id, {
      payment_status: 'completed',
      enrollment_status: 'active',
    })

    console.log('Payment completed via webhook:', reference)
    
    // TODO: Send confirmation email
    // TODO: Trigger training access provisioning

  } catch (error) {
    console.error('Error handling charge success:', error)
  }
}

async function handleChargeFailed(data: any) {
  try {
    const reference = data.reference

    // Update payment status
    await updatePaymentStatus(reference, 'failed', {
      gateway_response: data.gateway_response,
      failed_at: new Date().toISOString(),
      webhook_data: data,
    })

    console.log('Payment failed via webhook:', reference)
    
    // TODO: Send failure notification email

  } catch (error) {
    console.error('Error handling charge failed:', error)
  }
}

async function handleChargePending(data: any) {
  try {
    const reference = data.reference

    // Update payment metadata
    await updatePaymentStatus(reference, 'pending', {
      gateway_response: data.gateway_response,
      webhook_data: data,
    })

    console.log('Payment pending via webhook:', reference)

  } catch (error) {
    console.error('Error handling charge pending:', error)
  }
}