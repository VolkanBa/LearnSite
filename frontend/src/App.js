import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import logo from './styles/LearningSiteLogo.webp';
import Dashboard from "./pages/dashboard";
import './styles/darkmode.css'

const App = () => {
  return (
    <div>
     <header className="header">
      <img src={logo} alt="Logo" />
      <h1>LearnSite</h1>
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </nav>
    </header>

      <main>
  
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  
      </main>
    </div>
  
  );
};

export default App;
