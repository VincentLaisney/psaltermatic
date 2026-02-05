import React, { useState } from 'react'
import './index.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Hour from './pages/Hour'
import { getLiturgy } from './services/hours-content'

const HourContext = React.createContext();

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [liturgy, SetLiturgy] = useState({asText: ''});
  // const today = useMemo(() => {
  //   const d = new Date()
  //   return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  // }, [])

  const hours = [(is_thursday(currentDate) ? 'Matines-Laudes' : null), 'Matines', 'Laudes', 'Tierce', 'Sexte', 'None', 'Vêpres', 'Complies']
  getLiturgy(currentDate, SetLiturgy);

  return (
    <Router>
      <main className="app">
        <Header title="Abbaye Saint Joseph de Clairval" subtitle="Psautier" date={{currentDate, setCurrentDate}} />

        <section className="card" style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 'bold', textAlign: 'center'}}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style={{ fontStyle: 'italic'}}>{liturgy.asText}</p>
          <nav className="menu">
            {hours.map(h => (
              <Link key={h} to={`/hour/${encodeURIComponent(h)}`} className="menu-item" style={{display:'inline-block', marginRight:8}}>
                {h}
              </Link>
            ))}
          </nav>
        </section>

        <Routes>
          <Route path="/hour/:hour" element={<HourContext.Provider value={{ date: currentDate,
                                                                        liturgy: liturgy  
           }} >
                                                <Hour />
                                            </HourContext.Provider>} />
          <Route path="/" element={null} />
        </Routes>
      </main>
    </Router>
  )
}

function is_thursday(date) {
  return date.getDay() === 4;
}

export default App
export { HourContext };