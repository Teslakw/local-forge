'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar () {
  const pathname = usePathname()

  // Sembunyikan navbar di halaman admin agar fokus
  if (pathname.includes('/admin')) return null

  return (
    <nav className='fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-black/80 backdrop-blur-md border-b border-white/5 text-white'>
      <Link href='/' className='cursor-pointer'>
        <h1 className='text-2xl font-serif font-bold tracking-[0.2em]'>
          LUX<span className='font-light text-gray-400'>FORGE</span>
        </h1>
      </Link>
      <div className='hidden md:flex gap-8'>
        <Link
          href='/'
          className='text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors'
        >
          Home
        </Link>
        <Link
          href='/showroom'
          className='text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors'
        >
          Showroom
        </Link>
        <Link
          href='/about'
          className='text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors'
        >
          About
        </Link>
      </div>
    </nav>
  )
}
