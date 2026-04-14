import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://yrjotpgjljgksoyxhdzx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyam90cGdqbGpna3NveXhoZHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTMxMDYsImV4cCI6MjA5MTY4OTEwNn0.QRH3r2hqceQwiaIQyqdsQTcqzQyqsUYF1znmJDmu0FU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// AUTH HELPERS
export async function signUp({ email, password, profileData }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, ...profileData })
  if (profileError) throw profileError

  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getCurrentProfile() {
  const session = await getSession()
  if (!session) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  if (error) throw error
  return data
}

// SUBMISSIONS HELPERS
export async function getSubmissions(filterNew = false) {
  let query = supabase
    .from('submissions')
    .select(`*, profiles:seller_id(id, name, phone, address, notes, avatar_url)`)
    .order('created_at', { ascending: false })

  if (filterNew) query = query.eq('is_new', true)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getMySubmissions(sellerId) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addSubmission({ sellerId, description, price, imageUrl, imagePublicId }) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      seller_id: sellerId,
      description,
      price,
      image_url: imageUrl,
      image_public_id: imagePublicId,
      is_new: true
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSubmission(id, updates) {
  const { data, error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSubmission(id) {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function deleteAllMySubmissions(sellerId) {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('seller_id', sellerId)
  if (error) throw error
}

// PROFILE HELPERS
export async function updateProfile(id, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAllSellers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('type', 'seller')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllDealers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('type', 'dealer')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateDealerStatus(dealerId, status) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ dealer_status: status })
    .eq('id', dealerId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteUser(userId) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
  if (error) throw error
}
