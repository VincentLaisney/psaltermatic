import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
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
  const date = React.useContext(HourContext)
  const [showFr, setShowFr] = useState(() => {
    try {
      const v = localStorage.getItem('psaltermatic.showFr');
      return v === null ? true : v === '1';
    } catch {
      return true;
    }
  })

  const [showLa, setShowLa] = useState(() => {
    try {
      const v = localStorage.getItem('psaltermatic.showLa');
      return v === null ? true : v === '1';
    } catch {
      return true;
    }
  })

  const hourRef = useRef(null)

  function downloadPdf() {
    const dateNode = document.getElementById('print-date-section')
    const hourNode = hourRef.current
    if (!dateNode || !hourNode) return

    const doc = new jsPDF('portrait', 'mm', 'a4')
    const margin = 16
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxLineWidth = pageWidth - margin * 2
    const lineHeight = 5

    doc.setFont('Times', 'Roman')

    let y = margin

    const addText = (text, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize)
      if (isBold) doc.setFont('Times', 'Bold')
      else doc.setFont('Times', 'Roman')

      const cleanedText = text.replace(/\n\s*\n/g, '\n').trim()
      const lines = doc.splitTextToSize(cleanedText, maxLineWidth)
      lines.forEach(line => {
        if (y > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(line, margin, y)
        y += lineHeight
      })
    }

    // Add date section
    addText(dateNode.innerText.trim())
    y += lineHeight // extra space after date

    // Add hour sections
    const sections = hourNode.querySelectorAll('section.card')
    sections.forEach(section => {
      const h2 = section.querySelector('h2')
      if (h2) {
        addText(h2.innerText.trim(), 14, true)
        y += lineHeight // space after heading
      }
      const contentDiv = section.querySelector('.hour-text')
      if (contentDiv) {
        addText(contentDiv.innerText.trim())
        y += lineHeight * 2 // extra space between sections
      }
    })

    const safeHour = name ? name.replace(/[^a-z0-9]+/gi, '_').toLowerCase() : 'hour'
    const filename = `${date.toISOString().split('T')[0]}_${safeHour}.pdf`
    doc.save(filename)
  }

  useEffect(() => {
    try { localStorage.setItem('psaltermatic.showFr', showFr ? '1' : '0'); } catch (_error) { void _error; }
  }, [showFr]);

  useEffect(() => {
    try { localStorage.setItem('psaltermatic.showLa', showLa ? '1' : '0'); } catch (_error) { void _error; }
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
          onClick={downloadPdf}
          title="Télécharger la page en PDF"
        >
          Générer PDF
        </button>

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

      <div ref={hourRef} className="hour-columns" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
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