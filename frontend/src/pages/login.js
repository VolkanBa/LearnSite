import React, { useState } from 'react';
import axios from '../api';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
           
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            // Speichere das Token lokal
            localStorage.setItem('authToken', response.data.token);
            console.log('Token nach dem Login:', localStorage.getItem('authToken'));
            console.log('Token:', response.data.token); 

            setSuccess('Erfolgreich eingeloggt!');
            // Weiterleitung zu einer anderen Seite, z.B. Dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Login');
        }
    };
   

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <input
                    type="email"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Anmelden</button>
            </form>
        </div>
    );

};

export default Login;
