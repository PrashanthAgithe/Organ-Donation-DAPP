import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/home"
import DonorRegistration from "./pages/DonorRegistration"
import RecipientRegistration from "./pages/RecipentRegistration"
import MatchedRecordsTable from "./pages/matchedRecords"
import TransplantedRecordsTable from "./pages/transplantedRecords"


function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/donor-registration" element={<DonorRegistration />}></Route>
      <Route path="/recipient-registration" element={<RecipientRegistration />}></Route>
      <Route path="/getMatchedRecords" element={<MatchedRecordsTable />} />
      <Route path="/getTransplantedRecords" element={<TransplantedRecordsTable />}/>
    </Routes>
  )
}

export default App
