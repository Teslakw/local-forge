'use client'
import React, { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CAR_DATABASE } from '@/data/cars'
import AdvancedColorPicker from '@/components/AdvancedColorPicker'
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

/**
 * Full dynamic configurator page
 * - All part categories are in PART_SECTIONS (editable)
 * - Images use <img> so external links from Google work without next.config change
 * - Card style: full bleed image, no border-radius
 * - Preview reacts to: wheel, tire, spoiler, exhaust, brakes (visual), interior color
 */

/* =========================
   Configuration: PART SECTIONS
   Replace image URLs with Google links you want.
   Each section must have id (key), title, and items (id,name,image).
   ========================= */
const PART_SECTIONS = [
  {
    key: 'wheels',
    title: 'Wheels / Pelek',
    items: [
      {
        id: 'wheel_forged',
        name: '21" Forged Wheel',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWL0r1ya0Ge8fsYvBfzA6RqaqtLAvMRGw3bA&s'
      },
      {
        id: 'wheel_carbon',
        name: '22" Carbon Wheel',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRcUh4Ld0MMEdV1bInl3TgNLZ2yVk4gdm7ew&s'
      },
      {
        id: 'wheel_track',
        name: 'Track Lightweight',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgKo9SCm9vkdbeq0zZNDAqmuUGHiZjd06q2w&s'
      }
    ]
  },
  {
    key: 'tires',
    title: 'Tires / Ban',
    items: [
      {
        id: 'tire_street',
        name: 'Street Tire',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRsKw-QG304TNQ2uGb8p7DdErA2DC8YAY_g&s'
      },
      {
        id: 'tire_sport',
        name: 'Sport Performance',
        image:
          'https://id-live-01.slatic.net/p/017749da92ac73ba709a395d5f7d8554.jpg'
      },
      {
        id: 'tire_track',
        name: 'Track R-Compound',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx8tQpLMtvpIxS63q8s3ML5XU1HI3rX69zfg&s'
      }
    ]
  },
  {
    key: 'aerokit',
    title: 'Aerokit / Aero Exterior',
    items: [
      {
        id: 'aero_sport',
        name: 'Sport Aero Kit',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAZ_0z-rBlQmMym0GBoEpulWVynHSATyUq1w&s'
      },
      {
        id: 'aero_gt',
        name: 'GT Aerokit',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0lCAl0mcag7cF4tM7KH7mskbBBrQMNL-jow&s'
      }
    ]
  },
  {
    key: 'exhaust',
    title: 'Exhaust',
    items: [
      {
        id: 'exhaust_stock',
        name: 'Stock Exhaust',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBdIUTUd2hRUM82VpQStwFJZj2FFr6o7ursA&s'
      },
      {
        id: 'exhaust_sport',
        name: 'Sport Titanium',
        image:
          'https://www.design911.com/uploads/products/c5a0d534-571b-480f-a25a-769cefe8ab2a/3606009140_01.jpg'
      },
      {
        id: 'exhaust_race',
        name: 'Race Straight Pipe',
        image:
          'https://flat6motorsports.com/cdn/shop/products/Soul-Performance-Products-Porsche-992-GT3-Race-Exhaust-System-Catted-Product-Straight-Cut-Signature-Satin-Tips-scaled.jpg?v=1637028917'
      }
    ]
  },
  {
    key: 'brakes',
    title: 'Brake System',
    items: [
      {
        id: 'brake_stock',
        name: 'Stock Brake Kit',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJN_8UDGw-KiMYJrWWrrsy1ZbdAfPCMKzJlA&s'
      },
      {
        id: 'brake_ceramic',
        name: 'Ceramic Brakes (Red)',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeOnlDQznIF9YMTRYxFAYXajh0bIv-QFRGFg&s'
      },
      {
        id: 'brake_sport',
        name: 'Sport Brake Kit',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNNUczI8jVb-BjlfnwNU5mH_ZjOUyjP5SFDw&s'
      }
    ]
  },
  {
    key: 'interiorTrim',
    title: 'Interior Trim',
    items: [
      {
        id: 'trim_alcantara',
        name: 'Alcantara Trim',
        image:
          'https://imageio.forbes.com/blogs-images/johnmccormick/files/2018/04/2018Mar06_alcantara_ginevra_1194-1200x800.jpg?height=474&width=711&fit=bounds'
      },
      {
        id: 'trim_leather',
        name: 'Full Leather',
        image:
          'https://di-uploads-pod2.dealerinspire.com/waltersporsche/uploads/2021/05/2021-porsche-taycan-interior-truffle-brown.jpeg'
      }
    ]
  },
  {
    key: 'seats',
    title: 'Seat Type',
    items: [
      {
        id: 'seat_racing',
        name: 'Racing Seat',
        image: 'https://m.media-amazon.com/images/I/81-oG5mwl+L.jpg'
      },
      {
        id: 'seat_leather',
        name: 'Comfort Leather',
        image: 'https://m.media-amazon.com/images/I/71w8xWC9FDL.jpg'
      }
    ]
  },
  {
    key: 'sound',
    title: 'Sound System',
    items: [
      {
        id: 'sound_stock',
        name: 'Stock System',
        image:
          'https://cdn.8mediatech.com/gambar/62091267552-harga_audio_mobil.jpg'
      },
      {
        id: 'sound_premium',
        name: 'Premium Audio',
        image:
          'https://venom-audio.com/wp-content/uploads/2024/12/540_d81ac6bc8eda190a5198826281062b47.jpg'
      }
    ]
  },
  {
    key: 'bodykit',
    title: 'Body Kit Package',
    items: [
      {
        id: 'body_stock',
        name: 'Stock',
        image:
          'https://images.tokopedia.net/img/cache/700/attachment/2018/12/26/154581876460322/154581876460322_42cf4f76-5883-4a79-88db-96a5f78f992b.png'
      },
      {
        id: 'body_sport',
        name: 'Sport Bodykit',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgYr7DQOkz4XLpjP6R1Rop_CfQD6qwlVtdEg&s'
      },
      {
        id: 'body_wide',
        name: 'Widebody',
        image:
          'https://undergroundautohouse.com/cdn/shop/products/Screen_Shot_2021-11-30_at_8.28.39_PM_1800x1800.png?v=1638325977'
      }
    ]
  },
  {
    key: 'lights',
    title: 'Lights / Headlamp / Taillight',
    items: [
      {
        id: 'light_stock',
        name: 'Stock Lighting',
        image:
          'https://image.made-in-china.com/43f34j00cOuiNylFkUzk/Headlight-Large-Stock-Auto-Lighting-Systems-Car-LED-Headlamp-for-Lx-Is250-Accessories.webp'
      },
      {
        id: 'light_led',
        name: 'LED Upgrade',
        image:
          'https://xmxpc86yeg.otospector.co.id/wp-content/uploads/2021/12/Projektor-lampu-LED.jpg'
      },
      {
        id: 'light_race',
        name: 'Racing Lamps',
        image:
          'https://asset.kompas.com/crops/5chWtxzpsXUipPQJpflPEEcJOoY=/0x0:750x500/1200x800/data/photo/2022/01/12/61deed9fdf589.jpeg'
      }
    ]
  }
]

