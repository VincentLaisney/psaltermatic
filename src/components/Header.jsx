import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr);
setDefaultLocale('fr');

import "react-datepicker/dist/react-datepicker.css";

export default function Header({ date }){
  const { currentDate, setCurrentDate } = date;
  const title = "Abbaye Saint Joseph de Clairval"
  const subtitle = "Psautier"

  return (
    <header className="card header" role="banner">
      <div>
        <h1 className="title">{title}</h1>
        <h2 className="subtitle">{subtitle}</h2>
      </div>
      <div style={{textAlign: 'right' }}>
        <div style={{ marginBottom: 6 }}> Date : <DatePicker style={{ width: 50}} dateFormat={["P", "P"]}
          selected={currentDate} onChange={(date) => setCurrentDate(date)} /></div>
      </div>
    </header>
  )
}
