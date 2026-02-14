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

          <HourContent hour={name} lang={'la'} liturgy={liturgy} />
        
        </section>

        {showFr && (
          <section className="card french-page" style={{ marginTop: 16 }}>
            <h2>Français</h2>

            <HourContent hour={name} lang={'fr'} liturgy={liturgy}/>
            {/* <FrenchColumn name={name} /> */}
            
          </section>
        )}
      </div>
    </div>
  )
}

export { HourContext };