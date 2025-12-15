import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const registerHandler = async () => {
    try {
      await API.post("/users/register", { ...form, role });
      alert("Registration Successful!");
      navigate("/");
    } catch (err) {
      alert("Error during registration");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="patient">Patient</option>
        <option value="hospital">Hospital Authority</option>
      </select>

      <button onClick={registerHandler}>Register</button>
    </div>
  );
}

export default Register;
