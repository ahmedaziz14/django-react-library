# 📚 Système de Gestion de Bibliothèque (Library Management System)

Une application web Full-Stack moderne permettant de gérer le catalogue et les emprunts de livres d'une bibliothèque. Ce projet propose une interface utilisateur dynamique pour les lecteurs et un tableau de bord administratif complet pour le personnel, sécurisé par un système d'authentification basé sur les rôles.

## ✨ Fonctionnalités Principales

### 👤 Espace Lecteur (Utilisateur)
- **Authentification Sécurisée :** Inscription et connexion avec système de jetons JWT.
- **Catalogue Dynamique :** Affichage des livres disponibles avec leurs couvertures, auteurs et catégories.
- **Recherche Instantanée :** Moteur de recherche en temps réel par titre ou auteur.
- **Filtrage Avancé :** Tri des œuvres par catégories via un menu déroulant.
- **Système d'Emprunt :** Réservation d'un livre avec définition de la date de retour prévue.
- **Espace Personnel :** Suivi des emprunts en cours, historique complet et affichage des dates limites.
- **Retour Rapide :** Action en un clic pour restituer un livre et libérer l'exemplaire.

### 👑 Espace Administrateur (Staff)
- **Tableau de Bord (Dashboard) :** Vue d'ensemble avec statistiques clés (Nombre total de livres, emprunts actifs, retards).
- **Gestion des Retards :** Liste dynamique signalant automatiquement les utilisateurs ayant dépassé la date limite de retour.
- **Gestion du Catalogue :** Interface dédiée permettant l'ajout de nouvelles œuvres à la base de données.
- **Sécurité Renforcée :** Accès restreint aux routes d'administration via la vérification du statut `is_staff` côté serveur (Django) et côté client (React).

## 🛠️ Stack Technique

**Frontend (Client) :**
- React.js (via Vite)
- React Router DOM (Navigation et protection des routes)
- Axios (Communication API)
- Lottie-react (Animations de l'interface)
- LocalStorage (Gestion persistante de la session utilisateur)

**Backend (Serveur) :**
- Python / Django
- Django REST Framework (Création de l'API CRUD)
- SimpleJWT (Authentification par Token Access/Refresh)
- SQLite (Base de données)

## 🚀 Installation et Déploiement Local

Pour lancer ce projet sur votre environnement local, suivez ces instructions :

### 1. Cloner le dépôt
```bash
git clone [https://github.com/ahmedaziz14/django-react-library.git](https://github.com/ahmedaziz14/django-react-library.git)
cd django-react-library
```

### 2. Lancer le Backend (Django)
Ouvrez un terminal et placez-vous dans le répertoire du backend :
```bash
cd backend

# Créer et activer l'environnement virtuel (Windows)
python -m venv env
env\Scripts\activate
# Sous MacOS/Linux : source env/bin/activate

# Installer les dépendances requises
pip install -r requirements.txt

# Créer les tables de la base de données
python manage.py migrate

# (Optionnel) Créer un compte Super-Administrateur
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

### 3. Lancer le Frontend (React)
Ouvrez un second terminal et placez-vous dans le répertoire du frontend :
```bash
cd frontend

# Installer les paquets Node.js
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🔮 Prochaines Étapes (Roadmap)
Ce projet a vocation à évoluer. Voici les prochaines fonctionnalités prévues :

- [ ] **Système de Notifications (Toasts) :** Remplacement des alertes classiques par des notifications UI élégantes (ex: `react-toastify`) lors des emprunts et des connexions.
- [ ] **Visualisation des Données (Charts) :** Intégration de graphiques (via `recharts` ou `chart.js`) sur le tableau de bord administrateur pour analyser la répartition des catégories et l'état des emprunts.
- [ ] **Stockage Cloud des Images :** Configuration avancée avec Cloudinary pour permettre l'upload direct des couvertures de livres (fichiers locaux) par l'administrateur.

## 🔒 Notes sur la Sécurité
Les endpoints sensibles de l'API sont protégés. Un `access_token` est exigé dans les en-têtes HTTP (Bearer Token) pour interagir avec les données. La distinction entre un lecteur classique et un administrateur se fait via le booléen natif `is_staff` de Django, garantissant une architecture de permissions robuste et standard.

## 👨‍💻 Auteur
**Ahmed Aziz Brahim** *Développé en avril 2026*