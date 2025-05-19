// Définition des classes

// Classe de base Livre
class Livre {
    constructor(titre, auteur, annee) {
        this.titre = titre;
        this.auteur = auteur;
        this.annee = parseInt(annee);
        this.id = Date.now() + '-' + Math.floor(Math.random() * 1000); // ID unique avec timestamp et nombre aléatoire
    }

    afficherInfos() {
        return `${this.titre} par ${this.auteur} (${this.annee})`;
    }
}

// Sous-classe LivreNumerique
class LivreNumerique extends Livre {
    constructor(titre, auteur, annee, tailleFichier) {
        super(titre, auteur, annee);
        this.tailleFichier = parseFloat(tailleFichier);
        this.type = 'numerique';
    }

    afficherInfos() {
        return `${super.afficherInfos()} - Format numérique (${this.tailleFichier} Mo)`;
    }
}

// Sous-classe LivrePapier
class LivrePapier extends Livre {
    constructor(titre, auteur, annee, nombrePages) {
        super(titre, auteur, annee);
        this.nombrePages = parseInt(nombrePages);
        this.type = 'papier';
    }

    afficherInfos() {
        return `${super.afficherInfos()} - Format papier (${this.nombrePages} pages)`;
    }
}

// Classe de base Utilisateur
class Utilisateur {
    constructor(nom) {
        this.nom = nom;
        this.idUtilisateur = Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    voirProfil() {
        return `Utilisateur: ${this.nom} (ID: ${this.idUtilisateur})`;
    }
}

// Sous-classe Membre
class Membre extends Utilisateur {
    constructor(nom) {
        super(nom);
        this.livresEmpruntes = [];
        this.type = 'membre';
    }

    emprunterLivre(livre) {
        if (!this.livresEmpruntes.some(l => l.id === livre.id)) {
            this.livresEmpruntes.push(livre);
            return true;
        }
        return false;
    }

    retournerLivre(idLivre) {
        const index = this.livresEmpruntes.findIndex(livre => livre.id === idLivre);
        if (index !== -1) {
            this.livresEmpruntes.splice(index, 1);
            return true;
        }
        return false;
    }

    voirProfil() {
        return `${super.voirProfil()} - Membre avec ${this.livresEmpruntes.length} livre(s) emprunté(s)`;
    }
}

// Sous-classe Bibliothecaire
class Bibliothecaire extends Utilisateur {
    constructor(nom) {
        super(nom);
        this.type = 'bibliothecaire';
    }

    ajouterLivre(livre, bibliotheque) {
        bibliotheque.push(livre);
        return livre;
    }

    supprimerLivre(idLivre, bibliotheque) {
        const index = bibliotheque.findIndex(livre => livre.id === idLivre);
        if (index !== -1) {
            bibliotheque.splice(index, 1);
            return true;
        }
        return false;
    }

    voirProfil() {
        return `${super.voirProfil()} - Bibliothécaire (autorisé à gérer la bibliothèque)`;
    }
}