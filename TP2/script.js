// script.js - Fichier principal pour la page index.html
// Initialisation de la liste des livres dans le localStorage si elle n'existe pas déjà
if (!localStorage.getItem('livres')) {
    localStorage.setItem('livres', JSON.stringify([]));
}

// Sélection des éléments DOM
const ajouterBtn = document.getElementById('ajouterBtn');
const afficherBtn = document.getElementById('afficherBtn');
const rechercherBtn = document.getElementById('rechercherBtn');
const supprimerBtn = document.getElementById('supprimerBtn');
const quitterBtn = document.getElementById('quitterBtn');
const livresList = document.getElementById('livresList');
const listeLivres = document.getElementById('listeLivres');

// Gestionnaire d'événement pour le bouton "Ajouter un livre"
ajouterBtn.addEventListener('click', () => {
    window.location.href = 'formulaire.html';
});

// Gestionnaire d'événement pour le bouton "Afficher tous les livres"
afficherBtn.addEventListener('click', () => {
    afficherLivres();
});

// Gestionnaire d'événement pour le bouton "Rechercher un livre par titre"
rechercherBtn.addEventListener('click', () => {
    window.location.href = 'recherche.html';
});

// Gestionnaire d'événement pour le bouton "Supprimer un livre"
supprimerBtn.addEventListener('click', () => {
    // On redirige vers la page de recherche avec un paramètre pour indiquer qu'on est en mode suppression
    window.location.href = 'recherche.html?mode=suppression';
});

// Gestionnaire d'événement pour le bouton "Quitter"
quitterBtn.addEventListener('click', () => {
    alert('Merci d\'avoir utilisé notre application de gestion de livres!');
    window.close();
});

// Fonction pour afficher tous les livres
function afficherLivres() {
    const livres = JSON.parse(localStorage.getItem('livres'));

    listeLivres.innerHTML = '';

    if (livres.length === 0) {
        listeLivres.innerHTML = '<li>Aucun livre enregistré.</li>';
    } else {
        // Afficher chaque livre
        livres.forEach(livre => {
            const li = document.createElement('li');
            li.textContent = livre;
            listeLivres.appendChild(li);
        });
    }

    livresList.style.display = 'block';
}