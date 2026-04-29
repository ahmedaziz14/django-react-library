import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useLottie } from 'lottie-react';
import loginLogo from '../assets/animations/Login.json'; 
import api from '../../api/api';

const LoginScreen = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erreur, setErreur] = useState('');

    const options = {
        animationData: loginLogo,
        loop: true,
    };
    const { View } = useLottie(options);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErreur('');

        if (username && password) {
            try {
                // On demande le jeton à l'adresse configurée dans Django
                const response = await api.post('token/', {
                    username: username,
                    password: password
                });

                // --- LA CORRECTION EST ICI ---
                // On extrait access, refresh, ET is_staff de la réponse !
                const { access, refresh, is_staff } = response.data;

                // On les sauvegarde dans le navigateur
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('is_staff', is_staff);

                // On redirige vers l'accueil !
                navigate('/home');

            } catch (error) {
                console.error("Erreur de connexion:", error);
                setErreur("Nom d'utilisateur ou mot de passe incorrect.");
            }
        } else {
            setErreur("Veuillez remplir tous les champs.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <div style={styles.logoContainer}>
                    {View}
                </div>

                <h2 style={styles.title}>Bon retour !</h2>
                <p style={styles.subtitle}>Connectez-vous pour gérer vos livres.</p>

                {erreur && <p style={styles.errorText}>{erreur}</p>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            style={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ex: admin"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input 
                            type="password" 
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Votre mot de passe"
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Se connecter
                    </button>
                </form>

                <div style={styles.footer}>
                    <p>Pas encore de compte ? <Link to="/signup" style={styles.link}>Inscrivez-vous</Link></p>
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

    errorText: {
        width: '100%',
        background: '#fee2e2',
        color: '#dc2626',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        marginBottom: '15px',
        textAlign: 'center',
        border: '1px solid #fecaca'
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
        color: '#0f172a',   // FIX texte invisible
        outline: 'none',
        transition: '0.2s'
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
export default LoginScreen;