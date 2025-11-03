window.onload = function () {
    // Ce code est exécuté une fois que toute la page est téléchargée par le navigateur
    console.log("DOM ready!");

    // Fonction de validation d'email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Fonction pour formater la date en français
    function formatDate(dateString) {
        const date = new Date(dateString);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();
        return `${jour}/${mois}/${annee}`;
    }

    // Fonction pour afficher une modal d'erreur
    function showErrorModal(message) {
        document.querySelector(".modal-title").textContent = "Erreur dans le formulaire";
        document.querySelector("#modalBody").innerHTML = `<p>${message}</p>`;
        var myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
    }

    // Fonction pour afficher la modal de succès
    function showSuccessModal(nom, prenom, dateNaissance, ville) {
        const dateFormatee = formatDate(dateNaissance);
        
        document.querySelector(".modal-title").textContent = "Bienvenue " + prenom;
        document.querySelector("#modalBody").innerHTML = `
            <div class="text-center">
                <p><strong>Vous êtes nés le ${dateFormatee} et vous habitez</strong></p>
                <p>
                    <a href="http://maps.google.com/maps?q=${encodeURIComponent(ville)}" target="_blank">
                        ${ville}
                    </a>
                </p>
                <div class="mt-3 p-3 border rounded">
                    <p class="text-muted mb-0">
                        <small>
                            <i class="bi bi-info-circle"></i>
                            
                            Cliquez sur le nom de votre ville pour ouvrir Google Maps.
                        </small>
                    </p>
                </div>
            </div>
        `;
        var myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
    }

    // Fonction de validation du formulaire
    function validateForm() {
        let isValid = true;
        let errorMessage = "";

        // Réinitialiser les styles d'erreur
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Validation du nom (5 caractères minimum)
        const nom = document.getElementById("nom").value.trim();
        if (nom.length < 5) {
            document.getElementById("nom").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "Le nom doit contenir au moins 5 caractères";
        }

        // Validation du prénom (5 caractères minimum)
        const prenom = document.getElementById("prenom").value.trim();
        if (prenom.length < 5) {
            document.getElementById("prenom").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "Le prénom doit contenir au moins 5 caractères";
        }

        // Validation de la date de naissance
        const birthday = document.getElementById("naissance").value;
        const birthdayDate = new Date(birthday);
        const birthdayTimestamp = birthdayDate.getTime();
        const nowTimestamp = Date.now();

        if (!birthday || birthdayTimestamp > nowTimestamp) {
            document.getElementById("naissance").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "La date de naissance ne peut pas être dans le futur";
        }

        // Validation de l'adresse (5 caractères minimum)
        const adresse = document.getElementById("adresse").value.trim();
        if (adresse.length < 5) {
            document.getElementById("adresse").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "L'adresse doit contenir au moins 5 caractères";
        }

        // Validation de la ville (2 caractères minimum)
        const ville = document.getElementById("ville").value.trim();
        if (ville.length < 2) {
            document.getElementById("ville").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "La ville doit contenir au moins 2 caractères";
        }

        // Validation de l'email
        const email = document.getElementById("email").value.trim();
        if (!validateEmail(email)) {
            document.getElementById("email").classList.add('is-invalid');
            isValid = false;
            if (!errorMessage) errorMessage = "Veuillez saisir une adresse email valide";
        }

        // Vérification des champs vides
        const fields = [
            { value: nom, name: "nom" },
            { value: prenom, name: "prénom" },
            { value: birthday, name: "date de naissance" },
            { value: adresse, name: "adresse" },
            { value: ville, name: "ville" },
            { value: email, name: "email" }
        ];

        for (let field of fields) {
            if (!field.value) {
                isValid = false;
                errorMessage = "Tous les champs sont obligatoires";
                break;
            }
        }

        return { 
            isValid, 
            errorMessage,
            nom,
            prenom,
            birthday,
            ville
        };
    }

    // Interception de la soumission du formulaire
    document.querySelector("#monFormulaire").addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("form submitted!");

        const validation = validateForm();

        if (validation.isValid) {
            showSuccessModal(
                validation.nom, 
                validation.prenom, 
                validation.birthday, 
                validation.ville
            );
        } else {
            showErrorModal(validation.errorMessage);
        }
    });
};