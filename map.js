// Initialize the map centered on Illinois with zoom level 7
const map = L.map('map').setView([40.6331, -89.3985], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Example Events - Add real events by populating this from the db
const events = [
    { name: "Scholarship Workshop", lat: 41.8818, lng: -87.6231, address: "Chicago, IL" },
    { name: "Career Fair", lat: 40.7608, lng: -89.6097, address: "Peoria, IL" },
    { name: "Tech Conference", lat: 39.7817, lng: -89.6501, address: "Springfield, IL" }
];

// Place a marker for each event
events.forEach(event => {
    const marker = L.marker([event.lat, event.lng]).addTo(map);
    marker.bindPopup(`<b>${event.name}</b><br>${event.address}`);
});

// Locate user's position and add a marker for the user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        const userMarker = L.marker(userCoords).addTo(map).bindPopup("You are here").openPopup();
        map.setView(userCoords, 7);
    }, () => {
        alert("Unable to retrieve your location.");
    });
} else {
    alert("Geolocation is not supported by your browser.");
}
