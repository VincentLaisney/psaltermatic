import React, { useState, useEffect } from 'react'
import './index.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HourProvider from './pages/Hour'
import { getLiturgy } from './services/hours-content'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [liturgy, SetLiturgy] = useState({asText: ''});
  // const today = useMemo(() => {
  //   const d = new Date()
  //   return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  // }, [])

  const hours = [(is_thursday(currentDate) ? 'Matines-Laudes' : null), 'Matines', 'Laudes', 'Tierce', 'Sexte', 'None', 'Vêpres', 'Complies', 'Messe']

  useEffect(() => {
    getLiturgy(currentDate, SetLiturgy);
  }, [currentDate])

  return (
    <Router>
      <main className="app">
        <Header date={{currentDate, setCurrentDate}} />

        <section className="card" style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 'bold', textAlign: 'center'}}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style={{ fontStyle: 'italic'}}>{liturgy.asText}</p>
          <nav className="menu">
            {hours.map((h) => (
              <>
                {((h === 'Messe')  ? '— ' : null)}
                <Link key={h} to={`/hour/${encodeURIComponent(h)}`} className="menu-item" style={{display:'inline-block', marginRight:8}}>
                  {h}
                </Link>
              </>
            ))}
          </nav>
        </section>

        <Routes>
          <Route path="/hour/:hour" element={<HourProvider date={currentDate}/>} />
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