import { useParams } from 'react-router-dom'
import { useState } from 'react'
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
          {hour_body(name)}
        </section>

        {showFr && (
          <section className="card french-page" style={{ marginTop: 16 }}>
            <h2>Français</h2>
            {hour_body_french(name)}
          </section>
        )}
      </div>
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
