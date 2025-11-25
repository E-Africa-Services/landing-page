// Paystack configuration and utilities

export const PAYSTACK_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  apiUrl: 'https://api.paystack.co',
}

// Supported currencies by Paystack
export const SUPPORTED_CURRENCIES = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', multiplier: 100 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', multiplier: 100 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', multiplier: 100 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', multiplier: 100 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', multiplier: 100 },
} as const

export type SupportedCurrency = keyof typeof SUPPORTED_CURRENCIES

// Default currency (can be changed per transaction)
export const DEFAULT_CURRENCY: SupportedCurrency = 'USD'

// Payment configuration
export const PAYMENT_CONFIG = {
  defaultCurrency: DEFAULT_CURRENCY,
  supportedCurrencies: Object.keys(SUPPORTED_CURRENCIES) as SupportedCurrency[],
}

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'EA_TRAIN') => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}_${timestamp}_${random}`
}

// Convert amount to Paystack format (multiply by 100 for kobo/cents)
export const formatAmountForPaystack = (amount: number, currency: SupportedCurrency = DEFAULT_CURRENCY): number => {
  const multiplier = SUPPORTED_CURRENCIES[currency].multiplier
  return Math.round(amount * multiplier)
}

// Convert amount from Paystack format back to regular amount
export const formatAmountFromPaystack = (amount: number, currency: SupportedCurrency = DEFAULT_CURRENCY): number => {
  const multiplier = SUPPORTED_CURRENCIES[currency].multiplier
  return amount / multiplier
}

// Format amount for display with currency symbol
export const formatCurrencyDisplay = (amount: number, currency: SupportedCurrency = DEFAULT_CURRENCY): string => {
  const currencyInfo = SUPPORTED_CURRENCIES[currency]
  return `${currencyInfo.symbol}${amount.toFixed(2)}`
}

// Get currency info
export const getCurrencyInfo = (currency: SupportedCurrency) => {
  return SUPPORTED_CURRENCIES[currency]
}

// Validate if currency is supported
export const isCurrencySupported = (currency: string): currency is SupportedCurrency => {
  return currency in SUPPORTED_CURRENCIES
}

// Validate Paystack configuration
export const validatePaystackConfig = (): boolean => {
  return !!(PAYSTACK_CONFIG.publicKey && PAYSTACK_CONFIG.secretKey)
}