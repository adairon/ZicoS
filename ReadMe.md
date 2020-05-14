# Zicos : Installation en Local
1. cloner le répot git (branche master) dans le dossier de votre choix (en fonction de votre environnement de développement)
    - __Commande Terminal :__ ```git clone https://github.com/adairon/ZicoS.git```
2. Configurer la base de données dans fichier .env :  
```DATABASE_URL=mysql://DATABE_USERNAME:DATABASE_PASSWORD@DATABASE_HOST:PORT/DATABASE_NAME?serverVersion=5.7```  
    - _DATABASE_USERNAME_ : nom d'utilisateur pour se connecter à la base de données.
    - _DATABASE_PASSWORD_ : Mot de passe pour se connecter à la base de données.
    - _DATABES_HOST_ : url d'accès à la base de données.
    - _PORT_ : Port d'accès à la base de données.
    - _DATABASE_NAME_ : nom de la base de données.
3. Configurer l'url de l'API dans le fichier .env :
- ex : ```API_URL="'http://localhost:8000/api/'"```
4. installer toutes les dépendances et lancer les scripts de migration (via terminal du serveur ou accès SSH) : 
- __Commande Terminal :__ ```composer install```
5. installer les modules npm : 
- __Commande Terminal :__ ```npm install``
6. lancer une première build pour vérifier que tout fonctionne correctement : 
- __Commande Terminal :__ ```npm run build```

