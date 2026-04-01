import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FONT_KEY = 'psaltermatic:hourFont'
const FONT_SIZE_KEY = 'psaltermatic:hourFontSize'

const AVAILABLE_FONTS = [
  { label: 'System sans (default)', value: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' },
  { label: 'Serif (Georgia)', value: 'Georgia, "Times New Roman", Times, serif' },
  { label: 'Merriweather', value: 'Merriweather, Georgia, serif' },
  { label: 'Roboto Slab', value: 'Roboto Slab, Georgia, serif' },
  { label: 'Noto Serif', value: 'Noto Serif, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
]

const AVAILABLE_FONT_SIZES = [
  { label: 'Petit (14px)', value: '14px' },
  { label: 'Normal (16px)', value: '16px' },
  { label: 'Moyen (18px)', value: '18px' },
  { label: 'Grand (20px)', value: '20px' },
  { label: 'Très grand (24px)', value: '24px' },
]

export default function Settings() {
  const [font, setFont] = useState(() => {
    try {
      return localStorage.getItem(FONT_KEY) || AVAILABLE_FONTS[0].value
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return AVAILABLE_FONTS[0].value
    }
  })

  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem(FONT_SIZE_KEY) || AVAILABLE_FONT_SIZES[1].value // Default to 16px (Normal)
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return AVAILABLE_FONT_SIZES[1].value
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, font)
      localStorage.setItem(FONT_SIZE_KEY, fontSize)
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // ignore
    }
    document.documentElement.style.setProperty('--hour-font', font)
    document.documentElement.style.setProperty('--hour-font-size', fontSize)
  }, [font, fontSize])

  return (
    <main style={{ padding: 16 }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: 16, color: 'var(--accent)', textDecoration: 'none' }}>
        ← Retour à l'accueil
      </Link>

      <section className="card" style={{ marginTop: 16 }}>
        <h1>Préférences</h1>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Police pour le texte des heures</label>
          <select value={font} onChange={e => setFont(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            {AVAILABLE_FONTS.map(f => (
              <option key={f.label} value={f.value}>{f.label}</option>
            ))}
          </select>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Taille de police pour le texte des heures</label>
            <select value={fontSize} onChange={e => setFontSize(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
              {AVAILABLE_FONT_SIZES.map(fs => (
                <option key={fs.label} value={fs.value}>{fs.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="card" style={{ padding: 12 }}>
              <p style={{ margin: 0, fontFamily: font, fontSize: fontSize }}>Aperçu : Pater noster, qui est in cælis, sanctificétur nomen tuum.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
