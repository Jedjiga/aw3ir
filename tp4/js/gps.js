function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "La géolocalisation n'est pas supportée par ce navigateur.";
  }
}

function showPosition(position) {
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);
  const bboxEdges = {
    south: position.coords.latitude - delta,
    north: position.coords.latitude + delta,
    west: position.coords.longitude - delta,
    east: position.coords.longitude + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${position.coords.latitude}%2C${position.coords.longitude}`;

  document.querySelector("#map").innerHTML = `
    <iframe width="100%" height="200" frameborder="0" scrolling="no" src="${iframeSrc}"></iframe>
  `;
}

function showError(error) {
  let msg = "Erreur de géolocalisation.";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = "L'utilisateur a refusé la demande de géolocalisation.";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Les informations de localisation ne sont pas disponibles.";
      break;
    case error.TIMEOUT:
      msg = "La demande de géolocalisation a expiré.";
      break;
  }
  document.querySelector("#map").innerHTML = msg;
}
