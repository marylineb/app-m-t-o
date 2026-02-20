# 🌦️ Application Météo — JavaScript & APIs

Mini-application météo développée en **HTML, CSS et JavaScript vanilla**, permettant de rechercher des villes, consulter la météo en temps réel et gérer une liste de favoris.

Le projet met l’accent sur la **structure du code**, la **gestion des états**, et la **bonne utilisation des APIs**.

---

## 🚀 Fonctionnalités

- 🔍 Recherche de villes (API adresse officielle française)
- 🌤️ Affichage de la météo en temps réel
- ⭐ Ajout / suppression de villes en favoris
- 🔄 Gestion des états :
  - Chargement
  - Erreurs (ville introuvable, problème réseau…)
  - Retry possible
- 📱 Interface responsive et lisible
- 🧠 Code structuré et modulaire

---

## 🧱 Architecture & rôles

Le projet est organisé selon une logique de **séparation des responsabilités**.

### 🅰️ Lead Dev Fonctionnel
- Gestion de la logique principale de l’application
- Orchestration des données (ville sélectionnée, favoris)
- Gestion des états (loading, error, empty)
- Modularisation du code

### 🅱️ UI / DOM
- Construction de l’interface dynamique
- Mise à jour du DOM selon les données météo
- Gestion des interactions utilisateur
- Responsive design & UX claire

### 🅲 APIs & Helpers
- Centralisation des appels API
- Gestion des erreurs réseau et réponses invalides
- Helpers utilitaires :
  - formatage des données
  - parsing des réponses
  - cache simple (localStorage)

---

## 🌍 APIs utilisées

### 📍 API Adresse (France)
Permet la recherche de villes à partir d’un texte.

