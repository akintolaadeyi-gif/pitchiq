import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface User {
  id: string; email: string; username: string; passwordHash: string; createdAt: string
}

export async function findByEmail(email: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  if (!data) return null
  return { id: data.id, email: data.email, username: data.username, passwordHash: data.password_hash, createdAt: data.created_at }
}

export async function findById(id: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  if (!data) return null
  return { id: data.id, email: data.email, username: data.username, passwordHash: data.password_hash, createdAt: data.created_at }
}

export async function createUser(email: string, password: string, username: string): Promise<User> {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()
  if (existing) throw new Error('Email already registered')

  const { data: existingUsername } = await supabase
    .from('users')
    .select('id')
    .eq('username', username.trim())
    .single()
  if (existingUsername) throw new Error('Username already taken')

  const id = Date.now().toString()
  const passwordHash = await bcrypt.hash(password, 12)
  const { data, error } = await supabase
    .from('users')
    .insert({ id, email: email.toLowerCase().trim(), username: username.trim(), password_hash: passwordHash })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id, email: data.email, username: data.username, passwordHash: data.password_hash, createdAt: data.created_at }
}

export async function verifyPassword(user: User, password: string) {
  return bcrypt.compare(password, user.passwordHash)
}
