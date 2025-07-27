import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "../pages/Landing"
import Turnos from "../pages/Turnos"

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Turnos" element={<Turnos/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default RoutesApp