import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLottie } from 'lottie-react'; // 1. On importe le Hook ici
import splashAnimation from '../assets/animations/Library.json'; // Ton fichier Lottie mis à jour

const SplashScreen = () => {
    const navigate = useNavigate();

    // 2. On configure l'animation via le Hook
    const options = {
        animationData: splashAnimation,
        loop: false,
    };
    const { View } = useLottie(options); // Lottie génère la vue correctement pour Vite

    useEffect(() => {
        // Redirection automatique après 3 secondes (3000 ms)
        const timer = setTimeout(() => {
            navigate('/get-started');
        }, 3000);

        // Nettoyage du timer si on quitte le composant avant
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={styles.container}>
            <div style={{ width: 300, height: 300 }}>
                {/* 3. On affiche la Vue générée au lieu de la balise <Lottie /> */}
                {View}
            </div>
            <h2 style={{ color: '#333', marginTop: 20 }}>Chargement...</h2>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f6fa'
    }
};

export default SplashScreen;