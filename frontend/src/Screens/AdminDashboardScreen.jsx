import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
// --- NOUVEAUX IMPORTS POUR LES GRAPHIQUES ---
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminDashboardScreen = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    // Palette de couleurs pour le PieChart
    const COLORS = ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];

    useEffect(() => {
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

    // Préparation des données pour le graphique en Barres (Emprunts)
    const dataEmprunts = [
        { name: 'En règle', valeur: stats.emprunts_en_cours, fill: '#f39c12' },
        { name: 'En retard', valeur: stats.emprunts_en_retard, fill: '#e74c3c' }
    ];

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

                {/* --- LES CARTES DE STATISTIQUES (Chiffres Bruts) --- */}
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

                {/* --- NOUVEAU : LA ZONE DES GRAPHIQUES --- */}
                <div style={styles.chartsContainer}>
                    
                    {/* Graphique 1 : Catégories (PieChart) */}
                    <div style={styles.chartBox}>
                        <h3 style={styles.chartTitle}>Répartition par Catégories</h3>
                        {stats.livres_par_categorie && stats.livres_par_categorie.length > 0 ? (
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={stats.livres_par_categorie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {stats.livres_par_categorie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>Aucune donnée de catégorie disponible.</p>
                        )}
                    </div>

                    {/* Graphique 2 : Emprunts (BarChart) */}
                    <div style={styles.chartBox}>
                        <h3 style={styles.chartTitle}>État des Emprunts</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={dataEmprunts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="valeur" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* --- LE TABLEAU DES MAUVAIS ÉLÈVES --- */}
                <h2 style={{...styles.title, marginTop: '50px'}}>🚨 Alertes : Retards actuels</h2>
                
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
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    logo: { margin: 0, fontSize: '1.5rem' },
    btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
    loading: { textAlign: 'center', marginTop: '50px', color: '#3498db' },
    error: { textAlign: 'center', marginTop: '50px', color: '#e74c3c' },
    mainContent: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
    title: { color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem' },
    
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: 'center' },
    statTitle: { color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '1.1rem', textTransform: 'uppercase' },
    statNumber: { margin: 0, fontSize: '3rem', fontWeight: 'bold', color: '#2c3e50' },
    
    // Nouveaux styles pour les graphiques
    chartsContainer: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' },
    chartBox: { flex: '1 1 400px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', height: '400px', display: 'flex', flexDirection: 'column' },
    chartTitle: { textAlign: 'center', color: '#34495e', marginBottom: '20px', fontSize: '1.2rem' },
    noData: { textAlign: 'center', color: '#95a5a6', marginTop: '50px', fontStyle: 'italic' },
    
    successBox: { backgroundColor: '#d1f2eb', color: '#117a65', padding: '20px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' },
    tableContainer: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { backgroundColor: '#34495e', color: 'white' },
    th: { padding: '15px', textAlign: 'left' },
    tr: { borderBottom: '1px solid #ecf0f1' },
    td: { padding: '15px' }
};

export default AdminDashboardScreen;