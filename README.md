# **Projet Développement Mobile Cross-Plateforme**

_Création d'une messagerie en ligne_

### Sommaire

- [Mise en situation](https://github.com/UndefinedThing/LemonProject#mise-en-situation)
- [Objectif](https://github.com/UndefinedThing/LemonProject#objectif)
- [Cahier des charges](https://github.com/UndefinedThing/LemonProject#cahier-des-charges)
- [Ressources](https://github.com/UndefinedThing/LemonProject#ressources)
  - Technologies utilisées
  - Ressources Humaines allouées
  - Délais et livraison
- [Annexes](https://github.com/UndefinedThing/LemonProject#annexes)

---

## Mise en situation

Pendant notre cours de Développement Mobile Cross-Plateforme de notre troisième année chez Ynov Campus, nous avons eu besoin de trouver une application mobile à faire. Notre groupe de 4 étudiants a décidé de faire leur propre version d’une messagerie entre utilisateurs depuis leur mobile ou un navigateur. Cette application a pour but de nous faire pratiquer dans la technologie de IONIC et nous familiariser avec le développement pour mobile.

---

## Objectif

L'objectif de ce projet est de créer une application de messagerie afin que deux utilisateurs puissent, grâce à un simple accès à internet, échanger des messages de manière sécurisée à travers le monde. De plus, son ergonomie sera travaillée afin de faciliter sa prise en main et son utilisation par des utilisateurs de tout âges.

---

## Cahier des charges

### **Navigation** :

L'application se composera de 7 pages distinctes :

- Page d'authentification où de création de compte
- Liste des conversations
- Page d'une conversation
- Gestion des groupes
- Liste des contacts
- Profil de l'utilisateur
- Paramètres

### Fonctionnalités :

#### **Authentification / Création d'un compte** :

Cette page est la page d'accueil sur laquel l'utilisateur arrivera si il ne s'est pas connecté en choisissant l'option `Rester connecté`. Il aura donc deux choix : se connecter avec un compte précédemment créé, ou se créer un compte en entrant les informations ci-suivantes :

- Nom
- Prénom
- Photo de profil
- Email (qui sera à valider)
- Mot de passe (à écrire 2 fois afin d'éviter les fautes de frappe)

#### **Liste des convesations** :

Cette page sera la page d’accueil si l’utilisateur est déjà connecté. Elle liste toutes les conversations de groupes ou privées, de l’utilisateur par ordre chronologique (C'est à dire de la plus ancienne à la plus récente) et il suffira de cliquer sur une conversation afin d'y accéder. Par ailleurs, elle contiendra aussi le bouton `Profil` de l’utilisateur, un bouton `Paramètres` ainsi que liste des contacts.

#### **Page d'une conversation** :

Cette page montre tous les messages par ordre chronologique de l’utilisateur avec un contact ou un groupe de contacts. Un bouton permet d’accéder au profil du contact auquel on parle, ou aux contacts dans le groupe dans le cas d'une conversation de groupe. Un autre bouton permettra d’accéder aux paramètres de conversation ou de la conversation de groupe.

#### **Gestion des groupes / conversations** :

Cette page permet a l’utilisateur de créer une conversation de groupe avec son locuteur, si la conversation actuel est privée (La conversation privée entre l’utilisateur et le locuteur ne sera pas impactées, une nouvelle conversation sera crée). Elle permet aussi d’y ajouter des membre et d’en retirer.

#### **Liste de contact** :

Cette page liste les contacts de l’utilisateur, il pourra y supprimer ses contacts, ou en ajouter via une adresse mail ou une connexion RFID, activable grâce à un bouton.

#### **Profil de l'utilisateur** :

Tous les champs présents sur cette page devront être aisément modifiables. En voici une liste exhaustive :

- Photo de profil
- Nom
- Prénom
- Mail
- Accès au mot de passe (modification seulement)
- Déconnexion

#### **Paramètres** :

Cette page permet de gérer les différents paramètres de son application soit les notification, le mode d’affichage (dark ou light mode) ainsi que divers réglages.

---

## Ressources

### Technologies utilisées

L’application sera développée avec les framework Ionic, s'appuyant sur la bibliothèque React.

Le serveur ainsi que la base de données seront hébergés sur Firebase.

### Ressources humaines allouées

Au total 4 développeurs seront sur le projet :

- Un développeur sur le partie front de l’application,
- Un développeur sur la partie back de l’application,
- Deux développeur sur le serveur et la base de données.

### Délais et livraison

- L’application sera livré sous 5 semaines.

- Le projet sera disponible en intégralité sur le GitHub suivant : https://github.com/UndefinedThing/LemonProject

## Annexes

Ci-suivant quelques maquettes de l'application afin d'avoir une idée globale du projet et de l'aspect :
![Liste des conversations](https://github.com/UndefinedThing/LemonProject/tree/main/images/maquettes/iPhone_X-XS_conversation-list.png "Liste des conversations")
![Exemple d'une conversation](https://github.com/UndefinedThing/LemonProject/main/images/maquettes/iPhone_X-XS_conversation-example.png)
![Liste des groupes](https://github.com/UndefinedThing/LemonProject/images/maquettes/iPhone_X-XS_group-list.png)
![Détail d'un groupe](https://github.com/UndefinedThing/LemonProject/tree/main/images/maquettes/iPhone_X-XS_group-detail.png)
![Liste des contacts](https://github.com/UndefinedThing/LemonProject/tree/main/images/maquettes/iPhone_X-XS_contact-list.png)
![Profil de l'utilisateur connecté](https://github.com/UndefinedThing/LemonProject/tree/main/images/maquettes/iPhone_X-XS_users-profil.png)
