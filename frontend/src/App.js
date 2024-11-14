import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import logo from './styles/LearningSiteLogo.webp';
import Dashboard from './pages/dashboard.js';
import './styles/darkmode.css';


// PrivateRoute: Schützt die Routen
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Token aus localStorage abrufen
  return token ? children : <Navigate to="/login" />; // Leitet zur Login-Seite weiter, wenn kein Token vorhanden ist
};



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
              {/* Öffentliche Route: Login */}
              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              {/* Geschützte Route: Dashboard */}
              <Route
                  path="/dashboard"
                  element={
                      <PrivateRoute>
                          <Dashboard />
                      </PrivateRoute>
                  }
              />



              {/* Standard-Weiterleitung bei unbekannten Routen
              <Route path="*" element={<Navigate to="/login" />} /> */}
          </Routes>
      </Router>
  
      </main>
    </div>
  
  );
};

export default App;
