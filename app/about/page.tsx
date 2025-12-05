'use client'
import React from 'react'

export default function AboutPage () {
  const team = [
    {
      name: 'Aria Santoso',
      title: 'Founder & CEO',
      photo:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800'
    },
    {
      name: 'Dimas Putra',
      title: 'Head of Design',
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800'
    },
    {
      name: 'Nadia Prameswari',
      title: 'Lead Engineer',
      photo:
        'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=800'
    },
    {
      name: 'Raka Pratama',
      title: 'Client Concierge',
      photo:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800'
    },
    {
      name: 'Maya Lestari',
      title: 'Partnership Director',
      photo:
        'https://images.unsplash.com/photo-1543966888-7c1dc482a4f3?q=80&w=800'
    },
    {
      name: 'Gio Hartono',
      title: 'Operations Lead',
      photo:
        'https://images.unsplash.com/photo-1544005313-2b95ae0f5d9b?q=80&w=800'
    }
  ]

  return (
    <div className='bg-black text-white min-h-screen pt-24 flex flex-col'>
      <section className='px-6 md:px-16'>
        <h1 className='text-4xl md:text-6xl font-serif mb-4 animate-fade-in'>
          About LuxForge
        </h1>
        <div className='h-[2px] w-24 bg-[#d4af37] mb-6 animate-width-in' />
        <p className='text-gray-300 max-w-3xl animate-slide-up'>
          LuxForge is a boutique platform for curated supercars in Indonesia. We
          combine meticulous curation, client-centric concierge, and transparent
          processes to deliver a truly elevated acquisition experience.
        </p>
      </section>

      <section className='px-6 md:px-16 mt-12 grid md:grid-cols-3 gap-6'>
        <div className='bg-white/5 border border-white/10 p-6 animate-card-in'>
          <h3 className='text-xl font-serif mb-2'>Our Mission</h3>
          <p className='text-gray-400'>
            Present only the finest, verified supercars with an uncompromising
            client journey.
          </p>
        </div>
        <div
          className='bg-white/5 border border-white/10 p-6 animate-card-in'
          style={{ animationDelay: '0.1s' }}
        >
          <h3 className='text-xl font-serif mb-2'>Our Values</h3>
          <p className='text-gray-400'>
            Provenance, transparency, craft, and a relentless focus on detail.
          </p>
        </div>
        <div
          className='bg-white/5 border border-white/10 p-6 animate-card-in'
          style={{ animationDelay: '0.2s' }}
        >
          <h3 className='text-xl font-serif mb-2'>Our Promise</h3>
          <p className='text-gray-400'>
            Concierge-level support from configuration to allocation.
          </p>
        </div>
      </section>

      <section className='px-6 md:px-16 mt-16 flex-1'>
        <h2 className='text-3xl font-serif mb-4 animate-fade-in'>
          Leadership Team
        </h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {team.map(t => (
            <div
              key={t.name}
              className='bg-white/5 border border-white/10 p-4 animate-card-in'
            >
              <div className='aspect-square overflow-hidden rounded-lg border border-white/10 mb-3'>
                <img
                  src={t.photo}
                  alt={t.name}
                  className='w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700'
                />
              </div>
              <div className='text-white font-semibold'>{t.name}</div>
              <div className='text-gray-500 text-sm'>{t.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Footer */}
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
              <div className='text-white/80'>About</div>
              <div className='text-white/80'>Showroom</div>
              <div className='text-white/80'>Concierge</div>
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
    </div>
  )
}
