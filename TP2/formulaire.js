// formulaire.js - Script pour la page formulaire.html
// Sélection du formulaire
const ajoutForm = document.getElementById('ajoutForm');

// Gestionnaire d'événement pour la soumission du formulaire
ajoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer la valeur du titre
    const titre = document.getElementById('titre').value.trim();

    // Vérifie que le titre n'est pas vide
    if (titre === '') {
        alert('Veuillez saisir un titre de livre.');
        return;
    }

    // Récupére la liste actuelle des livres
    const livres = JSON.parse(localStorage.getItem('livres')) || [];

    // Ajoute le nouveau livre à la liste
    livres.push(titre);

    // Sauvegarde la liste mise à jour
    localStorage.setItem('livres', JSON.stringify(livres));

    alert(`Le livre "${titre}" a été ajouté avec succès!`);

    ajoutForm.reset();

    window.location.href = 'index.html';
});