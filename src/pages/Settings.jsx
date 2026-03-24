import React, { useEffect, useState } from 'react'

const FONT_KEY = 'psaltermatic:hourFont'

const AVAILABLE_FONTS = [
  { label: 'System sans (default)', value: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' },
  { label: 'Serif (Georgia)', value: 'Georgia, "Times New Roman", Times, serif' },
  { label: 'Merriweather', value: 'Merriweather, Georgia, serif' },
  { label: 'Roboto Slab', value: 'Roboto Slab, Georgia, serif' },
  { label: 'Noto Serif', value: 'Noto Serif, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
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

  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, font)
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // ignore
    }
    document.documentElement.style.setProperty('--hour-font', font)
  }, [font])

  return (
    <main style={{ padding: 16 }}>
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
            <div className="card" style={{ padding: 12 }}>
              <p style={{ margin: 0, fontFamily: font }}>Aperçu : Pater noster, qui est in cælis, sanctificétur nomen tuum.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
