"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { getFormattedTrainingPrice, getTrainingPrice, isFreeTraining } from "@/lib/training-prices"
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/paystack"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const training = searchParams.get("training")
  const dataParam = searchParams.get("data")
  const enrollmentId = searchParams.get("enrollmentId")
  const paymentReference = searchParams.get("paymentReference")
  
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState<SupportedCurrency>('USD')
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam))
        setFormData(decoded)
        if (decoded.currency) {
          setCurrency(decoded.currency)
        }
      } catch (error) {
        console.error("Failed to parse form data:", error)
      }
    }
  }, [dataParam])

  const price = training ? getTrainingPrice(training, currency) : 0
  const formattedPrice = training ? getFormattedTrainingPrice(training, currency) : '$0'
  const currencyInfo = SUPPORTED_CURRENCIES[currency]

  if (!training || !enrollmentId || !paymentReference) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-20">
          <div className="max-w-2xl mx-auto px-4 w-full text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Payment Link</h1>
            <p className="text-muted-foreground mb-6">This payment link is invalid or has expired.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return Home
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (isFreeTraining(training)) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-20">
          <div className="max-w-2xl mx-auto px-4 w-full text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No Payment Required</h1>
            <p className="text-muted-foreground mb-6">This training is free! You should have received access details via email.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return Home
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const handlePayment = async () => {
    if (!formData || !enrollmentId || !paymentReference) return

    setLoading(true)
    try {
      // Initialize payment with Paystack
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId,
          paymentReference,
          currency,
          amount: price,
          email: formData.email,
          fullName: formData.fullName || `${formData.firstName} ${formData.lastName}`,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to initialize payment')
      }

      const { authorization_url, access_code } = result.data

      // Redirect to Paystack payment page
      window.location.href = authorization_url

    } catch (error) {
      console.error('Payment initialization failed:', error)
      alert('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    setCurrency(newCurrency)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <div className="bg-card rounded-xl border border-border p-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground mb-8">Secure payment powered by Paystack</p>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="p-6 bg-muted/30 rounded-lg border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Training Program:</span>
                    <span className="font-medium text-foreground">{training}</span>
                  </div>
                  
                  {/* Currency Selection */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Currency:</span>
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value as SupportedCurrency)}
                      className="px-3 py-1 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
                        <option key={code} value={code}>
                          {info.symbol} {code} - {info.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">{formattedPrice}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-muted/30 rounded-lg border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💳</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Paystack</p>
                    <p className="text-sm text-muted-foreground">Secure card payment</p>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-green-700">Your payment is secure</p>
                    <p className="text-sm text-green-600">All transactions are encrypted and protected</p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Pay {formattedPrice} with Paystack
                  </>
                )}
              </button>

              {/* Back Link */}
              <button
                onClick={() => router.back()}
                className="w-full px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
