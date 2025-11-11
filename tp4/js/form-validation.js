window.onload = function () {
  console.log("DOM ready!");
  displayContactList();

  // Bouton GPS
  document.querySelector("#gps").addEventListener("click", e => {
    e.preventDefault();
    getLocation();
  });

  // Bouton Reset
  document.querySelector("#reset").addEventListener("click", () => {
    contactStore.reset();
    displayContactList();
  });

  // Validation du formulaire
  document.querySelector("#monFormulaire").addEventListener("submit", e => {
    e.preventDefault();
    const v = validateForm();

    if (v.isValid) {
      contactStore.add(
        v.nom,
        v.prenom,
        v.birthday,
        v.adresse,
        document.querySelector("#email").value
      );
      displayContactList();

      //  Afficher message de succès
      const msg = document.querySelector("#messageSuccess");
      msg.classList.remove("d-none");
      msg.textContent = "Contact ajouté avec succès.";

      // Masquer après 3 secondes
      setTimeout(() => msg.classList.add("d-none"), 3000);

      //  Réinitialiser formulaire et compteurs
      document.querySelector("#monFormulaire").reset();
      document.querySelectorAll("[data-count]").forEach(el => (el.textContent = "0 car."));
    } else {
      // Afficher une alerte simple (sans modal)
      alert("Erreur : " + v.errorMessage);
    }
  });
};

// --- Compteur de caractères ---
function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  const countElement =
    input.parentElement.querySelector("[data-count]") ||
    input.closest(".mb-3").querySelector("[data-count]");
  countElement.textContent = input.value.length + " car.";
}

// --- Validation du formulaire ---
function validateForm() {
  let isValid = true;
  let errorMessage = "";

  const fields = ["nom", "prenom", "naissance", "adresse", "ville", "email"];
  fields.forEach(f => document.getElementById(f).classList.remove("is-invalid"));

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const birthday = document.getElementById("naissance").value;
  const adresse = document.getElementById("adresse").value.trim();
  const ville = document.getElementById("ville").value.trim();
  const email = document.getElementById("email").value.trim();

  if (nom.length < 5) { isValid = false; document.getElementById("nom").classList.add("is-invalid"); errorMessage ||= "Le nom doit contenir au moins 5 caractères"; }
  if (prenom.length < 5) { isValid = false; document.getElementById("prenom").classList.add("is-invalid"); errorMessage ||= "Le prénom doit contenir au moins 5 caractères"; }
  if (!birthday || new Date(birthday) > new Date()) { isValid = false; document.getElementById("naissance").classList.add("is-invalid"); errorMessage ||= "La date de naissance ne peut pas être dans le futur"; }
  if (adresse.length < 5) { isValid = false; document.getElementById("adresse").classList.add("is-invalid"); errorMessage ||= "L'adresse doit contenir au moins 5 caractères"; }
  if (ville.length < 2) { isValid = false; document.getElementById("ville").classList.add("is-invalid"); errorMessage ||= "La ville doit contenir au moins 2 caractères"; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { isValid = false; document.getElementById("email").classList.add("is-invalid"); errorMessage ||= "Veuillez saisir une adresse email valide"; }

  return { isValid, errorMessage, nom, prenom, birthday, adresse, ville };
}

// --- Afficher la liste des contacts ---
function displayContactList() {
  const list = contactStore.getList();
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  for (const c of list) {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.firstname}</td>
        <td>${c.date}</td>
        <td><a href="https://maps.google.com/maps?q=${encodeURIComponent(c.adress)}" target="_blank">${c.adress}</a></td>
        <td><a href="mailto:${c.mail}">${c.mail}</a></td>
      </tr>`;
  }
}
