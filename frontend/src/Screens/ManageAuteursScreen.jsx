import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import { useLottie } from 'lottie-react';
import auteurAnimation from '../assets/animations/saul.json'; // change si tu veux

const ManageAuteursScreen = () => {
    const navigate = useNavigate();

    const [auteurs, setAuteurs] = useState([]);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [biographie, setBiographie] = useState('');

    // LOTTIE
    const options = {
        animationData: auteurAnimation,
        loop: true,
    };
    const { View } = useLottie(options);

    useEffect(() => {
        if (localStorage.getItem('is_staff') !== 'true') {
            navigate('/home');
            return;
        }
        chargerAuteurs();
    }, [navigate]);

    const chargerAuteurs = async () => {
        try {
            const response = await api.get('auteurs/');
            setAuteurs(response.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des auteurs.");
        }
    };

    const handleAddAuteur = async (e) => {
        e.preventDefault();

        if (!nom || !prenom) {
            toast.warning("Nom et prénom obligatoires.");
            return;
        }

        try {
            await api.post('auteurs/', { nom, prenom, biographie });

            toast.success(`Auteur ${prenom} ${nom} ajouté !`);

            setNom('');
            setPrenom('');
            setBiographie('');
            chargerAuteurs();

        } catch (error) {
            toast.error("Erreur lors de l'ajout.");
        }
    };

    const handleDeleteAuteur = async (id) => {
        if (window.confirm("Supprimer cet auteur ?")) {
            try {
                await api.delete(`auteurs/${id}/`);
                toast.success("Auteur supprimé !");
                chargerAuteurs();
            } catch (error) {
                toast.error("Erreur suppression.");
            }
        }
    };

    return (
        <div style={styles.container}>
            
            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>✍️ Gestion des Auteurs</h1>
                <button 
                    onClick={() => navigate('/admin-dashboard')} 
                    style={styles.btn}
                >
                    ⬅ Retour
                </button>
            </nav>

            <main style={styles.mainContent}>

                {/* LOTTIE */}
                <div style={styles.lottieContainer}>
                    {View}
                </div>

                {/* FORMULAIRE */}
                <div style={styles.card}>
                    <h2>Ajouter un auteur</h2>

                    <form onSubmit={handleAddAuteur} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={prenom}
                            onChange={e => setPrenom(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="text"
                            placeholder="Nom"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            style={styles.input}
                        />

                        <textarea
                            placeholder="Biographie (optionnelle)"
                            value={biographie}
                            onChange={e => setBiographie(e.target.value)}
                            style={{ ...styles.input, height: '80px' }}
                        />

                        <button type="submit" style={styles.submitBtn}>
                            ➕ Ajouter
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div style={styles.card}>
                    <h2>Liste des auteurs</h2>

                    {auteurs.length === 0 ? (
                        <p style={styles.emptyText}>Aucun auteur.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {auteurs.map(auteur => (
                                    <tr key={auteur.id} style={styles.tr}>
                                        <td style={styles.td}>{auteur.prenom}</td>
                                        <td style={styles.td}><strong>{auteur.nom}</strong></td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => handleDeleteAuteur(auteur.id)}
                                                style={styles.deleteBtn}
                                                onMouseOver={e => e.target.style.opacity = "0.8"}
                                                onMouseOut={e => e.target.style.opacity = "1"}
                                            >
                                                🗑 Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
    color: 'white'
},

logo: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700'
},

btn: {
    background: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer'
},

mainContent: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto'
},

lottieContainer: {
    width: '150px',
    margin: '0 auto 20px'
},

card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '14px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    marginBottom: '30px'
},

form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
},

input: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    background: '#f8fafc',
    color: '#0f172a',
    outline: 'none'
},

submitBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600'
},

table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
},

tableHead: {
    background: '#0f172a',
    color: 'white'
},

tr: {
    borderBottom: '1px solid #e2e8f0'
},

td: {
    padding: '10px',
    color: '#334155'
},

deleteBtn: {
    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
},

emptyText: {
    color: '#64748b'
}
};

export default ManageAuteursScreen;