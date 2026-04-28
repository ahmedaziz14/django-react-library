import { useNavigate } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import logoAnimation from '../assets/animations/Library.json'; // Vérifie bien que ce fichier existe

const GetStartedScreen = () => {
    const navigate = useNavigate();

    const options = {
        animationData: logoAnimation,
        loop: true,
    };
    const { View } = useLottie(options);

    return (
        <div style={styles.container}>
            {/* La boîte magique qui empêche l'animation d'écraser le reste */}
            <div style={styles.animationWrapper}>
                {View}
            </div>
            
            <h1 style={styles.title}>Gérez votre Bibliothèque</h1>
            <p style={styles.subtitle}>La meilleure plateforme pour vos livres.</p>

            <button 
                style={styles.button} 
                onClick={() => navigate('/login')}
            >
                Get Started
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Utilise minHeight au lieu de height
        backgroundColor: '#ffffff',
        padding: '20px',    // Ajoute de l'espace sur les côtés pour les petits écrans
        boxSizing: 'border-box'
    },
    animationWrapper: {
        width: '250px',
        height: '250px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // CRUCIAL : Cache tout ce qui déborde
        marginBottom: '20px'
    },
    title: {
        fontSize: '2rem',
        color: '#2c3e50',
        marginBottom: '10px',
        textAlign: 'center'
    },
    subtitle: {
        color: '#7f8c8d',
        marginBottom: '40px',
        textAlign: 'center'
    },
    button: {
        padding: '15px 40px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: '#3498db',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginTop: '20px' // S'assure que le bouton n'est pas collé au texte
    }
};

export default GetStartedScreen;