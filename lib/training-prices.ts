// Training pricing configuration with multi-currency support
import { SupportedCurrency, SUPPORTED_CURRENCIES } from './paystack'

// Base prices in USD (we'll convert to other currencies)
const BASE_TRAINING_PRICES: Record<string, number> = {
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
  "Job Opportunities": 0,
  "Talent Staffing": 0,
}

// Currency conversion rates (you can fetch these from an API in production)
const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  USD: 1,        // Base currency
  NGN: 1650,     // 1 USD = 1650 NGN (approximate)
  GHS: 12,       // 1 USD = 12 GHS (approximate)
  ZAR: 18,       // 1 USD = 18 ZAR (approximate)
  KES: 150,      // 1 USD = 150 KES (approximate)
}

// Get training price in specific currency
export const getTrainingPrice = (trainingName: string, currency: SupportedCurrency = 'USD'): number => {
  const basePrice = BASE_TRAINING_PRICES[trainingName] || 0
  if (basePrice === 0) return 0 // Free courses remain free
  
  const rate = CURRENCY_RATES[currency]
  return Math.round(basePrice * rate)
}

// Get all training prices in specific currency
export const getAllTrainingPrices = (currency: SupportedCurrency = 'USD'): Record<string, number> => {
  const prices: Record<string, number> = {}
  
  Object.entries(BASE_TRAINING_PRICES).forEach(([training, basePrice]) => {
    prices[training] = getTrainingPrice(training, currency)
  })
  
  return prices
}

// Get formatted price with currency symbol
export const getFormattedTrainingPrice = (trainingName: string, currency: SupportedCurrency = 'USD'): string => {
  const price = getTrainingPrice(trainingName, currency)
  const currencyInfo = SUPPORTED_CURRENCIES[currency]
  
  if (price === 0) return 'Free'
  return `${currencyInfo.symbol}${price.toLocaleString()}`
}

// Check if training is free
export const isFreeTraining = (trainingName: string): boolean => {
  return BASE_TRAINING_PRICES[trainingName] === 0
}