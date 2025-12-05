'use client'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  color: string
  onChange: (hex: string) => void
}

// Helper untuk konversi warna
const hexToHsv = (hex: string) => {
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 4) {
    r = parseInt('0x' + hex[1] + hex[1])
    g = parseInt('0x' + hex[2] + hex[2])
    b = parseInt('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = parseInt('0x' + hex[1] + hex[2])
    g = parseInt('0x' + hex[3] + hex[4])
    b = parseInt('0x' + hex[5] + hex[6])
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    v = max
  const d = max - min
  s = max === 0 ? 0 : d / max
  if (max === min) {
    h = 0
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, v: v * 100 }
}

const hsvToHex = (h: number, s: number, v: number) => {
  let r = 0,
    g = 0,
    b = 0
  const i = Math.floor(h / 60)
  const f = h / 60 - i
  const p = v * (1 - s / 100)
  const q = v * (1 - (f * s) / 100)
  const t = v * (1 - ((1 - f) * s) / 100)
  v = v / 100 // normalize back if needed but logic above assumed 0-100 range for calculation steps differently
  // Re-standard logic for 0-100 inputs:
  const S = s / 100
  const V = v
  const C = V * S
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = V - C
  let R1 = 0,
    G1 = 0,
    B1 = 0

  if (h >= 0 && h < 60) {
    R1 = C
    G1 = X
    B1 = 0
  } else if (h >= 60 && h < 120) {
    R1 = X
    G1 = C
    B1 = 0
  } else if (h >= 120 && h < 180) {
    R1 = 0
    G1 = C
    B1 = X
  } else if (h >= 180 && h < 240) {
    R1 = 0
    G1 = X
    B1 = C
  } else if (h >= 240 && h < 300) {
    R1 = X
    G1 = 0
    B1 = C
  } else if (h >= 300 && h < 360) {
    R1 = C
    G1 = 0
    B1 = X
  }

  const toHex = (c: number) => {
    const hex = Math.round((c + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(R1)}${toHex(G1)}${toHex(B1)}`
}

export default function AdvancedColorPicker ({ color, onChange }: Props) {
  const [hsv, setHsv] = useState(hexToHsv(color))
  const [isDraggingMap, setIsDraggingMap] = useState(false)
  const [isDraggingHue, setIsDraggingHue] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Sync internal state if external color changes
  useEffect(() => {
    setHsv(hexToHsv(color))
  }, [color])

  // Handle Dragging pada Area Utama (Saturation & Value)
  const handleMapMove = (e: MouseEvent | React.MouseEvent) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    const newS = x * 100
    const newV = (1 - y) * 100

    const newHsv = { ...hsv, s: newS, v: newV }
    setHsv(newHsv)
    onChange(hsvToHex(newHsv.h, newS, newV))
  }

  // Handle Dragging pada Slider Hue (Pelangi)
  const handleHueMove = (e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return
    const rect = hueRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

    const newH = x * 360
    const newHsv = { ...hsv, h: newH }
    setHsv(newHsv)
    onChange(hsvToHex(newH, newHsv.s, newHsv.v))
  }

  // Global Mouse Events untuk Dragging yang mulus
  useEffect(() => {
    const handleUp = () => {
      setIsDraggingMap(false)
      setIsDraggingHue(false)
    }
    const handleMove = (e: MouseEvent) => {
      if (isDraggingMap) handleMapMove(e)
      if (isDraggingHue) handleHueMove(e)
    }
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [isDraggingMap, isDraggingHue, hsv])

  return (
    <div className='bg-[#1e1e1e] p-4 rounded-xl shadow-2xl border border-white/10 w-full max-w-[320px]'>
      <label className='text-xs font-bold text-gray-400 mb-3 block uppercase tracking-wider'>
        Custom Paint
      </label>

      {/* 1. AREA SATURATION & BRIGHTNESS (Kotak Besar) */}
      <div
        ref={mapRef}
        className='relative w-full h-40 rounded-lg cursor-crosshair mb-4 overflow-hidden'
        style={{
          backgroundColor: hsvToHex(hsv.h, 100, 100),
          backgroundImage: `
            linear-gradient(to right, #fff, transparent),
            linear-gradient(to top, #000, transparent)
          `
        }}
        onMouseDown={e => {
          setIsDraggingMap(true)
          handleMapMove(e)
        }}
      >
        {/* Lingkaran Penunjuk */}
        <div
          className='absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2'
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: color
          }}
        />
      </div>

      {/* 2. SLIDER HUE (Pelangi) */}
      <div
        ref={hueRef}
        className='relative w-full h-4 rounded-full cursor-pointer mb-4'
        style={{
          background:
            'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
        }}
        onMouseDown={e => {
          setIsDraggingHue(true)
          handleHueMove(e)
        }}
      >
        {/* Slider Handle */}
        <div
          className='absolute top-0 bottom-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full shadow transform -translate-x-1/2 pointer-events-none'
          style={{ left: `${(hsv.h / 360) * 100}%` }}
        />
      </div>

      {/* 3. INPUT HEX & PREVIEW */}
      <div className='flex items-center gap-3 bg-black/50 p-2 rounded-lg border border-white/10'>
        <div
          className='w-8 h-8 rounded-md border border-white/20 shadow-inner'
          style={{ backgroundColor: color }}
        ></div>
        <div className='flex-1 flex flex-col'>
          <span className='text-[10px] text-gray-500 font-bold uppercase'>
            Hex Code
          </span>
          <div className='flex items-center text-white font-mono text-sm'>
            #
            <input
              type='text'
              value={color.replace('#', '').toUpperCase()}
              onChange={e => onChange(`#${e.target.value}`)}
              className='bg-transparent border-none outline-none w-full uppercase'
              maxLength={6}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
