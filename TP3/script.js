// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    let bibliotheque = [];
    let utilisateurs = [];
    let utilisateurActuel = null;

    // Éléments DOM
    const bibliothecaireBtn = document.getElementById('bibliothecaireBtn');
    const membreBtn = document.getElementById('membreBtn');
    const ajouterBtn = document.getElementById('ajouterBtn');
    const afficherBtn = document.getElementById('afficherBtn');
    const rechercherBtn = document.getElementById('rechercherBtn');
    const supprimerBtn = document.getElementById('supprimerBtn');
    const voirProfilBtn = document.getElementById('voirProfilBtn');
    const voirEmpruntsBtn = document.getElementById('voirEmpruntsBtn');
    const quitterBtn = document.getElementById('quitterBtn');
    const livresList = document.getElementById('livresList');
    const profilUtilisateur = document.getElementById('profilUtilisateur');
    const livresEmpruntes = document.getElementById('livresEmpruntes');
    const listeLivres = document.getElementById('listeLivres');
    const infoUtilisateur = document.getElementById('infoUtilisateur');
    const listeEmprunts = document.getElementById('listeEmprunts');

    // Création des utilisateurs par défaut
    const bibliothecaire = new Bibliothecaire("Admin Bibliothécaire");
    const membre = new Membre("Lecteur Standard");
    utilisateurs.push(bibliothecaire, membre);

    // Par défaut, l'utilisateur est le bibliothécaire
    utilisateurActuel = bibliothecaire;

    // Chargement des données depuis le localStorage
    chargerDonnees();

    // Fonction pour changer d'utilisateur
    function changerUtilisateur(type) {
        if (type === 'bibliothecaire') {
            utilisateurActuel = utilisateurs.find(u => u.type === 'bibliothecaire');
            bibliothecaireBtn.classList.add('active-user');
            membreBtn.classList.remove('active-user');
        } else {
            utilisateurActuel = utilisateurs.find(u => u.type === 'membre');
            membreBtn.classList.add('active-user');
            bibliothecaireBtn.classList.remove('active-user');
        }

        // Mise à jour de l'interface selon le type d'utilisateur
        ajouterBtn.disabled = utilisateurActuel.type !== 'bibliothecaire';
        supprimerBtn.disabled = utilisateurActuel.type !== 'bibliothecaire';

        // Cacher toutes les sections
        livresList.style.display = 'none';
        profilUtilisateur.style.display = 'none';
        livresEmpruntes.style.display = 'none';
    }

    // Événements pour les boutons d'utilisateur
    bibliothecaireBtn.addEventListener('click', () => changerUtilisateur('bibliothecaire'));
    membreBtn.addEventListener('click', () => changerUtilisateur('membre'));

    // Fonction pour ajouter un livre (pour le bibliothécaire)
    ajouterBtn.addEventListener('click', function() {
        if (utilisateurActuel.type !== 'bibliothecaire') {
            alert("Seul un bibliothécaire peut ajouter des livres.");
            return;
        }

        // Demander les informations du livre
        const titre = prompt("Entrez le titre du livre:");
        if (!titre) return;

        const auteur = prompt("Entrez l'auteur du livre:");
        if (!auteur) return;

        const annee = prompt("Entrez l'année de publication:");
        if (!annee || isNaN(annee)) return;

        const typeLivre = prompt("Entrez le type de livre (numerique ou papier):");
        if (!typeLivre || (typeLivre !== 'numerique' && typeLivre !== 'papier')) return;

        let livre;
        if (typeLivre === 'numerique') {
            const tailleFichier = prompt("Entrez la taille du fichier en Mo:");
            if (!tailleFichier || isNaN(tailleFichier)) return;
            livre = new LivreNumerique(titre, auteur, annee, tailleFichier);
        } else {
            const nombrePages = prompt("Entrez le nombre de pages:");
            if (!nombrePages || isNaN(nombrePages)) return;
            livre = new LivrePapier(titre, auteur, annee, nombrePages);
        }

        utilisateurActuel.ajouterLivre(livre, bibliotheque);
        sauvegarderDonnees();
        alert(`Le livre "${livre.titre}" a été ajouté avec succès.`);

        afficherTousLesLivres();
    });

    // Fonction pour afficher tous les livres
    afficherBtn.addEventListener('click', afficherTousLesLivres);

    function afficherTousLesLivres() {
        profilUtilisateur.style.display = 'none';
        livresEmpruntes.style.display = 'none';

        livresList.style.display = 'block';

        listeLivres.innerHTML = '';

        if (bibliotheque.length === 0) {
            listeLivres.innerHTML = '<p>Aucun livre dans la bibliothèque.</p>';
            return;
        }

        // Afficher chaque livre
        bibliotheque.forEach(livre => {
            const livreElement = document.createElement('div');
            livreElement.className = 'livre-item';

            livreElement.innerHTML = `<h3>${livre.titre}</h3>
                                     <p>${livre.afficherInfos()}</p>`;

            // Ajouter bouton d'emprunt pour les membres
            if (utilisateurActuel.type === 'membre') {
                const dejaEmprunte = utilisateurActuel.livresEmpruntes.some(l => l.id === livre.id);

                if (!dejaEmprunte) {
                    const emprunterBtn = document.createElement('button');
                    emprunterBtn.textContent = 'Emprunter';
                    emprunterBtn.className = 'emprunter-btn';
                    emprunterBtn.addEventListener('click', function() {
                        emprunterLivre(livre);
                    });
                    livreElement.appendChild(emprunterBtn);
                } else {
                    const infoEmprunte = document.createElement('p');
                    infoEmprunte.textContent = '(Déjà emprunté)';
                    infoEmprunte.style.fontStyle = 'italic';
                    livreElement.appendChild(infoEmprunte);
                }
            }

            // Ajouter bouton de suppression pour le bibliothécaire
            if (utilisateurActuel.type === 'bibliothecaire') {
                const supprimerBtn = document.createElement('button');
                supprimerBtn.textContent = 'Supprimer';
                supprimerBtn.className = 'delete-btn';
                supprimerBtn.addEventListener('click', function() {
                    supprimerLivre(livre.id);
                });
                livreElement.appendChild(supprimerBtn);
            }

            listeLivres.appendChild(livreElement);
        });
    }

    // Fonction pour rechercher un livre
    rechercherBtn.addEventListener('click', function() {
        const terme = prompt("Entrez le titre du livre à rechercher:");
        if (!terme) return;

        profilUtilisateur.style.display = 'none';
        livresEmpruntes.style.display = 'none';

        livresList.style.display = 'block';

        listeLivres.innerHTML = '';

        const resultats = bibliotheque.filter(livre =>
            livre.titre.toLowerCase().includes(terme.toLowerCase())
        );

        if (resultats.length === 0) {
            listeLivres.innerHTML = '<p>Aucun livre trouvé avec ce titre.</p>';
            return;
        }

        // Afficher les résultats
        resultats.forEach(livre => {
            const livreElement = document.createElement('div');
            livreElement.className = 'livre-item';

            livreElement.innerHTML = `<h3>${livre.titre}</h3>
                                     <p>${livre.afficherInfos()}</p>`;

            // Ajouter bouton d'emprunt pour les membres
            if (utilisateurActuel.type === 'membre') {
                const dejaEmprunte = utilisateurActuel.livresEmpruntes.some(l => l.id === livre.id);

                if (!dejaEmprunte) {
                    const emprunterBtn = document.createElement('button');
                    emprunterBtn.textContent = 'Emprunter';
                    emprunterBtn.className = 'emprunter-btn';
                    emprunterBtn.addEventListener('click', function() {
                        emprunterLivre(livre);
                    });
                    livreElement.appendChild(emprunterBtn);
                } else {
                    const infoEmprunte = document.createElement('p');
                    infoEmprunte.textContent = '(Déjà emprunté)';
                    infoEmprunte.style.fontStyle = 'italic';
                    livreElement.appendChild(infoEmprunte);
                }
            }

            listeLivres.appendChild(livreElement);
        });
    });

    // Fonction pour supprimer un livre (pour le bibliothécaire)
    supprimerBtn.addEventListener('click', function() {
        if (utilisateurActuel.type !== 'bibliothecaire') {
            alert("Seul un bibliothécaire peut supprimer des livres.");
            return;
        }

        if (bibliotheque.length === 0) {
            alert("La bibliothèque est vide.");
            return;
        }

        // Afficher les livres pour sélection
        let listeString = "Livres disponibles (entrez le numéro):\n";
        bibliotheque.forEach((livre, index) => {
            listeString += `${index + 1}. ${livre.titre}\n`;
        });

        const selection = prompt(listeString);
        if (!selection || isNaN(selection) || selection < 1 || selection > bibliotheque.length) {
            alert("Sélection invalide.");
            return;
        }

        const index = parseInt(selection) - 1;
        const livreASupprimer = bibliotheque[index];

        // Supprimer le livre
        utilisateurActuel.supprimerLivre(livreASupprimer.id, bibliotheque);
        sauvegarderDonnees();
        alert(`Le livre "${livreASupprimer.titre}" a été supprimé.`);

        // Mettre à jour l'affichage
        afficherTousLesLivres();
    });

    // Fonction pour voir le profil de l'utilisateur
    voirProfilBtn.addEventListener('click', function() {
        // Cacher les autres sections
        livresList.style.display = 'none';
        livresEmpruntes.style.display = 'none';

        // Afficher la section du profil
        profilUtilisateur.style.display = 'block';

        // Afficher les informations de l'utilisateur
        infoUtilisateur.innerHTML = `
            <h3>${utilisateurActuel.nom}</h3>
            <p>${utilisateurActuel.voirProfil()}</p>
        `;
    });

    // Fonction pour voir les livres empruntés (pour le membre)
    voirEmpruntsBtn.addEventListener('click', function() {
        if (utilisateurActuel.type !== 'membre') {
            alert("Seul un membre peut voir ses emprunts.");
            return;
        }

        livresList.style.display = 'none';
        profilUtilisateur.style.display = 'none';

        livresEmpruntes.style.display = 'block';

        listeEmprunts.innerHTML = '';

        if (utilisateurActuel.livresEmpruntes.length === 0) {
            listeEmprunts.innerHTML = '<p>Vous n\'avez aucun livre emprunté.</p>';
            return;
        }

        // Afficher chaque livre emprunté
        utilisateurActuel.livresEmpruntes.forEach(livre => {
            const livreElement = document.createElement('div');
            livreElement.className = 'livre-item';

            livreElement.innerHTML = `<h3>${livre.titre}</h3>
                                     <p>${livre.afficherInfos()}</p>`;

            const retournerBtn = document.createElement('button');
            retournerBtn.textContent = 'Retourner';
            retournerBtn.addEventListener('click', function() {
                retournerLivre(livre.id);
            });
            livreElement.appendChild(retournerBtn);

            listeEmprunts.appendChild(livreElement);
        });
    });

    // Fonction pour emprunter un livre
    function emprunterLivre(livre) {
        if (utilisateurActuel.type !== 'membre') {
            alert("Seul un membre peut emprunter un livre.");
            return;
        }

        const resultat = utilisateurActuel.emprunterLivre(livre);

        if (resultat) {
            alert(`Vous avez emprunté le livre "${livre.titre}".`);
            sauvegarderDonnees();
            afficherTousLesLivres();
        } else {
            alert("Vous avez déjà emprunté ce livre.");
        }
    }

    // Fonction pour retourner un livre
    function retournerLivre(idLivre) {
        if (utilisateurActuel.type !== 'membre') {
            alert("Seul un membre peut retourner un livre.");
            return;
        }

        const resultat = utilisateurActuel.retournerLivre(idLivre);

        if (resultat) {
            alert("Livre retourné avec succès.");
            sauvegarderDonnees();

            voirEmpruntsBtn.click();
        } else {
            alert("Erreur lors du retour du livre.");
        }
    }

    // Fonction pour supprimer un livre par ID
    function supprimerLivre(idLivre) {
        if (utilisateurActuel.type !== 'bibliothecaire') {
            alert("Seul un bibliothécaire peut supprimer des livres.");
            return;
        }

        // Vérifier si des membres ont emprunté ce livre
        utilisateurs.forEach(utilisateur => {
            if (utilisateur.type === 'membre') {
                utilisateur.retournerLivre(idLivre);
            }
        });

        // Supprimer le livre
        const resultat = utilisateurActuel.supprimerLivre(idLivre, bibliotheque);

        if (resultat) {
            alert("Livre supprimé avec succès.");
            sauvegarderDonnees();
            afficherTousLesLivres();
        } else {
            alert("Erreur lors de la suppression du livre.");
        }
    }

    // Fonction pour quitter l'application
    quitterBtn.addEventListener('click', function() {
        if (confirm("Voulez-vous vraiment quitter l'application?")) {
            alert("Merci d'avoir utilisé notre application. À bientôt!");
        }
    });

    // Fonction pour sauvegarder les données dans localStorage
    function sauvegarderDonnees() {
        // Sauvegarder la bibliothèque et les users
        localStorage.setItem('bibliotheque', JSON.stringify(bibliotheque));
        localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
    }

    // Fonction pour charger les données depuis localStorage
    function chargerDonnees() {
        const bibliothequeJSON = localStorage.getItem('bibliotheque');
        if (bibliothequeJSON) {
            try {
                const livresObj = JSON.parse(bibliothequeJSON);
                bibliotheque = livresObj.map(obj => {
                    if (obj.type === 'numerique') {
                        return Object.assign(new LivreNumerique(obj.titre, obj.auteur, obj.annee, obj.tailleFichier), obj);
                    } else if (obj.type === 'papier') {
                        return Object.assign(new LivrePapier(obj.titre, obj.auteur, obj.annee, obj.nombrePages), obj);
                    } else {
                        return Object.assign(new Livre(obj.titre, obj.auteur, obj.annee), obj);
                    }
                });
            } catch (e) {
                console.error("Erreur lors du chargement de la bibliothèque:", e);
                bibliotheque = [];
            }
        }

        // Charger les utilisateurs
        const utilisateursJSON = localStorage.getItem('utilisateurs');
        if (utilisateursJSON) {
            try {
                const utilisateursObj = JSON.parse(utilisateursJSON);
                utilisateurs = utilisateursObj.map(obj => {
                    if (obj.type === 'bibliothecaire') {
                        return Object.assign(new Bibliothecaire(obj.nom), obj);
                    } else if (obj.type === 'membre') {
                        const membre = new Membre(obj.nom);

                        // Traitement spécial pour les livres empruntés
                        if (obj.livresEmpruntes && Array.isArray(obj.livresEmpruntes)) {
                            membre.livresEmpruntes = obj.livresEmpruntes.map(livreObj => {
                                if (livreObj.type === 'numerique') {
                                    return Object.assign(new LivreNumerique(livreObj.titre, livreObj.auteur, livreObj.annee, livreObj.tailleFichier), livreObj);
                                } else if (livreObj.type === 'papier') {
                                    return Object.assign(new LivrePapier(livreObj.titre, livreObj.auteur, livreObj.annee, livreObj.nombrePages), livreObj);
                                } else {
                                    return Object.assign(new Livre(livreObj.titre, livreObj.auteur, livreObj.annee), livreObj);
                                }
                            });
                        }

                        return membre;
                    } else {
                        return Object.assign(new Utilisateur(obj.nom), obj);
                    }
                });

                // Définir l'utilisateur actuel comme le bibliothécaire par défaut
                utilisateurActuel = utilisateurs.find(u => u.type === 'bibliothecaire') || bibliothecaire;
            } catch (e) {
                console.error("Erreur lors du chargement des utilisateurs:", e);
                utilisateurs = [bibliothecaire, membre];
                utilisateurActuel = bibliothecaire;
            }
        }

        // Ajouter des livres de test si la bibliothèque est vide
        if (bibliotheque.length === 0) {
            const livre1 = new LivreNumerique('Le Petit Prince', 'Antoine de Saint-Exupéry', 1943, 2.5);
            const livre2 = new LivrePapier('Harry Potter à l\'école des sorciers', 'J.K. Rowling', 1997, 309);

            bibliotheque.push(livre1, livre2);
            sauvegarderDonnees();
        }
    }

    changerUtilisateur('bibliothecaire');
});