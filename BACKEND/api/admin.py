from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Categorie, Auteur, Livre

# Enregistrer les modèles dans l'interface d'administration
admin.site.register(User, UserAdmin) # UserAdmin garde l'interface de mot de passe haché
admin.site.register(Categorie)
admin.site.register(Auteur)
admin.site.register(Livre)