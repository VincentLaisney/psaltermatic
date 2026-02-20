import React, { useState, useEffect } from 'react'
import './index.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HourProvider from './pages/Hour'
import Settings from './pages/Settings'
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
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/*" element={
          <main className="app">
            <Header date={{currentDate, setCurrentDate}} />

            <section className="card" style={{ marginTop: 16 }}>
              <p style={{ fontWeight: 'bold', textAlign: 'center'}}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{ fontStyle: 'italic'}}>{liturgy.asText}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <nav className="menu">
                  {hours.map((h, i) => (
                    <React.Fragment key={i}>
                      <Tiret key1={`tiret-${i}`} value={h} />
                      <Link to={`/hour/${encodeURIComponent(h)}`} className="menu-item" style={{display:'inline-block', marginRight:8}}>
                        {h}
                      </Link>
                    </React.Fragment>
                  ))}
                </nav>

                <Link to="/settings" className="menu-item" title="Préférences" style={{ marginLeft: 16, textDecoration: 'none' }}>
                  <span style={{ fontSize: 18 }}>⚙️</span>
                </Link>
              </div>
            </section>

            <Routes>
              <Route path="hour/:hour" element={<HourProvider date={currentDate} liturgy={liturgy}/>} />
              <Route path="" element={null} />
            </Routes>
          </main>
        } />
      </Routes>
    </Router>
  )
}

function Tiret({key1, value }) {
  return <span key={key1} style={{ fontWeight: 'bold', marginRight: 4 }}>
 {((value === 'Messe')  ? '— ' : '')}
  </span>
}

function is_thursday(date) {
  return date.getDay() === 4;
}

export default App