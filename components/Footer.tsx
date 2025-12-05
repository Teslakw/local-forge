import React from 'react'

export default function Footer () {
  return (
    <footer className='mt-12 border-t border-white/10 bg-[#0a0a0a]'>
      <div className='px-6 md:px-16 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
        <div>
          <div className='text-2xl font-serif'>LuxForge</div>
          <div className='h-[2px] w-16 bg-[#d4af37] mt-2' />
          <p className='text-gray-500 text-sm mt-3 max-w-md'>
            Bespoke curation, transparent process, and concierge-level service
            for Indonesia’s supercar enthusiasts.
          </p>
        </div>
        <div className='flex gap-10 text-sm'>
          <div>
            <div className='text-gray-400 uppercase tracking-widest text-[10px] mb-2'>
              Company
            </div>
            <a href='/' className='text-white/80'>
              Home
            </a>
            <a href='/showroom' className='text-white/80 block'>
              Showroom
            </a>
            <a href='/about' className='text-white/80 block'>
              About
            </a>
          </div>
          <div>
            <div className='text-gray-400 uppercase tracking-widest text-[10px] mb-2'>
              Contact
            </div>
            <div className='text-white/80'>hello@luxforge.id</div>
            <div className='text-white/80'>Jakarta, Indonesia</div>
          </div>
        </div>
      </div>
      <div className='px-6 md:px-16 py-4 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-widest'>
        © {new Date().getFullYear()} LuxForge. All rights reserved.
      </div>
    </footer>
  )
}
