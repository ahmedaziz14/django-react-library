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
    container: { minHeight: '100vh', backgroundColor: '#f5f6fa', fontFamily: "'Segoe UI', Tahoma, sans-serif" },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    logo: { margin: 0, fontSize: '1.5rem' },
    logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    mainContent: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
    pageTitle: { color: '#2c3e50', marginBottom: '20px', fontSize: '2rem' },
    
    // Nouveaux styles pour la recherche
    searchBarContainer: { display: 'flex', gap: '15px', marginBottom: '30px', backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flexWrap: 'wrap' },
    searchInput: { flex: 2, padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #bdc3c7', outline: 'none', minWidth: '250px' },
    filterSelect: { flex: 1, padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #bdc3c7', outline: 'none', backgroundColor: '#f9f9f9', minWidth: '200px', cursor: 'pointer' },
    noResultsBox: { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' },
    resetBtn: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    
    message: { fontSize: '1.2rem', color: '#7f8c8d' },
    error: { color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' },
    card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' },
    image: { width: '100%', height: '300px', objectFit: 'cover' },
    placeholderImage: { width: '100%', height: '300px', backgroundColor: '#bdc3c7', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' },
    cardBody: { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
    bookTitle: { margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.2rem' },
    badgesWrapper: { marginBottom: '10px' },
    catBadge: { backgroundColor: '#e8f4f8', color: '#3498db', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' },
    bookAuthor: { margin: '0 0 15px 0', color: '#7f8c8d', flexGrow: 1 },
    detailsBtn: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }
};

export default HomeScreen;