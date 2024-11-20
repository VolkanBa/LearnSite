import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from './api';

const UserContext = createContext();
const path = window.location.pathname;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const token = localStorage.getItem('authToken');
            
                  const response = await axios.get('/users/profile', {
                       headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });  
                if (!token && path !== '/login') { // Register hinzufügen
                  window.location.href = '/login';
                  return;
              }
              setUser(response.data);
          } catch (err) {
              console.error('Fehler beim Abrufen der Benutzerdaten:', err);
              localStorage.removeItem('authToken');
              if(path !== '/login'){
                    if(path !== '/register'){
                        window.location.href = '/login'
                    }
                
            } // Register noch hinzufügen

              
          }
      };

      fetchProfile();
  }, []);

  return (
      <UserContext.Provider value={user}>
          {children}
      </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
