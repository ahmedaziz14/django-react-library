from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenRefreshView
# --- 1. On garde uniquement ton import personnalisé ---
from api.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    
    # --- 2. On utilise ta vue personnalisée ICI pour la connexion ---
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # On garde le rafraîchissement par défaut
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)