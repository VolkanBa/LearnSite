import React from 'react';
import styles from '../styles/dashboard.module.css'; // CSS Module importieren
import logo from '../pages/LearningSiteLogo.webp'

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <img src={logo} alt="Profilbild" /> 
        <a href="#overview" className={styles.link}>Übersicht</a>
        <a href="#materials" className={styles.link}>Materialien</a>
        <a href="#profile" className={styles.link}>Profil</a>
        <a href="#settings" className={styles.link}>Einstellungen</a>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.mainHeader}>Willkommen im Dashboard</header>

        {/* Responsive Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h2>Neue Benachrichtigungen</h2>
            <p>Du hast 3 neue Nachrichten von Schülern.</p>
          </div>
          <div className={styles.card}>
            <h2>Aufgaben</h2>
            <p>2 ausstehende Aufgaben für die Klasse 10B.</p>
          </div>
          <div className={styles.card}>
            <h2>Statistiken</h2>
            <p>20 Schüler haben diese Woche Fortschritte gemacht.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
