import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const BookDetailScreen = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [livre, setLivre] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    // --- NOUVEAUX ÉTATS POUR L'EMPRUNT ---
    const [dateRetour, setDateRetour] = useState('');
    const [messageSucces, setMessageSucces] = useState('');
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        // Calculer la date d'aujourd'hui + 7 jours pour proposer une date par défaut
        const dateParDefaut = new Date();
        dateParDefaut.setDate(dateParDefaut.getDate() + 7);
        setDateRetour(dateParDefaut.toISOString().split('T')[0]); // Format YYYY-MM-DD

        // Charger les infos du livre
        api.get(`livres/${id}/`)
            .then(response => {
                setLivre(response.data);
                setChargement(false);
            })
            .catch(error => {
                console.error("Erreur :", error);
                setErreur("Impossible de charger les détails de ce livre.");
                setChargement(false);
            });
    }, [id]);

    // --- FONCTION POUR GÉRER L'EMPRUNT ---
    const handleEmprunter = async (e) => {
        e.preventDefault();
        setMessageSucces('');
        setMessageErreur('');

        try {
            // On envoie la demande à l'adresse qu'on a créée dans Django
            await api.post('emprunts/', {
                livre: id, // L'ID du livre actuel
                date_retour_prevue: dateRetour
            });

            setMessageSucces("🎉 Livre emprunté avec succès ! Bonne lecture.");
            
            // Optionnel : On renvoie à l'accueil après 3 secondes
            setTimeout(() => {
                navigate('/home');
            }, 3000);

        } catch (error) {
            console.error("Erreur d'emprunt :", error);
            setMessageErreur("Erreur lors de l'emprunt. Veuillez réessayer.");
        }
    };

    if (chargement) return <div style={styles.centerMessage}><h2>Chargement...</h2></div>;
    if (erreur) return <div style={styles.centerMessage}><h2 style={{color: '#e74c3c'}}>{erreur}</h2><button onClick={() => navigate('/home')} style={styles.backBtn}>Retour</button></div>;
    if (!livre) return null;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/home')} style={styles.backBtn}>
                ← Retour au catalogue
            </button>

            <div style={styles.card}>
                <div style={styles.imageContainer}>
                    {livre.couverture ? (
                        <img src={livre.couverture} alt={livre.titre} style={styles.image} />
                    ) : (
                        <div style={styles.placeholder}>Pas de couverture</div>
                    )}
                </div>
                
                <div style={styles.infoContainer}>
                    <h1 style={styles.title}>{livre.titre}</h1>
                    
                    <div style={styles.badgeContainer}>
                        <span style={styles.badge}>
                            Catégorie : {livre.categorie_details ? livre.categorie_details.nom : "Inconnue"}
                        </span>
                    </div>

                    <p style={styles.author}>
                        <strong>Auteur :</strong> {livre.auteur_details ? `${livre.auteur_details.prenom} ${livre.auteur_details.nom}` : "Inconnu"}
                    </p>
                    
                    <div style={styles.descriptionBox}>
                        <p style={{ color: 'var(--text)' }}>
                            Ceci est la page détaillée de l'œuvre. Profitez de ce chef-d'œuvre !
                        </p>
                    </div>

                    {/* --- ZONE D'EMPRUNT --- */}
                    <div style={styles.empruntBox}>
                        <h3 style={styles.empruntTitle}>Envie de lire ce livre ?</h3>
                        
                        {messageSucces && <div style={styles.succesMsg}>{messageSucces}</div>}
                        {messageErreur && <div style={styles.erreurMsg}>{messageErreur}</div>}
                        
                        {!messageSucces && (
                            <form onSubmit={handleEmprunter} style={styles.empruntForm}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Date de retour prévue :</label>
                                    <input 
                                        type="date" 
                                        style={styles.dateInput}
                                        value={dateRetour}
                                        onChange={(e) => setDateRetour(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" style={styles.empruntBtn}>
                                    Emprunter maintenant
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f5f6fa', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    centerMessage: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f6fa' },
    backBtn: { padding: '10px 20px', backgroundColor: 'white', border: '2px solid #3498db', color: '#3498db', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', transition: 'all 0.3s' },
    card: { display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' },
    imageContainer: { flex: '1', minWidth: '300px' },
    image: { width: '100%', height: '100%', objectFit: 'cover', maxHeight: '600px' },
    placeholder: { width: '100%', height: '400px', backgroundColor: '#bdc3c7', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold' },
    infoContainer: { flex: '2', padding: '40px', display: 'flex', flexDirection: 'column', minWidth: '300px' },
    title: { fontSize: '2.5rem', color: '#2c3e50', marginBottom: '15px', marginTop: '0' },
    badgeContainer: { marginBottom: '20px' },
    badge: { backgroundColor: '#e8f4f8', color: '#3498db', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' },
    author: { fontSize: '1.2rem', color: '#34495e', marginBottom: '30px' },
    descriptionBox: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', lineHeight: '1.6', marginBottom: '30px' },
    
    // Nouveaux styles pour la zone d'emprunt
    empruntBox: { backgroundColor: 'white', border: '2px dashed #3498db', padding: '25px', borderRadius: '15px', marginTop: 'auto' },
    empruntTitle: { marginTop: 0, color: '#2c3e50', fontSize: '1.3rem' },
    empruntForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontWeight: 'bold', color: '#7f8c8d' },
    dateInput: { padding: '10px', borderRadius: '8px', border: '1px solid #bdc3c7', fontSize: '1rem', fontFamily: 'inherit' },
    empruntBtn: { padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' },
    succesMsg: { backgroundColor: '#d1f2eb', color: '#117a65', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' },
    erreurMsg: { backgroundColor: '#fadbd8', color: '#c0392b', padding: '15px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }
};

export default BookDetailScreen;