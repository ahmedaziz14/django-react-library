import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const HomeScreen = () => {
    const navigate = useNavigate();
    
    // --- CORRECTION 1 : On lit la nouvelle clé is_staff ---
    const isStaff = localStorage.getItem('is_staff'); 
    
    // --- ÉTATS POUR LES DONNÉES ---
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]); // Pour le menu déroulant
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState('');

    // --- ÉTATS POUR LA RECHERCHE ET LES FILTRES ---
    const [recherche, setRecherche] = useState('');
    const [categorieFiltre, setCategorieFiltre] = useState('');

    useEffect(() => {
        // On charge les livres ET les catégories en même temps
        const fetchData = async () => {
            try {
                const resLivres = await api.get('livres/');
                setLivres(resLivres.data);
                
                const resCategories = await api.get('categories/');
                setCategories(resCategories.data);
                
                setChargement(false);
            } catch (error) {
                console.error("Erreur API :", error);
                setErreur("Impossible de charger les données. Vérifiez que Django tourne.");
                setChargement(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // --- CORRECTION 2 : On nettoie la bonne clé à la déconnexion ---
        localStorage.removeItem('is_staff'); 
        navigate('/login');
    };

    // --- LE MOTEUR DE RECHERCHE INSTANTANÉ ---
    const livresFiltres = livres.filter((livre) => {
        const titreOuAuteurMatch = 
            livre.titre.toLowerCase().includes(recherche.toLowerCase()) ||
            (livre.auteur_details && `${livre.auteur_details.prenom} ${livre.auteur_details.nom}`.toLowerCase().includes(recherche.toLowerCase()));
        
        const categorieMatch = 
            categorieFiltre === '' || 
            (livre.categorie_details && livre.categorie_details.id.toString() === categorieFiltre);

        return titreOuAuteurMatch && categorieMatch;
    });

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>📚 Ma Bibliothèque</h1>
                <div>
                    <button onClick={() => navigate('/profile')} style={{...styles.logoutBtn, backgroundColor: '#3498db', marginRight: '10px'}}>
                        👤 Mes Emprunts
                    </button>
                    
                    {/* --- CORRECTION 3 : On vérifie si isStaff est 'true' --- */}
                    {isStaff === 'true' && (
                        <>
                            <button onClick={() => navigate('/admin-dashboard')} style={{...styles.logoutBtn, backgroundColor: '#8e44ad', marginRight: '10px'}}>
                                📊 Tableau de Bord
                            </button>
                            <button onClick={() => navigate('/add-book')} style={{...styles.logoutBtn, backgroundColor: '#27ae60', marginRight: '10px'}}>
                                ➕ Ajouter un livre
                            </button>
                        </>
                    )}
                    
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Déconnexion
                    </button>
                </div>
            </nav>

            <main style={styles.mainContent}>
                <h2 style={styles.pageTitle}>Catalogue de la bibliothèque</h2>

                {/* --- ZONE DE RECHERCHE ET FILTRES --- */}
                {!chargement && !erreur && (
                    <div style={styles.searchBarContainer}>
                        <input 
                            type="text" 
                            placeholder="🔍 Rechercher par titre ou auteur..." 
                            style={styles.searchInput}
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                        
                        <select 
                            style={styles.filterSelect}
                            value={categorieFiltre}
                            onChange={(e) => setCategorieFiltre(e.target.value)}
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nom}</option>
                            ))}
                        </select>
                    </div>
                )}

                {chargement && <p style={styles.message}>Chargement des livres en cours...</p>}
                {erreur && <p style={styles.error}>{erreur}</p>}

                {/* Si la recherche ne donne rien */}
                {!chargement && !erreur && livresFiltres.length === 0 && (
                    <div style={styles.noResultsBox}>
                        <p style={styles.message}>Aucun livre ne correspond à votre recherche.</p>
                        <button onClick={() => {setRecherche(''); setCategorieFiltre('');}} style={styles.resetBtn}>
                            Effacer les filtres
                        </button>
                    </div>
                )}

                {/* --- GRILLE DES LIVRES FILTRÉS --- */}
                <div style={styles.grid}>
                    {livresFiltres.map((livre) => (
                        <div key={livre.id} style={styles.card}>
                            {livre.couverture ? (
                                <img src={livre.couverture} alt={`Couverture`} style={styles.image} />
                            ) : (
                                <div style={styles.placeholderImage}><span>Pas d'image</span></div>
                            )}
                            
                            <div style={styles.cardBody}>
                                <h3 style={styles.bookTitle}>{livre.titre}</h3>
                                <div style={styles.badgesWrapper}>
                                    {livre.categorie_details && (
                                        <span style={styles.catBadge}>{livre.categorie_details.nom}</span>
                                    )}
                                </div>
                                <p style={styles.bookAuthor}>
                                    De : {livre.auteur_details ? `${livre.auteur_details.prenom} ${livre.auteur_details.nom}` : "Inconnu"}
                                </p>
                                <button style={styles.detailsBtn} onClick={() => navigate(`/livre/${livre.id}`)}>
                                    Voir détails
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const styles = {
container: {
    minHeight: '100vh',
    background: '#f1f5f9',
    fontFamily: "'Inter', sans-serif"
},

navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'linear-gradient(135deg,#0f172a,#1e293b)',
    color: 'white',
    boxShadow: '0 5px 20px rgba(0,0,0,0.15)'
},

logo: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700'
},

logoutBtn: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginLeft: '8px',
    transition: '0.2s'
},

mainContent: {
    padding: '40px',
    maxWidth: '1300px',
    margin: '0 auto'
},

pageTitle: {
    color: '#0f172a',
    marginBottom: '25px',
    fontSize: '1.8rem',
    fontWeight: '700'
},

searchBarContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '18px',
    borderRadius: '14px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    flexWrap: 'wrap'
},

searchInput: {
    flex: 2,
    padding: '12px 14px',
    fontSize: '0.95rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    minWidth: '250px',
    background: '#f8fafc',
    color: '#0f172a'
},

filterSelect: {
    flex: 1,
    padding: '12px',
    fontSize: '0.95rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    backgroundColor: '#f8fafc',
    minWidth: '200px',
    cursor: 'pointer',
    color: '#0f172a'
},

noResultsBox: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '14px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
},

resetBtn: {
    marginTop: '15px',
    padding: '10px 20px',
    background: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
},

message: {
    fontSize: '1.1rem',
    color: '#64748b'
},

error: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '1.1rem'
},

grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '25px'
},

card: {
    backgroundColor: 'white',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
    transition: '0.2s',
    display: 'flex',
    flexDirection: 'column'
},

image: {
    width: '100%',
    height: '260px',
    objectFit: 'cover'
},

placeholderImage: {
    width: '100%',
    height: '260px',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#64748b',
    fontWeight: '600'
},

cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
},

bookTitle: {
    margin: '0 0 8px 0',
    color: '#0f172a',
    fontSize: '1.1rem',
    fontWeight: '600'
},

badgesWrapper: {
    marginBottom: '10px'
},

catBadge: {
    background: '#dbeafe',
    color: '#2563eb',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600'
},

bookAuthor: {
    margin: '0 0 15px 0',
    color: '#64748b',
    flexGrow: 1,
    fontSize: '0.9rem'
},

detailsBtn: {
    background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '600',
    transition: '0.2s'
}
};

export default HomeScreen;