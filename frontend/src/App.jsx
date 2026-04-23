
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/welcome";
import Signup from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;