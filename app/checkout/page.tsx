'use client'
import React, { useState, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CAR_DATABASE } from '@/data/cars'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

function CheckoutContent () {
  const searchParams = useSearchParams()
  const router = useRouter()

  // ==========================================
  // PERBAIKAN DI SINI: Parsing Data 'config'
  // ==========================================

  // 1. Ambil query param tunggal bernama 'config'
  const configParam = searchParams.get('config')

  // 2. Parse JSON string kembali menjadi Object
  const configData = useMemo(() => {
    if (!configParam) return null
    try {
      return JSON.parse(decodeURIComponent(configParam))
    } catch (error) {
      console.error('Gagal memproses data config:', error)
      return null
    }
  }, [configParam])

  // 3. Ekstrak data dari object configData
  const carId = configData?.carId
  const selectedColor = configData?.exteriorColor || '#ffffff'
  const interiorColor = configData?.interiorColor || '#2b2b2b'

  // Konversi Object parts (key:value) menjadi Array string untuk ditampilkan
  // ConfigurePage mengirim format: { wheels: 'id_velg', tires: 'id_ban' }
  const rawParts = configData?.parts || {}
  const selectedParts: string[] = Object.values(rawParts).filter(
    (val): val is string => typeof val === 'string' && Boolean(val)
  )

  // Cari Data Mobil di Database
  const car = CAR_DATABASE.find(c => c.id === Number(carId))

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Jika mobil tidak ditemukan
  if (!car)
    return (
      <div className='min-h-screen bg-black flex flex-col items-center justify-center text-white'>
        <p className='mb-4'>No vehicle selected or data invalid.</p>
        <Link
          href='/showroom'
          className='text-xs font-bold uppercase tracking-widest border-b border-white pb-1'
        >
          Return to Showroom
        </Link>
      </div>
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // --- LOGIKA PENYIMPANAN DATA (MOCK BACKEND) ---
    const newBooking = {
      id: crypto.randomUUID(),
      carName: car.name,
      color: selectedColor,
      interiorColor: interiorColor,
      parts: selectedParts,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      status: 'Pending Review',
      price: car.price,
      createdAt: new Date().toISOString()
    }

    // Simpan ke LocalStorage Browser
    const existingBookings = JSON.parse(
      localStorage.getItem('luxforge_bookings') || '[]'
    )
    const updatedBookings = [newBooking, ...existingBookings]
    localStorage.setItem('luxforge_bookings', JSON.stringify(updatedBookings))

    // Simulasi Delay Server
    setTimeout(() => {
      alert(
        'Permintaan Anda telah diterima! Concierge kami akan segera menghubungi Anda.'
      )
      // Redirect kemana saja yang diinginkan setelah sukses
      router.push('/showroom')
    }, 2000)
  }

  return (
    <div className='pt-24 min-h-screen bg-neutral-950 flex justify-center px-4 md:px-6 pb-20 font-sans'>
      <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-[#050505] shadow-2xl'>
        {/* ======================= */}
        {/* KOLOM KIRI: RINGKASAN   */}
        {/* ======================= */}
        <div className='lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0a0a0a] relative overflow-hidden'>
          <Link
            href={`/configure/${car.id}`}
            className='absolute top-8 left-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors z-10'
          >
            <ArrowLeft size={14} className='mr-2' /> Back to Config
          </Link>

          <div className='mt-12 mb-8'>
            <h1 className='text-3xl font-serif text-white mb-2 uppercase leading-none'>
              {car.name}
            </h1>
            <p className='text-gray-500 font-mono text-sm'>{car.price}</p>
          </div>

          {/* Preview Mobil */}
          <div className='relative aspect-video bg-black border border-white/10 mb-8 group overflow-hidden'>
            <img
              src={car.image}
              className='w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 grayscale'
              alt='car preview'
            />
            {/* Overlay Warna Pilihan */}
            <div
              className='absolute inset-0 opacity-20 mix-blend-overlay'
              style={{ backgroundColor: selectedColor }}
            ></div>

            {/* Interior Accent Strip */}
            <div
              className='absolute top-0 right-0 w-2 h-full opacity-60'
              style={{ backgroundColor: interiorColor }}
            ></div>

            <div className='absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur px-4 py-2 border-t border-white/10 flex justify-between items-center'>
              <span className='text-[10px] uppercase text-gray-400 tracking-widest'>
                Bespoke Paint
              </span>
              <div className='flex items-center gap-2'>
                <span className='text-[10px] uppercase text-white font-mono'>
                  {selectedColor}
                </span>
                <div
                  className='w-3 h-3 rounded-full border border-white/30'
                  style={{ backgroundColor: selectedColor }}
                ></div>
              </div>
            </div>
          </div>

          {/* Detail Item */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center py-3 border-b border-white/5 text-xs'>
              <span className='text-gray-500 uppercase tracking-wider'>
                Base Model Price
              </span>
              <span className='text-white font-mono'>{car.price}</span>
            </div>
            <div className='flex justify-between items-center py-3 border-b border-white/5 text-xs'>
              <span className='text-gray-500 uppercase tracking-wider'>
                Custom Paint
              </span>
              <span className='text-white font-mono'>INCLUDED</span>
            </div>

            <div className='flex justify-between items-center py-3 border-b border-white/5 text-xs'>
              <span className='text-gray-500 uppercase tracking-wider'>
                Interior Color
              </span>
              <div className='flex items-center gap-2'>
                <span className='text-white font-mono'>{interiorColor}</span>
                <span
                  className='w-3 h-3 rounded-full border border-white/30'
                  style={{ backgroundColor: interiorColor }}
                ></span>
              </div>
            </div>

            {/* Menampilkan Parts yang dipilih */}
            {selectedParts.length > 0 && (
              <div className='py-3 border-b border-white/5 text-xs'>
                <span className='text-gray-500 uppercase tracking-wider'>
                  Selected Upgrades
                </span>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {selectedParts.map(p => (
                    <span
                      key={p}
                      className='px-2 py-1 bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-widest'
                    >
                      {p.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className='flex justify-between items-center py-3 border-b border-white/5 text-xs'>
              <span className='text-gray-500 uppercase tracking-wider'>
                Import Duties
              </span>
              <span className='text-white font-mono'>CALCULATED</span>
            </div>
            <div className='mt-8 p-4 bg-white/5 border border-white/10 flex gap-4 items-start'>
              <ShieldCheck className='text-emerald-500 shrink-0' size={20} />
              <div>
                <h4 className='text-white text-xs font-bold uppercase mb-1'>
                  Secure Transaction
                </h4>
                <p className='text-gray-500 text-[10px] leading-relaxed'>
                  Pembayaran Anda dilindungi oleh Escrow LuxForge. Dana hanya
                  diteruskan ke dealer setelah inspeksi fisik selesai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* KOLOM KANAN: FORMULIR   */}
        {/* ======================= */}
        <div className='lg:col-span-7 p-8 md:p-12 bg-black'>
          <h3 className='text-xl font-serif text-white mb-2 uppercase'>
            Concierge Application
          </h3>
          <p className='text-gray-500 text-xs mb-10'>
            Please complete your profile to request an allocation.
          </p>

          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                  Full Name
                </label>
                <div className='flex items-center border-b border-white/20 bg-transparent py-2 focus-within:border-white transition-colors'>
                  <User size={16} className='text-gray-500 mr-3' />
                  <input
                    required
                    type='text'
                    className='bg-transparent w-full text-white outline-none text-sm placeholder-gray-700'
                    placeholder='EX: ALEXANDER HAMILTON'
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                  Phone Number
                </label>
                <div className='flex items-center border-b border-white/20 bg-transparent py-2 focus-within:border-white transition-colors'>
                  <Phone size={16} className='text-gray-500 mr-3' />
                  <input
                    required
                    type='tel'
                    className='bg-transparent w-full text-white outline-none text-sm placeholder-gray-700'
                    placeholder='+62 812 XXXX XXXX'
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                Email Address
              </label>
              <div className='flex items-center border-b border-white/20 bg-transparent py-2 focus-within:border-white transition-colors'>
                <Mail size={16} className='text-gray-500 mr-3' />
                <input
                  required
                  type='email'
                  className='bg-transparent w-full text-white outline-none text-sm placeholder-gray-700'
                  placeholder='CLIENT@LUXFORGE.ID'
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                Preferred Appointment Date
              </label>
              <div className='flex items-center border-b border-white/20 bg-transparent py-2 focus-within:border-white transition-colors'>
                <Calendar size={16} className='text-gray-500 mr-3' />
                <input
                  required
                  type='date'
                  className='bg-transparent w-full text-white outline-none text-sm [color-scheme:dark] uppercase'
                  onChange={e =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='pt-8 mt-8 border-t border-white/10'>
              <button
                disabled={isSubmitting}
                className='w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all flex justify-center items-center gap-3 disabled:opacity-50'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='animate-spin' size={16} /> Processing
                    Request...
                  </>
                ) : (
                  <>
                    Submit Application <CreditCard size={16} />
                  </>
                )}
              </button>
              <p className='text-center text-[10px] text-gray-600 mt-4 uppercase tracking-wider'>
                By clicking submit, you agree to LuxForge Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Komponen Utama yang diexport
export default function CheckoutPage () {
  return (
    <>
      <Suspense
        fallback={
          <div className='min-h-screen bg-black flex items-center justify-center text-white'>
            <Loader2 className='animate-spin mr-2' /> Initializing Secure
            Checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  )
}
