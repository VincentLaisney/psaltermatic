import React, { useEffect, useState } from 'react'
import { HourContext } from '../pages/Hour.jsx'
import Verses, { PsalmsWithSchema, TextWithRef } from './Verses.jsx'
import api from '../services/api'

function HourContent({ hour, lang, liturgy }) {
    const date = React.useContext(HourContext);
    // console.log(`HourContent: fetching content for hour ${hour}, lang ${lang}, date ${date}`);
    const [content, setContent] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    useEffect(() => {
    if (!hour) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    switch (hour) {
        case 'Matines-Laudes':
            return (
                <div className="hour-text">
                    <p>{content.initial_verset || ''}</p>
                    <p>{content.hymn || ''}</p>
                </div>
            );
        case 'Matines':
            switch (liturgy.matines) {
                case 'simple':
                    return (
                        <div className="hour-text">
                            <p>{content.initial_verset || ''}</p>
                            <p>{content.hymn || ''}</p>
                        </div>
                    );
                case '2noct':
                    return (
                        <div className="hour-text">
                            <p>{content.initial_verset || ''}</p>
                            <p>{content.hymn || ''}</p>
                        </div>
                    );
                case '3noct':
                    return (
                        <div className="hour-text">
                            <p>{content.initial_verset || ''}</p>
                            <p>{content.hymn || ''}</p>
                        </div>
                    );
            };
            break;
        case 'Laudes':
             return (
                <div className="hour-text">
                    <p><Verses content={content.initial_verset || ''} /></p>
                    <PsalmsWithSchema content={content} 
                    defaultSchema={'ant1_ps1_ant1_ant2_ps2_ant2_ant3_cant_ant3_ant4_ps4_ant4'} />
                    <p><Verses content={content.capit || ''} /></p>
                    <p><Verses content={content.respons || ''} /></p>
                    <p><Verses content={content.hymn || ''} /></p>
                    <p><Verses content={content.verset || ''} /></p>
                    <p><Verses content={content.benedictus || ''} /></p>
                    <p><Verses content={content.cant_benedictus || ''} /></p>
                    <p><Verses content={content.benedictus || ''} /></p>
                    <p><Verses content={content.kyrie || ''} /></p>
                    <p><Verses content={content.pater || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.oratio || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.benedicamus || ''} /></p>
                    <p><Verses content={content.fidelium_animae || ''} /></p>
                    <p><Verses content={content.divinum || ''} /></p>
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
                    <p><Verses content={content.ps4 || ''} /></p>
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
                    <p><Verses content={content.initial_verset || ''} /></p>
                    <PsalmsWithSchema content={content} />
                    <p><Verses content={content.capit || ''} /></p>
                    <p><Verses content={content.respons || ''} /></p>
                    <p><Verses content={content.hymn || ''} /></p>
                    <p><Verses content={content.verset || ''} /></p>
                    <p><Verses content={content.magnificat || ''} /></p>
                    <p><Verses content={content.cant_magnificat || ''} /></p>
                    <p><Verses content={content.magnificat || ''} /></p>
                    <p><Verses content={content.kyrie || ''} /></p>
                    <p><Verses content={content.pater || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.oratio || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.benedicamus || ''} /></p>
                    <p><Verses content={content.fidelium_animae || ''} /></p>
                    <p><Verses content={content.divinum || ''} /></p>
              </div>
            );
        case 'Complies':
            return (
                <div className="hour-text">
                    <p><Verses content={content.jube_domne || ''} /></p>
                    <p><Verses content={content.noctem_quietam || ''} /></p>
                    <p><Verses content={content.lect_complet || ''} /></p>
                    <p><Verses content={content.adjutorium || ''} /></p>
                    <p><Verses content={content.conftiteor || ''} /></p>
                    <p><Verses content={content.misereatur || ''} /></p>
                    <p><Verses content={content.indulgentiam || ''} /></p>
                    <p><Verses content={content.convertere || ''} /></p>
                    <p><Verses content={content.initial_verset || ''} /></p>
                    <p><Verses content={content.ps1 || ''} /></p>
                    <p><Verses content={content.ps2 || ''} /></p>
                    <p><Verses content={content.ps3 || ''} /></p>
                    <p><Verses content={content.hymn || ''} /></p>
                    <p><Verses content={content.capit || ''} /></p>
                    <p><Verses content={content.verset || ''} /></p>
                    <p><Verses content={content.kyrie || ''} /></p>
                    <p><Verses content={content.pater_silent || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.oratio_complet || ''} /></p>
                    <p><Verses content={content.dominus || ''} /></p>
                    <p><Verses content={content.benedicamus || ''} /></p>
                    <p><Verses content={content.benedic_complet || ''} /></p>
                    <p><Verses content={content.maria_ant || ''} /></p>
                 </div>
            );
            case 'Messe':
                return (
                    <div className="hour-text">
                        <p><TextWithRef content={content.reading || ''} /></p>
                        <p><TextWithRef content={content.reading_2 || ''} /></p>
                        <p><TextWithRef content={content.gospel || ''} /></p>
                    </div>
                );
        default:
            return (
                <p>Texte de l'heure pour <strong>{hour}</strong>.</p>
            )
    }
}


export default HourContent;
