import React, { useState } from 'react';
import axios from '../api';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('/users/login', { email, password });
    
            // Token im localStorage speichern
            window.location.href = '/dashboard';
            localStorage.setItem('authToken', response.data.token);
    
            setSuccess('Erfolgreich eingeloggt!');
            setTimeout(() => {
                window.location.href = '/dashboard'; // Weiterleitung zum Dashboard
            }, 1000);
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
