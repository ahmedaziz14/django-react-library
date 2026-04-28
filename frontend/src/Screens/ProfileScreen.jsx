import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
const ProfileScreen = () => {
    const navigate = useNavigate();
    const [emprunts, setEmprunts] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    // On crée une fonction pour charger les données (qu'on pourra réutiliser)
    const fetchEmprunts = async () => {
        try {
            const response = await api.get('emprunts/');
            setEmprunts(response.data);
            setChargement(false);
        } catch (error) {
            console.error("Erreur API :", error);
            setErreur("Impossible de charger vos emprunts.");
            setChargement(false);
        }
    };

    useEffect(() => {
        fetchEmprunts();
    }, []);

    // --- NOUVELLE FONCTION POUR RENDRE UN LIVRE ---
    const handleRetour = async (empruntId) => {
        try {
            // On appelle l'action personnalisée de Django
            await api.post(`emprunts/${empruntId}/retourner/`);
            
            // Si ça marche, on recharge la liste pour mettre à jour l'affichage
            fetchEmprunts();
            alert("Merci ! Le livre a bien été retourné.");
        } catch (error) {
            console.error("Erreur lors du retour :", error);
            alert("Une erreur est survenue lors du retour.");
        }
    };

    const getStatutBadge = (statut) => {
        if (statut === 'EN_COURS') return <span style={{...styles.badge, backgroundColor: '#f39c12', color: 'white'}}>⏳ En cours</span>;
        if (statut === 'RETOURNE') return <span style={{...styles.badge, backgroundColor: '#2ecc71', color: 'white'}}>✅ Retourné</span>;
        if (statut === 'EN_RETARD') return <span style={{...styles.badge, backgroundColor: '#e74c3c', color: 'white'}}>⚠️ En retard</span>;
        return <span>{statut}</span>;
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>👤 Mon Espace Personnel</h1>
                <button onClick={() => navigate('/home')} style={styles.backBtn}>
                    Retour à l'accueil
                </button>
            </nav>

            <main style={styles.mainContent}>
                <h2 style={styles.title}>Historique de mes emprunts</h2>

                {chargement && <p>Chargement de vos données...</p>}
                {erreur && <p style={styles.error}>{erreur}</p>}

                {!chargement && !erreur && emprunts.length === 0 && (
                    <div style={styles.emptyBox}>
                        <p>Vous n'avez emprunté aucun livre pour le moment.</p>
                        <button onClick={() => navigate('/home')} style={styles.exploreBtn}>
                            Explorer la bibliothèque
                        </button>
                    </div>
                )}

                <div style={styles.list}>
                    {emprunts.map(emprunt => (
                        <div key={emprunt.id} style={styles.card}>
                            <div style={styles.cardInfo}>
                                <h3 style={styles.bookTitle}>📖 {emprunt.livre_titre}</h3>
                                <p style={styles.dateText}>
                                    <strong>Emprunté le :</strong> {new Date(emprunt.date_emprunt).toLocaleDateString()} <br/>
                                    <strong>Retour prévu le :</strong> {new Date(emprunt.date_retour_prevue).toLocaleDateString()}
                                    
                                    {/* Si le livre est retourné, on affiche la date de retour effective */}
                                    {emprunt.statut === 'RETOURNE' && emprunt.date_retour_effective && (
                                        <><br/><strong style={{color: '#27ae60'}}>Rendu le :</strong> {new Date(emprunt.date_retour_effective).toLocaleDateString()}</>
                                    )}
                                </p>
                            </div>
                            
                            <div style={styles.cardAction}>
                                <div style={styles.badgeContainer}>
                                    {getStatutBadge(emprunt.statut)}
                                </div>
                                
                                {/* LE BOUTON APPARAÎT SEULEMENT SI LE LIVRE N'EST PAS ENCORE RENDU */}
                                {emprunt.statut !== 'RETOURNE' && (
                                    <button 
                                        onClick={() => handleRetour(emprunt.id)} 
                                        style={styles.returnBtn}
                                    >
                                        🔄 Rendre le livre
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f5f6fa', fontFamily: "'Segoe UI', Tahoma, sans-serif" },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white' },
    logo: { margin: 0, fontSize: '1.5rem' },
    backBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    mainContent: { padding: '40px', maxWidth: '800px', margin: '0 auto' },
    title: { color: '#2c3e50', marginBottom: '30px', borderBottom: '2px solid #bdc3c7', paddingBottom: '10px' },
    error: { color: '#e74c3c', fontWeight: 'bold' },
    emptyBox: { textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    exploreBtn: { marginTop: '15px', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    cardInfo: { flex: 2 },
    bookTitle: { margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.3rem' },
    dateText: { margin: 0, color: '#7f8c8d', lineHeight: '1.5' },
    cardAction: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' },
    badgeContainer: { marginBottom: '5px' },
    badge: { padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' },
    returnBtn: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' }
};

export default ProfileScreen;