import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/home";
import DonorRegistration from "./pages/DonorRegistration";
import RecipientRegistration from "./pages/RecipentRegistration";
import MatchedRecordsTable from "./pages/matchedRecords";
import TransplantedRecordsTable from "./pages/transplantedRecords";
import { initContracts } from "./contract";

function App() {
  // const [authorized, setAuthorized] = useState(null); // null = loading

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const result = await initContracts();
  //     setAuthorized(result);
  //   };
  //   checkAuth();
  // }, []);

  // if (authorized === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!authorized) {
  //   return null; // or display a full-screen error component
  // }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/donor-registration" element={<DonorRegistration />} />
      <Route path="/recipient-registration" element={<RecipientRegistration />} />
      <Route path="/getMatchedRecords" element={<MatchedRecordsTable />} />
      <Route path="/getTransplantedRecords" element={<TransplantedRecordsTable />} />
    </Routes>
  );
}

export default App;
