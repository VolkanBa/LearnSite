import React from 'react';
import logo from '../styles/logo.png';
import Dashboard from '../styles/dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="Logo" />
        <a href="#overview">Übersicht</a>
        <a href="#materials">Materialien</a>
        <a href="#profile">Profil</a>
        <a href="#settings">Einstellungen</a>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">Willkommen im Dashboard</header>

        {/* Responsive Cards */}
        <div className="cards">
          <div className="card">
            <h2>Neue Benachrichtigungen</h2>
            <p>Du hast 3 neue Nachrichten von Schülern.</p>
          </div>
          <div className="card">
            <h2>Aufgaben</h2>
            <p>2 ausstehende Aufgaben für die Klasse 10B.</p>
          </div>
          <div className="card">
            <h2>Statistiken</h2>
            <p>20 Schüler haben diese Woche Fortschritte gemacht.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
