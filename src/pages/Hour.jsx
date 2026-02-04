import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) return
    setLoading(true)
    setError(null)
    fetch(`/api/hour/${encodeURIComponent(name)}?lang=la`)
      .then(r => r.json())
      .then(data => {
        setContent(data.content)
      })
      .catch(err => setError(err.message || 'fetch error'))
      .finally(() => setLoading(false))
  }, [name])

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
          {loading && <p>Loading…</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && content && (
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
          )}
          {!loading && !error && !content && (
            hour_body(name)
          )}
        </section>

        {showFr && (
          <section className="card french-page" style={{ marginTop: 16 }}>
            <h2>Français</h2>
            <FrenchColumn name={name} />
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

function hour_body(hour) {
  switch (hour) {
    case 'Sexte':
      return (
          <div className="hour-text">
            <p><Verses content={initial_verset} /></p>
            <p><Verses content={hymne_sexte} /></p>
            <p>{ant_sexte_dom}</p>
            <p><Verses content={psaumes[Dom_sexte.Ps1]} /></p>
            <p><Verses content={psaumes[Dom_sexte.Ps2]} /></p>
            <p><Verses content={psaumes[Dom_sexte.Ps3]} /></p>
            <p>{ant_sexte_dom}</p>
            <p>{Dom_sexte.capit}</p>
            <p>{Dom_sexte.vers}</p>
            <p>{kyrie}</p>
            <p>{pater_silent}</p>
            <p>{dominus_vobiscum}</p>
            <p>{oratio}</p>
            <p>{dominus_vobiscum}</p>
            <p>{benedicamus}</p>
            <p>{fidelium_animae}</p>
            <p><Verses content={divinum} /></p>
          </div> 
      ) 
          break;
      
        default:
          return (
          <p>Texte de l'heure pour <strong>{hour}</strong>.</p>
          )
          break;
  }
}

function hour_body_french(hour) {
  switch (hour) {
    case 'Sexte':
      return (
        <div className="hour-text">
          <p>{initial_verset_fr}</p>
          <p>{hymne_sexte_fr}</p>
          <p>{ant_sexte_dom_fr}</p>
          <p>{psaumes_fr[Dom_sexte_fr.Ps1]}</p>
          <p>{psaumes_fr[Dom_sexte_fr.Ps2]}</p>
          <p>{psaumes_fr[Dom_sexte_fr.Ps3]}</p>
          <p>{ant_sexte_dom_fr}</p>
          <p>{Dom_sexte_fr.capit}</p>
          <p>{Dom_sexte_fr.vers}</p>
          <p>{kyrie_fr}</p>
          <p>{pater_silent_fr}</p>
          <p>{dominus_vobiscum_fr}</p>
          <p>{oratio_fr}</p>
          <p>{dominus_vobiscum_fr}</p>
          <p>{benedicamus_fr}</p>
          <p>{fidelium_animae_fr}</p>
          <p>{divinum_fr}</p>
        </div>
      )
    default:
      return (
        <p>Texte français de l'heure pour <strong>{hour}</strong>.</p>
      )
  }
}
