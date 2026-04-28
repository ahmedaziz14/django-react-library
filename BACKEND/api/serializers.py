from rest_framework import serializers
# Modifie cette ligne :
from .models import User, Categorie, Auteur, Livre, Emprunt

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # On autorise React à envoyer ce champ (par défaut, c'est False)
    is_staff = serializers.BooleanField(default=False) 

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            # On applique le statut administrateur ici
            is_staff=validated_data.get('is_staff', False) 
        )
        return user
class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__' # Transforme toutes les colonnes en JSON

class AuteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auteur
        fields = '__all__'

class LivreSerializer(serializers.ModelSerializer):
    # Optionnel mais très utile : au lieu de juste envoyer "auteur: 1", 
    # on envoie toutes les infos de l'auteur avec le livre pour faciliter la vie de React
    auteur_details = AuteurSerializer(source='auteur', read_only=True)
    categorie_details = CategorieSerializer(source='categorie', read_only=True)

    class Meta:
        model = Livre
        fields = '__all__'



class EmpruntSerializer(serializers.ModelSerializer):
    # Ces champs en "lecture seule" permettent d'envoyer le nom du livre et de l'utilisateur à React
    livre_titre = serializers.ReadOnlyField(source='livre.titre')
    utilisateur_nom = serializers.ReadOnlyField(source='utilisateur.username')

    class Meta:
        model = Emprunt
        fields = ['id', 'utilisateur', 'utilisateur_nom', 'livre', 'livre_titre', 
                  'date_emprunt', 'date_retour_prevue', 'date_retour_effective', 'statut']
        
        # On empêche l'utilisateur de tricher sur la date d'emprunt ou de faire un emprunt au nom de quelqu'un d'autre
        read_only_fields = ['utilisateur', 'date_emprunt', 'date_retour_effective']