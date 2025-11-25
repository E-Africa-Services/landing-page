// Payment validation utilities
import { getTrainingPrice } from './training-prices'
import type { SupportedCurrency } from './paystack'

/**
 * Validates that a payment amount matches the expected price for a training program
 * @param amount - The amount being paid
 * @param trainingProgram - The training program name
 * @param currency - The currency code
 * @returns true if valid, false if invalid
 */
export function validatePaymentAmount(
  amount: number, 
  trainingProgram: string, 
  currency: SupportedCurrency
): boolean {
  const expectedPrice = getTrainingPrice(trainingProgram, currency)
  
  // Allow for small floating point differences (1 cent)
  return Math.abs(amount - expectedPrice) <= 0.01
}

/**
 * Gets the expected price for validation and returns validation result
 * @param amount - The amount being paid
 * @param trainingProgram - The training program name
 * @param currency - The currency code
 * @returns object with validation result and details
 */
export function validatePaymentAmountWithDetails(
  amount: number, 
  trainingProgram: string, 
  currency: SupportedCurrency
) {
  const expectedPrice = getTrainingPrice(trainingProgram, currency)
  const isValid = Math.abs(amount - expectedPrice) <= 0.01
  
  return {
    isValid,
    expectedPrice,
    actualAmount: amount,
    currency,
    trainingProgram,
    difference: Math.abs(amount - expectedPrice)
  }
}

/**
 * Creates a standardized error message for amount validation failures
 */
export function createAmountValidationError(
  expectedPrice: number,
  actualAmount: number,
  currency: SupportedCurrency,
  trainingProgram: string
): string {
  return `Invalid payment amount for "${trainingProgram}". Expected ${expectedPrice} ${currency}, but received ${actualAmount} ${currency}.`
}