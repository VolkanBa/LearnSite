import React, { useState } from 'react';
import axios from '../api';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login', { email, password });
            localStorage.setItem('authToken', response.data.token);
            setSuccess('Erfolgreich eingeloggt!');
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Login');
        }
    };

    // return (
    //     <div className="login-container">
    //         <form onSubmit={handleLogin}>
    //             <h1>Login</h1>
    //             {error && <p className="error">{error}</p>}
    //             {success && <p className="success">{success}</p>}
    //             <input
    //                 type="email"
    //                 placeholder="E-Mail"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 required
    //             />
    //             <input
    //                 type="password"
    //                 placeholder="Passwort"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 required
    //             />
    //             <button type="submit">Anmelden</button>
    //         </form>
    //     </div>
    // );


    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </form>
    );

};

export default Login;
