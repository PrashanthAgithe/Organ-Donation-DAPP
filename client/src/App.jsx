import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/home"
import DonorRegistration from "./pages/DonorRegistration"
import RecipientRegistration from "./pages/RecipentRegistration"


function App() {

  return (
    <Routes>
      <Route path="/home" element={<LandingPage />}></Route>
      <Route path="/donor-registration" element={<DonorRegistration />}></Route>
      <Route path="/recipient-registration" element={<RecipientRegistration />}></Route>
    </Routes>
  )
}

export default App
