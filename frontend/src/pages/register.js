import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Darkmode.css'; // Dark Mode CSS importieren

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { email, password, role });
      setSuccess('Registrierung erfolgreich!');
      setError('');
    } catch (err) {
      setError('Registrierung fehlgeschlagen');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrierung</h1>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Schüler</option>
        <option value="teacher">Lehrer</option>
      </select>
      <button type="submit">Registrieren</button>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Register;
