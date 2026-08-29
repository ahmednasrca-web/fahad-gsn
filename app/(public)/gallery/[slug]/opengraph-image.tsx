import { ImageResponse } from 'next/og'
import { getPublishedWorkBySlug } from '@/lib/db/works'

export const runtime = 'edge'
export const alt = 'Fahad Gsn — Luxury Woodcraft'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = await getPublishedWorkBySlug(slug)

  const title = work?.titleAr ?? 'فهد غصن'
  const titleEn = work?.titleEn ?? 'FAHAD GSN'
  const price = work?.price ? `${work.price} د.ك` : 'أعمال خشبية فاخرة'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#2C1810',
          padding: '60px 80px',
          color: '#FAF7F2',
          fontFamily: 'sans-serif',
          border: '16px solid #3D2316',
        }}
      >
        {/* Top Header / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#C4854A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2C1810',
                fontWeight: 'bold',
                fontSize: '28px',
              }}
            >
              🪵
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#FAF7F2' }}>
                فهد غصن
              </span>
              <span style={{ fontSize: '14px', color: '#C4854A', letterSpacing: '3px' }}>
                FAHAD GSN — HANDCRAFTED
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: '#3D2316',
              border: '2px solid #C4854A',
              color: '#D4B896',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            {price}
          </div>
        </div>

        {/* Center Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: '16px',
              color: '#FFFFFF',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#D4B896',
              letterSpacing: '1px',
            }}
          >
            {titleEn}
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #3D2316',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: '18px', color: '#A09080' }}>
            fahadgsn.com
          </span>
          <span style={{ fontSize: '18px', color: '#C4854A', fontWeight: '600' }}>
            أعمال خشبية يدوية فاخرة — الكويت
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
