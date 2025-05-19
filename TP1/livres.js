// Application de gestion de livres

// Création de la classe Livre
class Livre {
    constructor(titre, annee, auteur) {
        this.titre = titre;
        this.annee = annee;
        this.auteur = auteur;
    }

    // Méthode pour afficher les informations du livre
    afficherInformations() {
        return `Titre: ${this.titre}, Année: ${this.annee}, Auteur: ${this.auteur}`;
    }
}

// Tableau pour stocker les livres
let bibliotheque = [];

// Fonction principale
function gestionBibliotheque() {
    let continuer = true;

    while (continuer) {
        // Affichage du menu
        let choix = prompt(
            "=== GESTION DE BIBLIOTHÈQUE ===\n" +
            "1. Ajouter un livre\n" +
            "2. Afficher tous les livres\n" +
            "3. Rechercher un livre par titre\n" +
            "4. Supprimer un livre\n" +
            "5. Quitter\n\n" +
            "Entrez votre choix (1-5):"
        );

        try {
            // Conversion du choix en nombre
            choix = parseInt(choix);

            // Vérification du choix
            if (isNaN(choix) || choix < 1 || choix > 5) {
                throw new Error("Choix invalide. Veuillez entrer un nombre entre 1 et 5.");
            }

            // Traitement du choix
            switch (choix) {
                case 1:
                    ajouterLivre();
                    break;
                case 2:
                    afficherTousLesLivres();
                    break;
                case 3:
                    rechercherLivre();
                    break;
                case 4:
                    supprimerLivre();
                    break;
                case 5:
                    continuer = false;
                    alert("Merci d'avoir utilisé notre application. À bientôt !");
                    break;
            }
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }
}

// Fonction pour ajouter un livre
function ajouterLivre() {
    let continuerAjout = true;

    while (continuerAjout) {
        try {
            // Demande des informations du livre
            let titre = prompt("Entrez le titre du livre :");
            if (!titre) throw new Error("Le titre ne peut pas être vide.");

            let annee = prompt("Entrez l'année de publication :");
            annee = parseInt(annee);
            if (isNaN(annee) || annee < 0) throw new Error("L'année doit être un nombre positif.");

            let auteur = prompt("Entrez le nom de l'auteur :");
            if (!auteur) throw new Error("Le nom de l'auteur ne peut pas être vide.");

            // Création d'un nouvel objet Livre
            let nouveauLivre = new Livre(titre, annee, auteur);

            // Ajout du livre à la bibliothèque
            bibliotheque.push(nouveauLivre);

            alert(`Le livre "${titre}" a été ajouté avec succès !`);

            // Demander si l'utilisateur veut ajouter un autre livre
            let reponse = prompt("Voulez-vous ajouter un autre livre ? (oui/non)").toLowerCase();
            continuerAjout = (reponse === "oui" || reponse === "o");
        } catch (error) {
            alert("Erreur lors de l'ajout du livre : " + error.message);
            continuerAjout = false;
        }
    }
}

// Fonction pour afficher tous les livres
function afficherTousLesLivres() {
    if (bibliotheque.length === 0) {
        alert("La bibliothèque est vide.");
        return;
    }

    let listelivres = "=== LISTE DES LIVRES ===\n";

    for (let i = 0; i < bibliotheque.length; i++) {
        listelivres += (i + 1) + ". " + bibliotheque[i].afficherInformations() + "\n";
    }

    alert(listelivres);
}

// Fonction pour rechercher un livre par titre
function rechercherLivre() {
    if (bibliotheque.length === 0) {
        alert("La bibliothèque est vide.");
        return;
    }

    try {
        let titreRecherche = prompt("Entrez le titre du livre à rechercher :");
        if (!titreRecherche) throw new Error("Le titre ne peut pas être vide.");

        let livresTrouves = bibliotheque.filter(livre => livre.titre === titreRecherche);

        if (livresTrouves.length === 0) {
            alert(`Aucun livre avec le titre "${titreRecherche}" n'a été trouvé.`);
        } else {
            let resultat = `=== RÉSULTATS DE RECHERCHE ===\n`;
            for (let i = 0; i < livresTrouves.length; i++) {
                resultat += livresTrouves[i].afficherInformations() + "\n";
            }
            alert(resultat);
        }
    } catch (error) {
        alert("Erreur lors de la recherche : " + error.message);
    }
}

// Fonction pour supprimer un livre
function supprimerLivre() {
    if (bibliotheque.length === 0) {
        alert("La bibliothèque est vide.");
        return;
    }

    try {
        let titreASupprimer = prompt("Entrez le titre du livre à supprimer :");
        if (!titreASupprimer) throw new Error("Le titre ne peut pas être vide.");

        let longueurInitiale = bibliotheque.length;

        // Filtrer la bibliothèque pour garder tous les livres sauf celui à supprimer
        bibliotheque = bibliotheque.filter(livre => livre.titre !== titreASupprimer);

        if (bibliotheque.length === longueurInitiale) {
            alert(`Aucun livre avec le titre "${titreASupprimer}" n'a été trouvé.`);
        } else {
            alert(`Le livre "${titreASupprimer}" a été supprimé avec succès.`);
        }
    } catch (error) {
        alert("Erreur lors de la suppression : " + error.message);
    }
}

gestionBibliotheque();
