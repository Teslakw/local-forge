'use client'
import Link from 'next/link'
import { CAR_DATABASE, getCarsByCategory, type Car } from '@/data/cars'
import React, { useMemo, useState } from 'react'
import Footer from '@/components/Footer'

export default function Showroom () {
  const categories: Car['category'][] = [
    'Ferrari',
    'Koenigsegg',
    'McLaren',
    'Rolls-Royce',
    'Mercedes',
    'Lamborghini',
    'Porsche',
    'Other'
  ]
  const [active, setActive] = useState<Car['category'] | 'All'>('All')
  const cars = useMemo(() => {
    if (active === 'All') return CAR_DATABASE
    return getCarsByCategory(active as Car['category'])
  }, [active])

  return (
    <>
      <div className='pt-32 px-6 md:px-24 min-h-screen bg-black pb-20 animate-fade-in'>
        <h2 className='text-4xl font-serif text-white mb-2'>THE INVENTORY</h2>
        <div className='w-20 h-1 bg-white mb-12'></div>

        {/* Category filter */}
        <div className='flex flex-wrap gap-3 mb-8'>
          {['All', ...categories].map(c => (
            <button
              key={c}
              onClick={() => setActive(c as any)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border rounded-full ${
                active === c
                  ? 'bg-white text-black'
                  : 'bg-black border-white/20 text-gray-300 hover:border-white/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {cars.map(car => (
            <Link href={`/configure/${car.id}`} key={car.id}>
              <div className='group cursor-pointer'>
                {/* Gambar Card */}
                <div className='relative aspect-[4/3] overflow-hidden mb-4 bg-gray-900 border border-white/10'>
                  <img
                    src={car.image}
                    alt={car.name}
                    className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors'></div>
                </div>
                {/* Info Bawah Card */}
                <div className='flex justify-between items-start border-t border-white/10 pt-4'>
                  <div>
                    <span className='text-[10px] uppercase tracking-widest text-gray-500 block mb-1'>
                      {car.type}
                    </span>
                    <h3 className='text-lg font-serif text-white group-hover:text-gray-300 transition-colors'>
                      {car.name}
                    </h3>
                  </div>
                  <span className='text-sm font-mono text-gray-400'>
                    {car.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Page Footer (outside content container for full width) */}
      <Footer />
    </>
  )
}
