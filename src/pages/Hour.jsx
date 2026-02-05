import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HourContent from '../components/HourContent.jsx'
import  Verses  from '../components/Verses.jsx'
import { initial_verset, hymne_sexte, ant_sexte_dom, Dom_sexte,
kyrie, pater_silent, dominus_vobiscum, oratio, benedicamus,
fidelium_animae, divinum, psaumes } from '../data/donnees.jsx'
import { initial_verset_fr, hymne_sexte_fr, ant_sexte_dom_fr, Dom_sexte_fr,
  kyrie_fr, pater_silent_fr, dominus_vobiscum_fr, oratio_fr, benedicamus_fr,
  fidelium_animae_fr, divinum_fr, psaumes_fr } from '../data/donnees_fr.jsx'


export default function Hour() {
  const { hour } = useParams()
  const name = hour ? decodeURIComponent(hour) : ''
  const [showFr, setShowFr] = useState(true)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          className="toggle-btn"
          aria-pressed={!showFr}
          onClick={() => setShowFr(s => !s)}
        >
          {showFr ? 'Masquer le Français' : 'Afficher le Français'}
        </button>
      </div>

      <div className="hour-columns" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <section className="card hour-page" style={{ marginTop: 16 }}>
          <h2>{name}</h2>

          <HourContent hour={name} lang={'la'} />
        
        </section>

        {showFr && (
          <section className="card french-page" style={{ marginTop: 16 }}>
            <h2>Français</h2>

            <HourContent hour={name} lang={'fr'} />
            {/* <FrenchColumn name={name} /> */}
            
          </section>
        )}
      </div>
    </div>
  )
}

function FrenchColumn({ name }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) return
    setLoading(true)
    setError(null)
    fetch(`/api/hour/${encodeURIComponent(name)}?lang=fr`)
      .then(r => r.json())
      .then(data => setContent(data.content))
      .catch(e => setError(e.message || 'fetch error'))
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!content) return hour_body_french(name)

  return (
    <div className="hour-text">
      <p>{content.initial_verset || ''}</p>
      <p>{content.hymne || ''}</p>
      <p>{content.antiphon || ''}</p>
      {Array.isArray(content.psaumes) && content.psaumes.map(p => <p key={p}>{p}</p>)}
      <p>{content.capit || ''}</p>
      <p>{content.vers || ''}</p>
      <p>{content.kyrie || ''}</p>
      <p>{content.pater || ''}</p>
      <p>{content.dominus || ''}</p>
      <p>{content.oratio || ''}</p>
      <p>{content.benedicamus || ''}</p>
      <p>{content.fidelium_animae || ''}</p>
      <p>{content.divinum || ''}</p>
    </div>
  )
}

