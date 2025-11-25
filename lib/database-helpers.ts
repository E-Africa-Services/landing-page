// Database helper functions for training enrollments and payments
import { createClient } from './supabase-server'
import type { TrainingEnrollment, Payment } from './supabase-client'

// Training Enrollment Functions
export async function createTrainingEnrollment(data: Omit<TrainingEnrollment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  
  const { data: enrollment, error } = await supabase
    .from('training_enrollments')
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return enrollment
}

export async function updateTrainingEnrollment(id: string, updates: Partial<TrainingEnrollment>) {
  const supabase = await createClient()
  
  const { data: enrollment, error } = await supabase
    .from('training_enrollments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return enrollment
}

export async function getTrainingEnrollmentByPaymentRef(paymentReference: string) {
  const supabase = await createClient()
  
  const { data: enrollment, error } = await supabase
    .from('training_enrollments')
    .select('*')
    .eq('payment_reference', paymentReference)
    .single()

  if (error) throw error
  return enrollment
}

// Payment Functions
export async function createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return payment
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  const supabase = await createClient()
  
  const { data: payment, error } = await supabase
    .from('payments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return payment
}

export async function getPaymentByReference(paystackReference: string) {
  const supabase = await createClient()
  
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('paystack_reference', paystackReference)
    .single()

  if (error) throw error
  return payment
}

export async function updatePaymentStatus(paystackReference: string, status: Payment['payment_status'], metadata: Record<string, any> = {}) {
  const supabase = await createClient()
  
  const updates: Partial<Payment> = {
    payment_status: status,
    metadata,
    updated_at: new Date().toISOString(),
  }
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }
  
  const { data: payment, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('paystack_reference', paystackReference)
    .select()
    .single()

  if (error) throw error
  return payment
}