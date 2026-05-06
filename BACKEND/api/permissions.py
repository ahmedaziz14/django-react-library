from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    La permission personnalisée pour vérifier le rôle de l'utilisateur.
    """
    def has_permission(self, request, view):
        # Si c'est une requête de lecture (GET), on laisse passer tout le monde
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Si c'est une requête d'écriture (POST, PUT, DELETE), 
        # il faut être connecté ET avoir le statut 'is_staff'
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_staff # --- LA CORRECTION EST ICI ---
        )