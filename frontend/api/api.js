import axios from 'axios';

// Création d'une instance Axios personnalisée
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur : Avant d'envoyer CHAQUE requête, Axios va exécuter ce code
api.interceptors.request.use(
    (config) => {
        // On cherche si un jeton est sauvegardé dans le navigateur
        const token = localStorage.getItem('access_token');
        if (token) {
            // Si oui, on l'attache à la requête comme un badge de sécurité
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;