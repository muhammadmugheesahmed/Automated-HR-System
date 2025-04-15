import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";         // Your existing home page component
import EmployeeLogin from "./pages/employee";
import EmployeeHome from "./pages/employeehome";
import Adminlogin from "./pages/admin";      // Your existing signup page component
import CandidateForm from "./pages/candidateform";
import { Flowbite } from "flowbite-react";
import AdminHome from "./pages/Adminhome";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee" element={<EmployeeLogin />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
        <Route path="/candidate-form" element={<CandidateForm />} />
        <Route path="/adminlogin" element={<Adminlogin/>} />
        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
