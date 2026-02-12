import React, { useEffect, useState } from 'react'
import { HourContext } from '../pages/Hour.jsx'
import Verses from './Verses.jsx'
import api from '../services/api'

function HourContent({ hour, lang }) {
    const date = React.useContext(HourContext);
    // console.log(`HourContent: fetching content for hour ${hour}, lang ${lang}, date ${date}`);
    const [content, setContent] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    useEffect(() => {
    if (!hour) return
    setLoading(true)
    setError(null)
    api.get(`/hour/${encodeURIComponent(hour)}`, {
        params: {
            date: date.toISOString().split('T')[0],
            lang: lang,
        }
    })
        .then(response => {
            setContent(response.data.content)
        //  console.log(`HourContent: fetched content for hour ${hour}, lang ${lang}:`, response.data.content);   
      })
      .catch(err => setError(err.message || 'fetch error'))
      .finally(() => setLoading(false))
    }, [hour, lang, date])

    if (loading) return <p>Loading…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!content) return hour_body_french(hour)

    switch (hour) {
        case 'Matines-Laudes':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        case 'Matines':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        case 'Laudes':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        case 'Tierce':
        case 'Sexte':
        case 'None':
            return (
                <div className="hour-text">
                    <p><Verses content={content.initial_verset || ''} /></p>
                    <p><Verses content={content.hymn || ''} /></p>
                    <p><Verses content={content.antiphon || ''} /></p>
                    <p><Verses content={content.ps1 || ''} /></p>
                    <p><Verses content={content.ps2 || ''} /></p>
                    <p><Verses content={content.ps3 || ''} /></p>
                    <p><Verses content={content.antiphon || ''} /></p>
                    <p><Verses content={content.capit || ''} /></p>
                    <p><Verses content={content.verset || ''} /></p>
                    <p><Verses content={content.kyrie || ''} /></p>
                    <p><Verses content={content.pater_silent || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.oratio || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.benedicamus || ''} /></p>
                    <p><Verses content={content.fidelium_animae || ''} /></p>
                    <p><Verses content={content.divinum || ''} /></p>
                </div>
            );
        case 'Vêpres':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        case 'Complies':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        default:
            return (
                <p>Texte de l'heure pour <strong>{hour}</strong>.</p>
            )
    }
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
          ;
      
        default:
          return (
          <p>Texte de l'heure pour <strong>{hour}</strong>.</p>
          )
          ;
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
