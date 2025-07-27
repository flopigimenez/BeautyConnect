import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Landing from './pages/Landing'
// import PendienteAprobacion from './pages/PendienteAprobacion'
import Calificaciones from './pages/Calificaciones'
import '../styles.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Landing /> */}
    {/* <PendienteAprobacion /> */}
    <Calificaciones />
  </StrictMode>,
)
