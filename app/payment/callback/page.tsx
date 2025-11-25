"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const reference = searchParams.get('reference')

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      setMessage('Invalid payment reference')
      return
    }

    verifyPayment(reference)
  }, [reference])

  const verifyPayment = async (paymentReference: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: paymentReference }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.payment_status === 'completed') {
          setStatus('success')
          setMessage('Payment successful! You will receive your training access details via email.')
        } else {
          setStatus('failed')
          setMessage('Payment verification failed. Please contact support.')
        }
      } else {
        setStatus('failed')
        setMessage(data.error || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setStatus('failed')
      setMessage('An error occurred while verifying your payment')
    }
  }

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in-up">
            
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Verifying Payment</h1>
                <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 mb-6">
                  <p className="text-sm text-green-700">
                    <strong>What's next?</strong> Check your email for training access details and course materials.
                  </p>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Payment Failed</h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 mb-6">
                  <p className="text-sm text-red-700">
                    <strong>Need help?</strong> Contact our support team at support@eafricaservices.com
                  </p>
                </div>
              </>
            )}

            {reference && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Payment Reference:</strong> {reference}
                </p>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={status === 'loading'}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'success' ? 'Continue to Dashboard' : 'Back to Home'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}