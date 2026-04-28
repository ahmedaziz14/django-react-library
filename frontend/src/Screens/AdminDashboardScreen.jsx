import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const AdminDashboardScreen = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        // --- CORRECTION ICI : On utilise le nouveau système is_staff ---
        // Sécurité côté React : on éjecte ceux qui ne sont pas Admin
        if (localStorage.getItem('is_staff') !== 'true') {
            navigate('/home');
            return;
        }

        api.get('statistiques/')
            .then(response => {
                setStats(response.data);
                setChargement(false);
            })
            .catch(error => {
                console.error("Erreur Stats :", error);
                setErreur("Impossible de charger les statistiques.");
                setChargement(false);
            });
    }, [navigate]);

    if (chargement) return <div style={styles.container}><h2 style={styles.loading}>Chargement du tableau de bord...</h2></div>;
    if (erreur) return <div style={styles.container}><h2 style={styles.error}>{erreur}</h2><button onClick={() => navigate('/home')} style={styles.btn}>Retour</button></div>;

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>👑 Espace Administrateur</h1>
                <button onClick={() => navigate('/home')} style={styles.btn}>
                    Retour au catalogue
                </button>
            </nav>

            <main style={styles.mainContent}>
                <h2 style={styles.title}>Vue d'ensemble de la bibliothèque</h2>

                {/* --- LES CARTES DE STATISTIQUES --- */}
                <div style={styles.statsGrid}>
                    <div style={{...styles.statCard, borderTop: '5px solid #3498db'}}>
                        <h3 style={styles.statTitle}>Total des livres</h3>
                        <p style={styles.statNumber}>{stats.total_livres}</p>
                    </div>
                    
                    <div style={{...styles.statCard, borderTop: '5px solid #f39c12'}}>
                        <h3 style={styles.statTitle}>Emprunts en cours</h3>
                        <p style={{...styles.statNumber, color: '#f39c12'}}>{stats.emprunts_en_cours}</p>
                    </div>
                    
                    <div style={{...styles.statCard, borderTop: '5px solid #e74c3c'}}>
                        <h3 style={styles.statTitle}>Emprunts en retard</h3>
                        <p style={{...styles.statNumber, color: '#e74c3c'}}>{stats.emprunts_en_retard}</p>
                    </div>
                </div>

                {/* --- LE TABLEAU DES MAUVAIS ÉLÈVES --- */}
                <h2 style={{...styles.title, marginTop: '40px'}}>🚨 Alertes : Retards actuels</h2>
                
                {stats.liste_retards.length === 0 ? (
                    <div style={styles.successBox}>🎉 Super ! Aucun livre n'est en retard actuellement.</div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>Utilisateur</th>
                                    <th style={styles.th}>Livre</th>
                                    <th style={styles.th}>Date limite dépassée</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.liste_retards.map(retard => (
                                    <tr key={retard.id} style={styles.tr}>
                                        <td style={styles.td}><strong>{retard.utilisateur__username}</strong></td>
                                        <td style={styles.td}>📖 {retard.livre__titre}</td>
                                        <td style={{...styles.td, color: '#c0392b', fontWeight: 'bold'}}>
                                            {new Date(retard.date_retour_prevue).toLocaleDateString()}
                                        </td>
                                        <td style={styles.td}>
                                            <button style={styles.relanceBtn} onClick={() => alert(`Envoi d'un rappel à ${retard.utilisateur__username} en développement !`)}>
                                                ✉️ Relancer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f5f6fa', fontFamily: "'Segoe UI', Tahoma, sans-serif" },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white' },
    logo: { margin: 0, fontSize: '1.5rem' },
    btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    loading: { textAlign: 'center', marginTop: '50px', color: '#3498db' },
    error: { textAlign: 'center', marginTop: '50px', color: '#e74c3c' },
    mainContent: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    title: { color: '#2c3e50', marginBottom: '25px' },
    
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' },
    statTitle: { color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '1.1rem', textTransform: 'uppercase' },
    statNumber: { margin: 0, fontSize: '3rem', fontWeight: 'bold', color: '#2c3e50' },
    
    successBox: { backgroundColor: '#d1f2eb', color: '#117a65', padding: '20px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' },
    tableContainer: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { backgroundColor: '#34495e', color: 'white' },
    th: { padding: '15px', textAlign: 'left' },
    tr: { borderBottom: '1px solid #ecf0f1' },
    td: { padding: '15px' },
    relanceBtn: { backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AdminDashboardScreen;