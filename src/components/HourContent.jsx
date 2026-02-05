import React, { useEffect, useState } from 'react'
import { HourContext } from '../App.jsx'
import axios from 'axios'

function HourContent({ hour, lang }) {
    const {date} = React.useContext(HourContext);
    const [content, setContent] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const day_to_feria = {
        0: 'Dom',
        1: 'F2',
        2: 'F3',
        3: 'F4',
        4: 'F5',
        5: 'F6',
        6: 'Sab'
    }

    const hour_abbr = {
        'Matines-Laudes': 'mat_laud',
        'Matines': 'mat',
        'Laudes': 'laud',
        'Tierce': 'tier',
        'Sexte': 'sext',
        'None': 'non',
        'Vêpres': 'vep',
        'Complies': 'comp'
    }

    const key = `${day_to_feria[date.getDay()]}_${hour_abbr[hour]}`
    
    useEffect(() => {
    if (!hour) return
    setLoading(true)
    setError(null)
    axios.get(`/api/hour/${encodeURIComponent(key)}?lang=la`)
        .then(response => {
            setContent(response.data.content)
      })
      .catch(err => setError(err.message || 'fetch error'))
      .finally(() => setLoading(false))
    }, [hour, lang])

    if (loading) return <p>Loading…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!content) return hour_body_french(hour)



    return (
        <div className="hour-text">
            <p>{content.initial_verset || ''}</p>
            <p>{content.hymne || ''}</p>
            <p>{content.antiphon || ''}</p>
            {Array.isArray(content.psaumes) && content.psaumes.map(p => <p key={p}>{p}</p>)}
            <p>{content.capit || ''}</p>
            <p>{content.vers || ''}</p>
            <p>{content.kyrie || ''}</p>
            <p>{content.pater_silent || ''}</p>
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

export default HourContent;
