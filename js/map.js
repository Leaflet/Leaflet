var map = L.map('map').setView([28.7041,77.1025], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([28.7041,77.1025]).addTo(map)
		.bindPopup('Amol Jadhav<br> Currently sitting this very moment')
		.openPopup();	
