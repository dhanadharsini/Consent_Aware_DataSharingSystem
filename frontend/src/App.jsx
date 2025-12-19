import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HospitalDashboard from "./pages/HospitalDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/hospital"
          element={
            <ProtectedRoute role="hospital">
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
