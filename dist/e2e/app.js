var map = L.map('map').setView([51.505, -0.09], 13);

const marker = L.marker([51.5, -0.09]).addTo(map)
  .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  .openPopup();

console.log(marker);
