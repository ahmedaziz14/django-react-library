import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import { toast } from 'react-toastify'; 

// --- 1. CORRECTION : On importe axios normal au lieu de ton api configurée ---
import axios from 'axios'; 
import logoAnimation from '../assets/animations/Login.json'; 

const SignupScreen = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); 

    const options = {
        animationData: logoAnimation,
        loop: true,
    };
    const { View } = useLottie(options);
    
    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (username && email && password) {
            try {
                // --- 2. CORRECTION : On utilise axios.post avec l'adresse complète ---
                await axios.post('http://127.0.0.1:8000/api/users/', {
                    username: username,
                    email: email,
                    password: password,
                    is_staff: isAdmin 
                });
                
                toast.success("Compte créé avec succès ! 🚀");
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                
            } catch (error) {
                console.error("Erreur d'inscription:", error.response?.data);
                toast.error("Erreur : Ce nom d'utilisateur est peut-être déjà pris ❌");
            }
        } else {
            toast.warning("Veuillez remplir tous les champs. ⚠️");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <div style={styles.logoContainer}>
                    {View}
                </div>

                <h2 style={styles.title}>Créer un compte</h2>
                <p style={styles.subtitle}>Rejoignez notre bibliothèque pour gérer vos livres.</p>

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

                <div style={styles.footer}>
                    <p>Déjà un compte ? <Link to="/login" style={styles.link}>Connectez-vous</Link></p>
                </div>
                
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '20px'
    },

    card: {
        backgroundColor: '#ffffff',
        padding: '35px 40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    logoContainer: {
        width: '140px',
        height: '140px',
        marginBottom: '10px'
    },

    title: {
        color: '#0f172a',
        marginBottom: '6px',
        textAlign: 'center',
        fontWeight: '700'
    },

    subtitle: {
        color: '#64748b',
        marginBottom: '25px',
        textAlign: 'center',
        fontSize: '0.95rem'
    },

    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    inputGroup: {
        marginBottom: '16px',
        width: '100%'
    },

    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#334155',
        fontWeight: '600',
        fontSize: '0.9rem'
    },

    input: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc',
        color: '#0f172a',          // ✅ TEXTE VISIBLE
        outline: 'none',
        transition: '0.2s ease'
    },

    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginTop: '5px'
    },

    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },

    checkboxLabel: {
        color: '#334155',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },

    button: {
        padding: '13px',
        background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.05rem',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: '18px',
        transition: '0.2s',
        boxShadow: '0 10px 20px rgba(37,99,235,0.25)'
    },

    footer: {
        marginTop: '20px',
        fontSize: '0.9rem',
        color: '#64748b'
    },

    link: {
        color: '#2563eb',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default SignupScreen;