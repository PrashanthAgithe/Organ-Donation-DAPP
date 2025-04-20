import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/home"
import DonorRegistration from "./pages/DonorRegistration"
import RecipientRegistration from "./pages/RecipentRegistration"
import MatchedRecordsTable from "./pages/matchedRecords"


function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/donor-registration" element={<DonorRegistration />}></Route>
      <Route path="/recipient-registration" element={<RecipientRegistration />}></Route>
      <Route path="/getMatchedRecords" element={<MatchedRecordsTable />} />
    </Routes>
  )
}

export default App
