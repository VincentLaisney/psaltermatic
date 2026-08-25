import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
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

  async function downloadPdf() {
    const dateNode = document.getElementById('print-date-section')
    const hourNode = hourRef.current
    if (!dateNode || !hourNode) return

    const wrapper = document.createElement('div')
    wrapper.style.position = 'absolute'
    wrapper.style.top = '-9999px'
    wrapper.style.left = '-9999px'
    wrapper.style.width = '210mm'
    wrapper.style.background = '#ffffff'
    wrapper.style.padding = '16px'
    wrapper.style.boxSizing = 'border-box'
    wrapper.style.color = '#000000'
    wrapper.style.fontFamily = 'sans-serif'

    const dateClone = dateNode.cloneNode(true)
    dateClone.removeAttribute('id')
    wrapper.appendChild(dateClone)
    wrapper.appendChild(hourNode.cloneNode(true))
    document.body.appendChild(wrapper)

    const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    document.body.removeChild(wrapper)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    const pageHeight = pdf.internal.pageSize.getHeight()
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
    let heightLeft = pdfHeight - pageHeight
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight
    }

    const safeHour = name ? name.replace(/[^a-z0-9]+/gi, '_').toLowerCase() : 'hour'
    const filename = `${date.toISOString().split('T')[0]}_${safeHour}.pdf`
    pdf.save(filename)
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