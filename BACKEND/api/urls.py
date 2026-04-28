from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CategorieViewSet, AuteurViewSet, LivreViewSet , EmpruntViewSet  , statistiques_admin


# Le DefaultRouter va créer automatiquement les liens comme /api/livres/ ou /api/livres/1/
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategorieViewSet)
router.register(r'auteurs', AuteurViewSet)
router.register(r'livres', LivreViewSet)
router.register('emprunts', EmpruntViewSet, basename='emprunt')
urlpatterns = [
    path('', include(router.urls)),
    path('statistiques/', statistiques_admin, name='statistiques_admin'),
]