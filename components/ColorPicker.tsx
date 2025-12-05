'use client'
import React from 'react'

interface Props {
  color: string
  onChange: (c: string) => void
}

export default function SpectrumColorPicker ({ color, onChange }: Props) {
  return (
    <div className='bg-[#111] border border-white/10 p-4 rounded-sm shadow-2xl mt-6'>
      <label className='text-xs uppercase tracking-widest text-gray-400 mb-2 block'>
        Bespoke Paint Selection
      </label>

      {/* Visual Spectrum Input */}
      <div className='relative w-full h-32 rounded-sm overflow-hidden cursor-crosshair mb-4 border border-white/20 group'>
        {/* Lapisan Gradient Warna */}
        <div className='absolute inset-0 bg-gradient-to-r from-white via-red-500 to-black'></div>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50'></div>

        {/* Input Native HTML (Invisible but functional) */}
        <input
          type='color'
          value={color}
          onChange={e => onChange(e.target.value)}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
        />

        {/* Overlay Text */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <span className='text-[10px] uppercase text-white/50 bg-black/50 px-2 py-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity'>
            Tap to Select Color
          </span>
        </div>
      </div>

      {/* Hex Code Display */}
      <div className='flex items-center gap-2 bg-black border border-white/10 p-2'>
        <div
          className='w-6 h-6 border border-white/20'
          style={{ backgroundColor: color }}
        ></div>
        <span className='text-gray-500 text-xs'>HEX CODE</span>
        <input
          type='text'
          value={color.toUpperCase()}
          readOnly
          className='bg-transparent border-none text-white text-xs font-mono w-full focus:outline-none uppercase'
        />
      </div>
    </div>
  )
}
