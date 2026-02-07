import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr);
setDefaultLocale('fr');

import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react'
import api from '../services/api'

export default function Header({ title, subtitle, date }){
  const { currentDate, setCurrentDate } = date;
  const [cookieStatus, setCookieStatus] = useState(null)
  const [keyStatus, setKeyStatus] = useState(null)

  async function setCookie() {
    try {
      const r = await api.get('/set-cookie')
      setCookieStatus('ok')
    } catch (e) {
      setCookieStatus('error')
    }
  }

  function saveKey() { setKeyStatus('disabled') }
  function clearKey() { setKeyStatus('disabled') }

  return (
    <header className="card header" role="banner">
      <div>
        <h1 className="title">{title}</h1>
        <h2 className="subtitle">{subtitle}</h2>
      </div>
      <div style={{textAlign: 'right' }}>
        <div style={{ marginBottom: 6 }}> Date : <DatePicker style={{ width: 50}} dateFormat={["P", "P"]}
          selected={currentDate} onChange={(date) => setCurrentDate(date)} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="toggle-btn" onClick={setCookie}>Set test cookie</button>
          {cookieStatus === 'ok' && <span style={{ color: 'green' }}>Cookie set</span>}
          {cookieStatus === 'error' && <span style={{ color: 'red' }}>Error</span>}
          <span style={{ marginLeft: 8, color: '#64748b' }}>Using fixed build-time API key (not editable)</span>
          {keyStatus === 'disabled' && <span style={{ marginLeft: 8, color: 'gray' }}> (disabled)</span>}
        </div>
      </div>
    </header>
  )
}
