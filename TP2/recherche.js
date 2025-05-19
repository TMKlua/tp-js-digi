// recherche.js - Script pour la page recherche.html
// Sélection des éléments DOM
const rechercheInput = document.getElementById('recherche');
const listeResultats = document.getElementById('listeResultats');

// Vérifier si on est en mode suppression (via les paramètres de l'URL)
const urlParams = new URLSearchParams(window.location.search);
const modeSuppression = urlParams.get('mode') === 'suppression';

// Effectuer la recherche à chaque frappe de clavier
rechercheInput.addEventListener('input', () => {
    rechercherLivres();
});

// Fonction pour rechercher des livres
function rechercherLivres() {
    // Récupérer la valeur de recherche
    const recherche = rechercheInput.value.trim().toLowerCase();
    const livres = JSON.parse(localStorage.getItem('livres')) || [];
    const resultats = livres.filter(livre =>
        livre.toLowerCase().includes(recherche)
    );
    afficherResultats(resultats);
}

// Fonction pour afficher les résultats de la recherche
function afficherResultats(resultats) {
    listeResultats.innerHTML = '';

    if (resultats.length === 0) {
        listeResultats.innerHTML = '<li class="no-results">Aucun résultat trouvé</li>';
    } else {
        resultats.forEach(livre => {
            const li = document.createElement('li');
            li.className = 'resultat-item';

            const titreSpan = document.createElement('span');
            titreSpan.textContent = livre;
            li.appendChild(titreSpan);

            if (modeSuppression) {
                const supprimerBtn = document.createElement('button');
                supprimerBtn.textContent = 'Supprimer';
                supprimerBtn.className = 'supprimer-btn';
                supprimerBtn.addEventListener('click', () => {
                    supprimerLivre(livre);
                });
                li.appendChild(supprimerBtn);
            }

            listeResultats.appendChild(li);
        });
    }
}

// Fonction pour supprimer un livre
function supprimerLivre(titre) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${titre}" ?`)) {
        let livres = JSON.parse(localStorage.getItem('livres')) || [];

        livres = livres.filter(livre => livre !== titre);
        localStorage.setItem('livres', JSON.stringify(livres));

        alert(`Le livre "${titre}" a été supprimé avec succès!`);

        rechercherLivres();
    }
}

rechercherLivres();