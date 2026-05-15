import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const DB = path.join(process.cwd(), 'users.json')

export interface User {
  id: string; email: string; username: string; passwordHash: string; createdAt: string
}

function read(): User[] {
  try { return fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf-8')) : [] }
  catch { return [] }
}
function write(u: User[]) { fs.writeFileSync(DB, JSON.stringify(u, null, 2)) }

export function findByEmail(email: string) {
  return read().find(u => u.email.toLowerCase() === email.toLowerCase())
}
export function findById(id: string) { return read().find(u => u.id === id) }

export async function createUser(email: string, password: string, username: string): Promise<User> {
  const users = read()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('Email already registered')
  const user: User = {
    id: Date.now().toString(),
    email: email.toLowerCase().trim(),
    username: username.trim(),
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  write(users)
  return user
}

export async function verifyPassword(user: User, password: string) {
  return bcrypt.compare(password, user.passwordHash)
}
