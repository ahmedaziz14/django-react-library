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

export default LoginScreen;