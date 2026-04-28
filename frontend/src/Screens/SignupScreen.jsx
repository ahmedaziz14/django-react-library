import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import api from '../../api/api'; // Axios configuration
import logoAnimation from '../assets/animations/Login.json'; // Use the same logo animation

const SignupScreen = () => {
    const navigate = useNavigate();
    
    // States for user input
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // --- NOUVEAU : L'état de la case Admin ---
    
    const [erreur, setErreur] = useState('');
    const [succes, setSucces] = useState('');

    // Configure Lottie animation
    const options = {
        animationData: logoAnimation,
        loop: true,
    };
    const { View } = useLottie(options);
    
    const handleSignup = async (e) => {
        e.preventDefault();
        setErreur('');
        setSucces('');
        
        if (username && email && password) {
            try {
                // VRAI APPEL À DJANGO
                await api.post('users/', {
                    username: username,
                    email: email,
                    password: password,
                    is_staff: isAdmin // --- NOUVEAU : On envoie le statut à Django ---
                });
                
                setSucces("Compte créé avec succès ! Redirection vers la connexion...");
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                
            } catch (error) {
                console.error("Erreur d'inscription:", error.response?.data);
                setErreur("Erreur lors de l'inscription. Ce pseudo existe peut-être déjà.");
            }
        } else {
            setErreur("Veuillez remplir tous les champs.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                {/* Logo Animé (Shared) */}
                <div style={styles.logoContainer}>
                    {View}
                </div>

                <h2 style={styles.title}>Créer un compte</h2>
                <p style={styles.subtitle}>Rejoignez notre bibliothèque pour gérer vos livres.</p>

                {erreur && <p style={styles.errorText}>{erreur}</p>}
                {succes && <p style={styles.successText}>{succes}</p>}

                <form onSubmit={handleSignup} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ex: testuser"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Adresse Email</label>
                        <input 
                            type="email" 
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input 
                            type="password" 
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Créer un mot de passe"
                        />
                    </div>

                    {/* --- NOUVEAU : LA CASE À COCHER ADMIN --- */}
                    <div style={styles.checkboxContainer}>
                        <input 
                            type="checkbox" 
                            id="adminCheck"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="adminCheck" style={styles.checkboxLabel}>
                            Créer en tant qu'Administrateur
                        </label>
                    </div>

                    <button type="submit" style={styles.button}>
                        S'inscrire
                    </button>
                </form>

                {/* Footer (Link to Login) */}
                <div style={styles.footer}>
                    <p>Déjà un compte ? <Link to="/login" style={styles.link}>Connectez-vous</Link></p>
                </div>
                
            </div>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        padding: '20px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '30px 40px',
        borderRadius: '15px',
        boxShadow: 'var(--shadow)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    logoContainer: {
        width: '150px',
        height: '150px',
        marginBottom: '10px'
    },
    title: {
        color: 'var(--text-h)',
        marginBottom: '8px',
        textAlign: 'center'
    },
    subtitle: {
        color: 'var(--text)',
        marginBottom: '25px',
        textAlign: 'center'
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '15px',
        width: '100%'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: 'var(--text-h)',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    
    // --- Styles pour la case à cocher ---
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--bg)',
        padding: '12px',
        borderRadius: '8px',
        border: '1px dashed var(--border)',
        marginBottom: '5px'
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    checkboxLabel: {
        color: 'var(--accent)',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },

    button: {
        padding: '12px',
        backgroundColor: 'var(--accent)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '15px',
        transition: 'background 0.3s'
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '0.9rem',
        marginBottom: '10px'
    },
    successText: {
        color: '#27ae60',
        fontSize: '0.9rem',
        marginBottom: '10px',
        fontWeight: 'bold'
    },
    footer: {
        marginTop: '20px',
        fontSize: '0.9rem',
        color: 'var(--text)'
    },
    link: {
        color: 'var(--accent)',
        fontWeight: 'bold',
        textDecoration: 'none'
    }
};

export default SignupScreen;