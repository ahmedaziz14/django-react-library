from rest_framework import viewsets
from .models import User, Categorie, Auteur, Livre, Emprunt
from .serializers import UserSerializer, CategorieSerializer, AuteurSerializer, LivreSerializer, EmpruntSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone

# --- VUES GÉNÉRIQUES ---

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAdminOrReadOnly]

class AuteurViewSet(viewsets.ModelViewSet):
    queryset = Auteur.objects.all()
    serializer_class = AuteurSerializer
    permission_classes = [IsAdminOrReadOnly]

class LivreViewSet(viewsets.ModelViewSet):
    queryset = Livre.objects.all()
    serializer_class = LivreSerializer
    permission_classes = [IsAdminOrReadOnly]

# --- AUTHENTIFICATION ---

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # On renvoie is_staff à React pour gérer l'affichage des boutons
        data['is_staff'] = self.user.is_staff 
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- GESTION DES EMPRUNTS ---

class EmpruntViewSet(viewsets.ModelViewSet):
    serializer_class = EmpruntSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # CORRECTION : On utilise is_staff pour le filtrage
        if user.is_staff:
            return Emprunt.objects.all()
        return Emprunt.objects.filter(utilisateur=user)

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)

    @action(detail=True, methods=['post'])
    def retourner(self, request, pk=None):
        emprunt = self.get_object()
        if emprunt.statut == 'RETOURNE':
            return Response({"erreur": "Ce livre a déjà été retourné."}, status=400)

        emprunt.statut = 'RETOURNE'
        emprunt.date_retour_effective = timezone.now().date()
        emprunt.save()
        return Response({"message": "Livre retourné avec succès !"})

# --- STATISTIQUES ADMIN ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistiques_admin(request):
    # CORRECTION : Sécurité basée sur is_staff
    if not request.user.is_staff:
        return Response({"erreur": "Accès refusé. Réservé au staff."}, status=403)

    aujourdhui = timezone.now().date()

    return Response({
        "total_livres": Livre.objects.count(),
        "emprunts_en_cours": Emprunt.objects.filter(
            statut='EN_COURS', 
            date_retour_prevue__gte=aujourdhui
        ).count(),
        "emprunts_en_retard": Emprunt.objects.filter(
            statut='EN_COURS', 
            date_retour_prevue__lt=aujourdhui
        ).count(),
        "liste_retards": list(Emprunt.objects.filter(
            statut='EN_COURS', 
            date_retour_prevue__lt=aujourdhui
        ).values('id', 'utilisateur__username', 'livre__titre', 'date_retour_prevue'))
    })