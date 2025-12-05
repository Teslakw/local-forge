import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const FILE_PATH = path.join(process.cwd(), 'data', 'bookings.json')

async function getKV () {
  try {
    if (
      process.env.KV_REST_API_URL &&
      (process.env.KV_REST_API_TOKEN || process.env.KV_URL)
    ) {
      const mod = await import('@vercel/kv')
      return mod.kv
    }
  } catch {}
  return null
}

async function readJSON () {
  try {
    const buf = await fs.readFile(FILE_PATH, 'utf-8')
    const data = JSON.parse(buf)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function writeJSON (list: any[]) {
  try {
    const dir = path.dirname(FILE_PATH)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8')
    return true
  } catch {
    return false
  }
}

export async function POST (_req: NextRequest) {
  const booking = {
    id: crypto.randomUUID(),
    carName: 'SEED-CAR',
    color: '#000',
    interiorColor: '#222',
    parts: ['sample_part'],
    customerName: 'Seed User',
    phone: '000',
    email: 'seed@example.com',
    date: '2025-12-31',
    status: 'Pending Review',
    price: '$0',
    createdAt: new Date().toISOString()
  }
  const kv = await getKV()
  if (kv) {
    const existing = await kv.get('luxforge:bookings')
    const list = Array.isArray(existing) ? (existing as any[]) : []
    await kv.set('luxforge:bookings', [booking, ...list])
    return NextResponse.json({ ok: true, mode: 'kv' })
  }
  const current = await readJSON()
  const updated = [booking, ...current]
  const ok = await writeJSON(updated)
  if (!ok)
    return NextResponse.json({ error: 'write json failed' }, { status: 500 })
  return NextResponse.json({ ok: true, mode: 'json' })
}
