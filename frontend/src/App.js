import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import logo from './styles/LearningSiteLogo.webp';
import Dashboard from './pages/dashboard.js';
import './styles/darkmode.css';
import { UserProvider } from './userContext.js'


const PrivateRoute = ({ children }) => {
   // Prüfen, ob das JWT-Token existiert
   const isAuthenticated = !!localStorage.getItem('authToken'); 
   return isAuthenticated ? children : <Navigate to="/login" />;
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

      <UserProvider> 
      <Router>
          <Routes>
              {/* Öffentliche Route: Login */}
              <Route path="/login" element={<Login />} />
             

              
              <Route path="/register" element={<Register />} />

              {/* Geschützte Route: Dashboard */}
            
                <Route
                  path="/dashboard"
                  element={
                  // <PrivateRoute>
                          <Dashboard />
                  // {/* </PrivateRoute> */}
                  }
              />
            
          </Routes>
      </Router>
   </UserProvider>  
      </main>
    </div>
  
  );
};

export default App;
