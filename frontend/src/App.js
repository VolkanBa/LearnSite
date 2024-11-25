import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import logo from './styles/LearningSiteLogo.webp';
import Dashboard from './pages/dashboard.js';
import './styles/darkmode.css';
import { UserProvider } from './userContext.js'
import Classroom from './pages/classroom.js';
import { ClassroomProvider } from './pages/context.js';


const PrivateRoute = ({ children }) => {
   // Prüfen, ob das JWT-Token existiert
   const isAuthenticated = !!localStorage.getItem('authToken'); 
   return isAuthenticated ? children : <Navigate to="/login" />;
};



const path = window.location.pathname;
console.log("path hier:" +path);

const App = () => {
  return (
    <div>
     <header className="header">
      <img src={logo} alt="Logo" />
      <h1>LearnSite</h1>
      {path === "/login" || path === "/register"?(
        <nav>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
        )
      
      :  <nav>     
          <a href="/dashboard">Dashboard</a>
          <a href="/login">logout</a>
      </nav>
      }
    </header>

      <main>

      <UserProvider> 
      <ClassroomProvider>
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />            
              <Route path="/register" element={<Register />} />            
              <Route path="/dashboard" element={ <Dashboard />} />
              <Route path="/classroom/:classroomId" element={<Classroom />} />
            
          </Routes>
      </Router>
      </ClassroomProvider>
   </UserProvider>  
      </main>
    </div>
  
  );
};

export default App;
