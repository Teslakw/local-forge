import { NextResponse } from 'next/server'

export async function GET () {
  let mode: 'kv' | 'json' = 'json'
  let kvOk = false
  try {
    if (
      process.env.KV_REST_API_URL &&
      (process.env.KV_REST_API_TOKEN || process.env.KV_URL)
    ) {
      const mod = await import('@vercel/kv')
      const kv = mod.kv
      mode = 'kv'
      const data = await kv.get('luxforge:bookings')
      kvOk = Array.isArray(data)
      return NextResponse.json({
        mode,
        kvOk,
        count: kvOk ? (data as any[]).length : 0
      })
    }
  } catch {}
  // JSON mode
  return NextResponse.json({
    mode,
    kvOk,
    note: 'Using JSON file storage locally'
  })
}
