import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory fallback for local/dev when KV is not configured
// Note: Not persistent on Vercel. Use Vercel KV in production.
let memoryStore: any[] = []

async function getKV () {
  try {
    // Only attempt to import when KV envs are present
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

async function readAll () {
  const kv = await getKV()
  if (kv) {
    const data = await kv.get('luxforge:bookings')
    return Array.isArray(data) ? (data as any[]) : []
  }
  return memoryStore
}

async function writeAll (list: any[]) {
  const kv = await getKV()
  if (kv) {
    await kv.set('luxforge:bookings', list)
    return
  }
  memoryStore = list
}

export async function GET () {
  const list = await readAll()
  return NextResponse.json(list)
}

export async function POST (req: NextRequest) {
  try {
    const body = await req.json()
    const now = new Date().toISOString()
    const booking = {
      id: body.id || crypto.randomUUID(),
      carName: body.carName,
      color: body.color,
      interiorColor: body.interiorColor,
      parts: Array.isArray(body.parts) ? body.parts : [],
      wheelModel: body.wheelModel,
      tireSpec: body.tireSpec,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      date: body.date,
      status: body.status || 'Pending Review',
      price: body.price,
      createdAt: body.createdAt || now
    }

    // Basic validation
    if (
      !booking.customerName ||
      !booking.email ||
      !booking.phone ||
      !booking.carName
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const current = await readAll()
    const updated = [booking, ...current]
    await writeAll(updated)

    return NextResponse.json(booking, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
