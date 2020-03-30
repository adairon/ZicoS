# Zicos VERSION 0.1 : Construction

## Install Symfony version 4.x.x
Utilisation de la version 4.4 de Symfony et non de la version 5 car version 4.4 mieux maitrisée. Mise à jour éventuelle vers la version 5 dans un deuxième temps.  
__Terminal__ : ``` composer create-project symfony/website-skeleton ZicoS "4.4.*"```  
On peut vérifier la liste des commandes dans le terminal par : ```bin/console```

### Execution du serveur de dev local
pour utiliser la commande server:run sur symfony 4.4 :   
1. ```composer require --dev symfony/web-server-bundle```  
2. ```bin/console server:run```


## Développement Back-End :

### Database
1. Configurer la base de données dans fichier .env (ligne 32) :  
```DATABASE_URL=mysql://root:root@127.0.0.1:8889/db_zicos?serverVersion=5.7```  
__IMPORTANT :__ penser à modifier le port mySql par 8889 (pour les utilisateurs sous Mac Os)
2. Création physique de la base de données (à contrôler dans phpMyAdmin):  
```bin/console doctrine:database:create```  

### Entités
Les types de données de l'application :  
    On a plusieurs tables à créer :  
1. Profile :  
- id (généré automatiquement)
- firstName (type="string", nullable="no")
- lastName (type="string", nullable="yes") 
- email (type="string", nullable="no")
- biography (type="text", nullable="yes")
- pictureUrl (type="string", nullable="yes")
- linkUrl (type="string", nullable="yes")
- type (type="relation" - "ManyToOne")
- instrument (type="relation" - "ManyToOne")
- localization (type="relation" - "ManyToOne")
- level (type="relation" - "ManyToOne")
- style (type="relation" - "ManyToOne")
- user (type="relation" - "ManyToOne" - __attention :__ un user peut ne pas avoir de profil rattaché (ce sera notamment le cas lors de la création du compte : on créé d'abord un utilisateur puis ensuite son profil))

    - Dans un premier temps : un profil ne peut avoir qu'un seul instrument, style ou influence.

2. User :  
- id (généré automatiquement)
- email (type="string")
- password (type="string")
- birthDate (type="date", nullable="no")

3. Type (de profil) :
- id (généré automatiquement)
- name (type="string")

4. Style (de musique) :
- id (généré automatiquement)
- name (type="string")

5. Instrument (de musique) :
- id (généré automatiquement)
- name (type="string")

6. Localization (Lieu d'habitation) :
- id (généré automatiquement)
- region (type="string", nullable="yes")
- departementNumber (type="integer", nullable="yes")
- departement (type="string", nullable="yes")

7. Level (niveau d'expérience) :
- id (généré automatiquement)
- name (type="string")

__à voir plus tard :__

9. Recherche (critères de recherche) :
- id (généré automatiquement)
- critere (type="string")
- type (type = "relation" avec Type)
- style (type = "relation" avec Style)
- departement (type = "relation" avec Departement)

__TODO : Pour la messagerie, voir le composant Messenger de Symfony (messagerie interne type mail)__
10. Message (système de messagerie interne) :
- id (généré automatiquement)
- objet (type="string")
- message (type="text")
- auteur (type="relation" avec User)
- detsinataire (type="relation" avec User)


Pour créer les entités : ```bin/console make:entity``` 
Pour créer l'entité User : ```bin/console make:user``` 


#### Migration
1. Création du fichier de migration (code SQL) ```bin/console make:migration```
2. Executer la migration ```bin/console doctrine:migrations:migrate```  
--> créé les tables dans MySQL  (vérification dans phpMyAdmin)

### Fixtures
- on utilise les fixtures pour créer des données et on va utiliser la librairie faker pour les alimenter.
```composer require orm-fixtures fzaninotto/faker --dev```  
puis  
```bin/console make:fixtures```



1. types de musique à créer :  
- Disco
- Blues
- Funk
- Jazz
- Metal
- Pop
- Punk
- Rap
- Rock 'n' roll
- Country
- Reggae
- Afro
- Ska
- Soul
- R’n’B
- Zouk
- Latino
- Hard Rock
- Autre

2. instruments de musique :
- Guitare
- Basse
- Batterie
- Piano
- Clavier
- Trompette
- Saxophone
- Clarinette
- Xylophone
- Violon
- Alto
- Contrebasse
- Violoncelle
- Percussions
- Harmonica
- Acordéon
- Platines
- Chant (lead)
- Chant (Choeurs)
- Autre

3. Liste des départements français (numéro + libellé)

4. Niveaux d'expérience à créer:
- Débutant
- Confirmé
- Avancé

- on charge les données créées dans les fixtures : ```bin/console doctrine:fixtures:load```

### API Platform

#### Mise en place et configuration :
1. Installation du composant API Platform :  
```composer require API```

2. Annoter les ressources que l'on veut récupérer dans l'API avec l'annotation ```@ApiResource```  
    - Il faut également importer ApiResource dans l'entité avec ```use ApiPlatform\Core\Annotation\ApiResource;```

3. Groupes de sérialisation configurés pour éviter les boucles infinies et les erreurs de normalisation
- On récupère à chaque fois le profil dans les autres entités
- Attention a ne pas rendre le password "visible" dans l'entité User

4. Configuration 
- configuration par défaut dans le fichier ```config/packages/api_platform.yaml```
    - pagination par défaut : false
- ordre de présentation des données :
    - Profil: Id Descendant (l'Id le plus récent en 1er)
    - Expérience : Ascendant
    - Influences : Ascendant
    - Instruments: Ascendant
    - Localisation: Numéro de département Ascendant
    - Style: Ascendant
- Trier et ordonner les données via l'API pour l'entité Profil (possible sur les ressources liées)

5. Collections et Items Operations
configuration des opérations disponibles (paramétrages avec l'API dans les entités) pour les collections et les items

__A VOIR : DANS UN PREMIER TEMPS, ON LAISSE TOUTES LES ROUTES OUVERTES PAR DEFAUT ??__

- Collections operations :  
On peut Récupérer TOUTES les instances de l'entité (GET) et/ou en créer une nouvelle (POST)
    - User : POST
    - Profil : GET, POST
    - Experience : GET, (POST ?)
    - Influence : GET, (POST ?)
    - Instrument : GET, (POST ?)
    - Localisation : GET, (POST ?)
    - Style : GET, (POST ?)
    - Type : GET, (POST ?)
- Items operation :  
Sur UNE instance de l'entité (identifiée avec son id), on peut récupérer cette instance (GET), la supprimer (DELETE), la remplacer (PUT), la modifier partiellement (PATCH)  
    - User : GET/id, DELETE (supprimer son compte utilisateur), PATCH(modifier son mot de passe par ex)
    - Profil : GET/id, DELETE, PUT, PATCH
    - Experience : GET/id
    - Influence : GET/id 
    - Instrument : GET/id
    - Localisation : GET/id
    - Style : GET/id
    - Type : GET/id

### Validation des données
Contrôle des données à la création du profil avec message d'erreurs paramétrés dans l'entité :
- nom : notBlank
- email : notBlank et format email valide
- Date de naissance : format date valide
- biographie : max 500 caractères

#### Problème de validation de la date
Pour valider la date, on ajoute un context de dénormalisation pour désactiver le renforcement du type de donnée.  
On supprime également la mention ```\DateTimeInterface``` dans la fonction ```setDateNaissance()```  
On créé alors un normaliseur personnalisé pour les dates :  
- On copie le code de la classe :  ```vendor/symfony/serializer/Normalizer/DateTimeNormalizer.php```
- On créé, dans nouveau dossier ```Serializer``` du dosier ```src``` un nouveau fichier dans lequel on copie ce code à modifier : ```src/Serializer/PatchedDateTimeNormalizer.php```
    - on modifie le nom de la classe ```PatchedDateTimeNormalizer``` et le name space ```namespace App\Serializer;```
    - on importe bien toutes les interfaces nécessaires
    - on ajoute une condition pour préciser au normalizer de prendre en compte la data si le renforcement des types est désactivé et ça afin de pouvoir déplacer la validation de cette donnée au niveau de ce que l'on paramètre dans l'entité

### Création d'un utilisateur et sécurité :
- Validation de l'email :
    - NotBlank
    - format valide
    - pas d'utilisateur déjà existant avec cette adresse email (uniqueEntity)
- Validation du mot de passe :
    - Doit faire au moins 8 caractères
    - Ne doit pas être compromis (vérification faite automatiquement via haveibeenpwned.com)
#### Force du mot de passe :
Pour vérifier et valider la force du mot de passe (son niveau de sécurisation), on utilise le bundle __Password-strength validator for Symfony__.  
- Installation : ```composer require rollerworks/password-strength-validator```
- namespace : ```use Rollerworks\Component\PasswordStrength\Validator\Constraints as RollerworksPassword;```
- annotation (ex) : ```@RollerworksPassword\PasswordStrength(minLength=7, minStrength=4)```
- Niveau de force des mots de passe :
    1. Très faible (n'importe quel caractère)
    2. Faible (au moins 1 minuscue et 1 capitale)
    3. Moyen (au moins 1 minuscue ou 1 capitale et 1 chiffre)
    4. Fort (au moins 1 minuscue et 1 capitale et 1 chiffre) (recommandé pour la plupart des usages)
    5. Très Fort (recommandé pour les administrateurs ou les les services liés à la finance par ex)

### Authentification avec JSON Web Token (JWT)
- Installation du bundle LexikJwtAuthentication avec la commande ```composer require "lexik/jwt-authentication-bundle"```
- Création d'un nouveau dossier dans le dossier config avec ```mkdir -p config/jwt```
- Génération des clés de sécurité (voir doc) en utilisant la "pass phrase" qui a été générée dans le fichier .env
- configuration du firewall dans le fichier security.yaml (voir doc) et de la route pour login dans le fichier routes.yaml (voir doc)

### configurations de sécurité
- Création d'un firewall pour la création d'un nouvel utilisateur dans le fichier security.yaml : les routes "/api/users" sont ouvertes aux utilisateurs anonymes (non connectés) uniquement en méthode POST pour créer un nouvel utilisateur (impossible donc de récupérer la liste des utilisateurs avec la méthode GET en n'étant pas connecté)
- Ouverture des routes "/api" aux anonymes pour documenter l'api aux éventuels développeurs
__Contrôles d'accés Sécurisé :__  
- configuration dans security.yaml d'accès pour certaines routes :
    - accès à tous les profils : utilisateurs connectés
    - accés à tous les utilisateurs : admin uniquement
    - accès à la route de login : ouvert aux anonymes (non connectés)
    - accès à toutes les expériences : utilisateurs connectés
    - accès à toutes les influences : utilisateurs connectés
    - accès à tous les instruments : utilisateurs connectés
    - accès à tous les styles : utilisateurs connectés
    - accès à tous les types de profils : utilisateurs connectés
    - accès à toutes les localisations : utilisateurs connectés


### Evènements du Kernel

#### hasher le mot de passe
Problème : le mot de passe est stocké en clair dans la base de donnée. On va mettre en place un évènement du Kernel pour l'encrypter.
- création d'un dossier "Events" dans le dossier "src"
- Création de l'évènement PasswordEncoderSubscriber qui va hasher le password avant son écriture dans la base.

#### Relier la création du profil à l'utilisateur connecté
On veut que le profil créé soit automatiquement relié à l'utilisateur actuellement connecté en utilisant les données contenues dans le token.
- On créé un nouvel évènement : ProfilUserSubscriber


<!-- ### Make CRUD
Pour créer automatiquement le crud (Create Read Update Delete) sur les entités créées :
1. ```bin/console make:crud```
2. préciser le nom de l'entité sur laquelle créer le crud (Candidature).
- cette commande créera automatiquement les controlleurs et les vues (avec les formulaires) pour l'entité
3. Pour mettre en forme les formulaires, on va dans config/package/twig.yaml
- on ajoute :     ```form_themes: ['bootstrap_4_layout.html.twig']```

### Controllers
Dans notre cas, le controller et la vue ont été créés automatiquement avec la commande make:crud
Penser à modifier la route pour la page d'accueil :   
```@Route("/candidature")```devient : ```@Route("/")``` -->

## Développement Front-End

### Mise en place de Webpack Encore
- installation de Webpack Encore : ```composer require encore```
- installation des dépendances pour le front : ```npm install```

### Configuration de la page d'accueil
- Mise en place d'un controller nommé "AppController" : 
    - ```bin/console make:controller AppController```
    - route par défaut : ```"/"``` et non ```"/app"```
- dans fichier index.html.twig : 
    - modification des block body et title
    - liens vers les fichiers compilés app.js et app.css (renommés à chaque compilation) :
        - dans block stylesheets : ```{{ encore_entry_link_tags('app') }}```
        - dans block javascripts : ```{{ encore_entry_script_tags('app') }}```

### Mise en place de React
- Dans fichier webpack.config.js : on décommente la ligne 70 : ```.enableReactPreset()```
- Installation du preset react de Babel (pour traduire du jsx) : ```npm install @babel/preset-react@^7.0.0 --save-dev```
- Installations depuis le terminal :
    -  de la version 16.8.6 de react (version mieux maitriséé car vue en formation) :
    - de react-dom version 16.8.6
    - de react-router-dom version 5.0.0
    - de axios version 0.18.0
    - avec la commande :  ```npm install react@16.8.6 react-dom@16.8.6 react-router-dom@5.0.0 axios@0.18.0```

### structure des dossiers
Dans le dossier assets/js, on va créer 3 nouveaux dossiers :
- Components : pour nos composants React
    - Dans chaque composant React, on importera React et on créera un Stateless Function Component : une fonction qui retournera du code jsx (html + js)
- pages : pour nos pages
- services : pour les services qui seront éventuellement utilisés

### routes
__Dans le fichier app.js :__  
- Mise en place de HashRouter avec react-router-dom pour être toujours sur la même route gérée par le AppController
- Mise en place d'un Switch pour gérer différentes routes vers nos composants

### bootstrap :
- Utilisation du thème Bootswatch : Lumen
- Balises scripts depuis bootstrap et css depuis bootswatch

### Composants React si collage de code html
- fermeture des balises auto fermantes (img, input, etc...) : <input> => <input/>
- On remplace tous les attributs "class" en "className"

### Pagination
#### via React
Requête http avec tous les profils (non paginée par l'API) et pagination gérée avec un composant React
#### via API Platefom
Requêtes http partielles et paginées (si requêtes trop lourdes car bcp d'éléments à récupérer)

### Services
- On créé des services pour gérer les requêtes Http via axios :
    - requêtes GET vers tous les profils

### HomePage
#### Composants
HomePage.jsx
#### fonctions

### Inscription
#### Composants
#### fonctions

### Connexion
#### Composants
#### fonctions

### Page de Profil
#### Composants
#### fonctions

### Page de Recherche
#### Composants
#### fonctions

### Messagerie
#### Composants
#### fonctions

### Ergonomie
#### Notifications Flash
#### Placeholder de chargement
#### Cache ?


