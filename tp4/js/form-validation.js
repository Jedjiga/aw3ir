window.onload = function () {
  console.log("DOM ready!");
  displayContactList();

  // --- Événement du bouton GPS ---
  document.querySelector("#gps").addEventListener("click", function (e) {
    e.preventDefault();
    getLocation();
  });

  // --- Événement du bouton Reset ---
  document.querySelector("#reset").addEventListener("click", function () {
    contactStore.reset();
    displayContactList();
  });

  // --- Validation formulaire ---
  document.querySelector("#monFormulaire").addEventListener("submit", function (e) {
    e.preventDefault();
    const v = validateForm();

    if (v.isValid) {
      contactStore.add(v.nom, v.prenom, v.birthday, v.adresse, document.querySelector("#email").value);
      displayContactList();
      showSuccessModal(v.nom, v.prenom, v.birthday, v.ville);
    } else {
      showErrorModal(v.errorMessage);
    }
  });
};

// --- Fonction compteur de caractères ---
function calcNbChar(id) {
  const countElement = document.querySelector(`#${id}`).parentElement.querySelector("[data-count]");
  countElement.textContent = document.querySelector(`#${id}`).value.length + " car.";
}

// --- Validation formulaire ---
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

// --- Modals ---
function showErrorModal(msg) {
  document.querySelector(".modal-title").textContent = "Erreur dans le formulaire";
  document.querySelector("#modalBody").innerHTML = `<p>${msg}</p>`;
  new bootstrap.Modal(document.getElementById("myModal")).show();
}

function showSuccessModal(nom, prenom, dateNaissance, ville) {
  const date = new Date(dateNaissance);
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const dateFr = `${d}/${m}/${y}`;

  document.querySelector(".modal-title").textContent = "Bienvenue " + prenom;
  document.querySelector("#modalBody").innerHTML = `
    <p><strong>Vous êtes né(e) le ${dateFr}</strong></p>
    <p>et vous habitez <a href="https://maps.google.com/maps?q=${encodeURIComponent(ville)}" target="_blank">${ville}</a>.</p>
  `;
  new bootstrap.Modal(document.getElementById("myModal")).show();
}

// --- Affichage du tableau des contacts ---
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
