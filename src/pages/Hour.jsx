import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import HourContent from '../components/HourContent.jsx'

const HourContext = React.createContext();

export default function HourProvider({date, liturgy}) {
  const { hour } = useParams()
  // console.log(`HourProvider: rendering hour ${hour} for date ${date.toISOString()}`);
  return (
    <HourContext.Provider value={date}>
      <Hour hour={hour} liturgy={liturgy} />
    </HourContext.Provider>
  );
}

function Hour({hour, liturgy}) {
  const name = hour ? decodeURIComponent(hour) : ''
  const [showFr, setShowFr] = useState(() => {
    try {
      const v = localStorage.getItem('psaltermatic.showFr');
      return v === null ? true : v === '1';
    } catch (e) {
      return true;
    }
  })

  const [showLa, setShowLa] = useState(() => {
    try {
      const v = localStorage.getItem('psaltermatic.showLa');
      return v === null ? true : v === '1';
    } catch (e) {
      return true;
    }
  })

  useEffect(() => {
    try { localStorage.setItem('psaltermatic.showFr', showFr ? '1' : '0'); } catch(e) {}
  }, [showFr]);

  useEffect(() => {
    try { localStorage.setItem('psaltermatic.showLa', showLa ? '1' : '0'); } catch(e) {}
  }, [showLa]);

  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      const tag = target && target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key === 'f' || e.key === 'F') {
        setShowFr(s => !s);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowLa(s => !s);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
        <button
          className="toggle-btn"
          aria-pressed={!showLa}
          onClick={() => setShowLa(s => !s)}
          title="Raccourci: L"
        >
          {showLa ? 'Masquer le Latin' : 'Afficher le Latin'}
        </button>

        <button
          className="toggle-btn"
          aria-pressed={!showFr}
          onClick={() => setShowFr(s => !s)}
          title="Raccourci: F"
        >
          {showFr ? 'Masquer le Français' : 'Afficher le Français'}
        </button>
      </div>

      <div className="hour-columns" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {showLa && (
          <section className="card hour-page" style={{ marginTop: 16 }}>
            <h2>{getLatinHourName(name)}</h2>

            <HourContent hour={name} lang={'la'} liturgy={liturgy} />
          
          </section>
        )}
        {showFr && (
          <section className="card french-page" style={{ marginTop: 16 }}>
            <h2>{name}</h2>

            <HourContent hour={name} lang={'fr'} liturgy={liturgy}/>
            {/* <FrenchColumn name={name} /> */}
            
          </section>
        )}
      </div>
    </div>
  )
}

function getLatinHourName(name) {
  switch (name) {
    case 'Matines-Laudes':
      return 'Ad Matutinum et Laudes';
    case 'Matines':
      return 'Ad Matutinum';
    case 'Laudes':
      return 'Ad Laudes';
    case 'Tierce':
      return 'Ad Tertiam';
    case 'Sexte':
      return 'Ad Sextam';
    case 'None':
      return 'Ad Nonam';
    case 'Vêpres':
      return 'Ad Vesperas';
    case 'Complies':
      return 'Ad Completorium';
    case 'Messe':
      return 'Ad Missam';
    default:
      return name;
  }
}

export { HourContext };