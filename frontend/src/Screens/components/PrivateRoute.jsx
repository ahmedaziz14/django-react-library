import { Navigate } from 'react-router-dom';

// Le composant accepte "children" en paramètre (ce qui se trouve à l'intérieur de lui)
const PrivateRoute = ({ children }) => {
    
    // 1. On vérifie si l'utilisateur possède son "badge" (le jeton JWT)
    const token = localStorage.getItem('access_token');

    // 2. S'il a un jeton, on le laisse passer (on affiche les "children", donc la page)
    if (token) {
        return children;
    }

    // 3. S'il n'a pas de jeton, on le redirige immédiatement vers la page de connexion
    // (L'option 'replace' efface l'historique pour qu'il ne puisse pas faire "Retour" et revenir sur la page interdite)
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;