/* =========================
   PartSelectionSection component
   - full-bleed images (no border-radius)
   - selected state highlight border + check icon
   - clicking sets selected id for that section
   ========================= */
function PartSelectionSection ({
  title,
  options,
  selected,
  onSelect
}: {
  title: string
  options: { id: string; name: string; image: string }[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <section className='mt-14 w-full px-6 lg:px-10'>
      <h3 className='uppercase text-sm tracking-wide font-semibold border-b border-white/10 pb-3 mb-6 text-white/80'>
        {title}
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {options.map(opt => (
          <div
            key={opt.id}
            role='button'
            onClick={() => onSelect(opt.id)}
            className={`relative cursor-pointer overflow-hidden transition-all border ${
              selected === opt.id ? 'border-white' : 'border-white/10'
            }`}
            style={{ borderRadius: 0 }}
          >
            <div style={{ width: '100%', height: 176, position: 'relative' }}>
              <img
                src={opt.image}
                alt={opt.name}
                style={{
                  width: '100%',
                  height: '176px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                loading='lazy'
              />
            </div>

            <div className='p-3 bg-neutral-900 text-center uppercase tracking-wide text-sm'>
              {opt.name}
            </div>

            {selected === opt.id && (
              <div className='absolute top-3 right-3 bg-white text-black p-1'>
                <Check size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* =========================
   Page Component
   - dynamic state based on PART_SECTIONS keys
   - preview svg reacts to a subset of parts
   ========================= */
export default function ConfigurePage () {
  const params = useParams()
  const router = useRouter()

  const [exteriorColor, setExteriorColor] = useState('#D92525')
  const [interiorColor, setInteriorColor] = useState('#2b2b2b')

  // dynamic selected map: key -> itemId | null
  const initialSelected = useMemo(() => {
    const map: Record<string, string | null> = {}
    PART_SECTIONS.forEach(sec => {
      map[sec.key] = null
    })
    return map
  }, [])

  const [selectedParts, setSelectedParts] =
    useState<Record<string, string | null>>(initialSelected)

  // helper setter
  const setSelected = (sectionKey: string, itemId: string) => {
    setSelectedParts(s => ({
      ...s,
      [sectionKey]: s[sectionKey] === itemId ? null : itemId
    }))
  }

  const car = CAR_DATABASE.find(c => c.id === Number(params.id))

  const handleProceed = () => {
    // send selectedParts as JSON in query param
    const payload = {
      exteriorColor,
      interiorColor,
      parts: selectedParts,
      carId: car?.id ?? null
    }
    const q = encodeURIComponent(JSON.stringify(payload))
    router.push(`/checkout?config=${q}`)
  }

  if (!car)
    return (
      <div className='min-h-screen flex items-center justify-center text-white bg-black'>
        <p className='animate-pulse'>Memuat Data Kendaraan...</p>
      </div>
    )

  /* ======= Preview helpers: pick specific part ids to drive visuals ======= */
  const selectedWheel = selectedParts['wheels']
  const selectedTire = selectedParts['tires']
  const selectedSpoiler = selectedParts['aerokit'] // use aerokit selection to render spoiler
  const selectedExhaust = selectedParts['exhaust']
  const selectedBrake = selectedParts['brakes'] // e.g. 'brake_ceramic' -> visual red hub

  /* small utility for spoke count / style based on id */
  const wheelVariantFromId = (id: string | null) => {
    if (!id) return 'default'
    if (id.includes('carbon')) return 'carbon'
    if (id.includes('track')) return 'track'
    if (id.includes('forged')) return 'forged'
    if (id.includes('wheel22')) return 'carbon'
    return 'default'
  }

  const tireVariantFromId = (id: string | null) => {
    if (!id) return 'default'
    if (id.includes('sport')) return 'sport'
    if (id.includes('track')) return 'track'
    return 'default'
  }

  return (
    <div className='min-h-screen bg-neutral-950 text-white pt-24'>
      <div className='flex flex-col lg:flex-row'>
        {/* PREVIEW AREA */}
        <div className='lg:w-3/4 relative bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden'>
          {/* subtle grid background */}
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              opacity: 0.12,
              backgroundImage:
                'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg,#222 1px,transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <Link
            href='/showroom'
            className='absolute top-8 left-8 z-10 flex items-center text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white'
          >
            <ArrowLeft size={16} className='mr-2' /> Back to Collection
          </Link>

          <div className='relative w-full max-w-4xl z-10'>
            {/* CAR SVG */}
            <svg
              viewBox='0 0 400 150'
              className='w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)]'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='bodyShine'
                  x1='0%'
                  y1='0%'
                  x2='0%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='white' stopOpacity='0.5' />
                  <stop offset='40%' stopColor='white' stopOpacity='0.1' />
                  <stop offset='100%' stopColor='black' stopOpacity='0.4' />
                </linearGradient>
              </defs>

              {/* shadow */}
              <ellipse
                cx='200'
                cy='135'
                rx='180'
                ry='10'
                fill='black'
                style={{ filter: 'blur(8px)', opacity: 0.6 }}
              />

              {/* car body */}
              <path
                d='M40,115 L70,115 L80,130 L120,130 L130,115 L270,115 L280,130 L320,130 L330,115 L390,105 C400,95 390,75 350,65 L290,45 L130,45 L70,65 C30,75 20,95 40,115 Z'
                fill={exteriorColor}
              />

              {/* reflection */}
              <path
                d='M40,115 L390,105 C400,95 390,75 350,65 L290,45 L130,45 L70,65 C30,75 20,95 40,115 Z'
                fill='url(#bodyShine)'
                style={{ mixBlendMode: 'overlay' }}
              />

              {/* windows/interior fill */}
              <path
                d='M100,65 L260,65 L300,80 L140,80 Z'
                fill={interiorColor}
                opacity={0.12}
              />

              {/* Spoiler visual (if aerokit selection not 'aero_stock') */}
              {selectedSpoiler && selectedSpoiler !== 'aero_stock' && (
                <rect
                  x='246'
                  y='55'
                  width='110'
                  height={selectedSpoiler.includes('gt') ? 6 : 4}
                  rx='1'
                  fill={
                    selectedSpoiler.includes('aero_sport') ? '#0b0b0b' : '#111'
                  }
                />
              )}

              {/* left wheel group */}
              <g>
                <circle cx='100' cy='115' r='23' fill='#111' stroke='#333' />
                <circle
                  cx='100'
                  cy='115'
                  r='18'
                  fill='transparent'
                  stroke='#555'
                  strokeDasharray={
                    tireVariantFromId(selectedTire) === 'track' ? '0' : '4 2'
                  }
                />
                {/* hub */}
                <circle
                  cx='100'
                  cy='115'
                  r='8'
                  fill={
                    selectedBrake === 'brake_ceramic' ||
                    selectedBrake === 'brake_ceramic'
                      ? '#e11d1d'
                      : '#111'
                  }
                  stroke='#333'
                />
                {/* spokes dynamic */}
                {(() => {
                  const variant = wheelVariantFromId(selectedWheel)
                  const spokeCount =
                    variant === 'carbon' ? 10 : variant === 'track' ? 6 : 8
                  const spokeColor = variant === 'carbon' ? '#cfcfcf' : '#888'
                  const spokes = []
                  for (let i = 0; i < spokeCount; i++) {
                    spokes.push(
                      <line
                        key={`lw-${i}`}
                        x1={100}
                        y1={115}
                        x2={100}
                        y2={95}
                        stroke={spokeColor}
                        strokeWidth={1.2}
                        strokeLinecap='round'
                        transform={`rotate(${(i * 360) / spokeCount} 100 115)`}
                      />
                    )
                  }
                  return <g>{spokes}</g>
                })()}
              </g>

              {/* right wheel group (translated) */}
              <g transform='translate(200,0)'>
                <circle cx='100' cy='115' r='23' fill='#111' stroke='#333' />
                <circle
                  cx='100'
                  cy='115'
                  r='18'
                  fill='transparent'
                  stroke='#555'
                  strokeDasharray={
                    tireVariantFromId(selectedTire) === 'track' ? '0' : '4 2'
                  }
                />
                <circle
                  cx='100'
                  cy='115'
                  r='8'
                  fill={selectedBrake === 'brake_ceramic' ? '#e11d1d' : '#111'}
                  stroke='#333'
                />
                {(() => {
                  const variant = wheelVariantFromId(selectedWheel)
                  const spokeCount =
                    variant === 'carbon' ? 10 : variant === 'track' ? 6 : 8
                  const spokeColor = variant === 'carbon' ? '#cfcfcf' : '#888'
                  const spokes = []
                  for (let i = 0; i < spokeCount; i++) {
                    spokes.push(
                      <line
                        key={`rw-${i}`}
                        x1={100}
                        y1={115}
                        x2={100}
                        y2={95}
                        stroke={spokeColor}
                        strokeWidth={1.2}
                        strokeLinecap='round'
                        transform={`rotate(${(i * 360) / spokeCount} 100 115)`}
                      />
                    )
                  }
                  return <g>{spokes}</g>
                })()}
              </g>

              {/* exhaust visual (rear) */}
              {selectedExhaust && selectedExhaust !== 'exhaust_stock' ? (
                selectedExhaust.includes('sport') ? (
                  <g>
                    <rect
                      x='334'
                      y='98'
                      width='14'
                      height='7'
                      rx='2'
                      fill='#1f1f1f'
                      stroke='#ccc'
                      strokeWidth='0.8'
                    />
                    <rect
                      x='320'
                      y='98'
                      width='6'
                      height='6'
                      rx='1'
                      fill='#111'
                    />
                  </g>
                ) : (
                  <g>
                    <rect
                      x='328'
                      y='96'
                      width='20'
                      height='8'
                      rx='2'
                      fill='#000'
                      stroke='#999'
                      strokeWidth='1'
                    />
                  </g>
                )
              ) : (
                <g>
                  <rect
                    x='338'
                    y='100'
                    width='8'
                    height='6'
                    rx='1'
                    fill='#333'
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className='lg:w-1/4 bg-[#0a0a0a] border-l border-white/10 flex flex-col h-full z-20 shadow-xl'>
          <div className='p-8 border-b border-white/10'>
            <h1 className='text-3xl font-serif uppercase'>{car.name}</h1>
            <p className='text-gray-400 text-sm mt-2'>{car.price}</p>
          </div>

          <div className='flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide'>
            <div>
              <h4 className='text-xs uppercase text-white/60 mb-2'>
                Exterior Color
              </h4>
              <AdvancedColorPicker
                color={exteriorColor}
                onChange={setExteriorColor}
              />
            </div>

            <div>
              <h4 className='text-xs uppercase text-white/60 mb-2'>
                Interior Color
              </h4>
              <input
                type='color'
                value={interiorColor}
                onChange={e => setInteriorColor(e.target.value)}
                className='w-12 h-12 border border-white/20'
              />
            </div>

            <div>
              <h4 className='text-xs uppercase text-white/60 mb-2'>
                Quick Actions
              </h4>
              <div className='flex items-center gap-3'>
                <input
                  id='ceramic_quick'
                  type='checkbox'
                  checked={selectedParts['brakes'] === 'brake_ceramic'}
                  onChange={() =>
                    setSelected(
                      'brakes',
                      selectedParts['brakes'] === 'brake_ceramic'
                        ? ''
                        : 'brake_ceramic'
                    )
                  }
                />
                <label htmlFor='ceramic_quick' className='text-sm'>
                  Ceramic Brakes
                </label>
              </div>
            </div>
          </div>

          <div className='p-6 border-t border-white/10'>
            <button
              onClick={handleProceed}
              className='w-full bg-white text-black py-4 font-bold uppercase hover:bg-gray-200'
            >
              Confirm Spec <ShoppingBag className='inline ml-2' size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* PART SECTIONS - dynamically generated */}
      <div className='max-w-6xl mx-auto'>
        {PART_SECTIONS.map(section => (
          <PartSelectionSection
            key={section.key}
            title={section.title}
            options={section.items}
            selected={selectedParts[section.key] ?? null}
            onSelect={id => setSelected(section.key, id)}
          />
        ))}
      </div>

      <Footer />
    </div>
  )
}
