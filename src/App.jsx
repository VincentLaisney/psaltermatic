import { useState } from 'react'
import './index.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Hour from './pages/Hour'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const today = useMemo(() => {
  //   const d = new Date()
  //   return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  // }, [])

  const hours = [(is_thursday(currentDate) ? 'Matines-Laudes' : null), 'Matines', 'Laudes', 'Tierce', 'Sexte', 'None', 'Vêpres', 'Complies']

  return (
    <Router>
      <main className="app">
        <Header title="Abbaye Saint Joseph de Clairval" subtitle="Psautier" date={{currentDate, setCurrentDate}} />

        <section className="card" style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 'bold', textAlign: 'center'}}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <nav className="menu">
            {hours.map(h => (
              <Link key={h} to={`/hour/${encodeURIComponent(h)}`} className="menu-item" style={{display:'inline-block', marginRight:8}}>
                {h}
              </Link>
            ))}
          </nav>
        </section>

        <Routes>
          <Route path="/hour/:hour" element={<Hour />} />
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
