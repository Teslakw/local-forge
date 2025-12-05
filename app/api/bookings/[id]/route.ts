import { NextRequest, NextResponse } from 'next/server'

let memoryStore: any[] = []

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

export async function PATCH (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const payload = await req.json().catch(() => ({}))
  const current = await readAll()
  const idx = current.findIndex((b: any) => b.id === id)
  if (idx === -1)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = { ...current[idx], ...payload }
  current[idx] = updated
  await writeAll(current)
  return NextResponse.json(updated)
}

export async function DELETE (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const current = await readAll()
  const next = current.filter((b: any) => b.id !== id)
  await writeAll(next)
  return NextResponse.json({ ok: true })
}
