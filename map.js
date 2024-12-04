// Initialize the map centered on Illinois with zoom level 7
const map = L.map('map').setView([40.6331, -89.3985], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Example Events
const events = [
    { name: "Scholarship Workshop", lat: 41.8818, lng: -87.6231, address: "Chicago, IL" },
    { name: "Career Fair", lat: 40.7608, lng: -89.6097, address: "Peoria, IL" },
    { name: "Tech Conference", lat: 39.7817, lng: -89.6501, address: "Springfield, IL" }
];

// Place a marker for each event
const markers = events.map(event => {
    const marker = L.marker([event.lat, event.lng]).addTo(map);
    marker.bindPopup(`<b>${event.name}</b><br>${event.address}`);
    return { ...event, marker };
});

// Add a button to sort events by distance
const sortButton = document.createElement('button');
sortButton.textContent = "Sort Events by Distance";
sortButton.style.marginTop = "15px";
sortButton.style.padding = "10px";
sortButton.style.cursor = "pointer";
document.body.appendChild(sortButton);

// Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Locate user's position and sort events by proximity
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        const userMarker = L.marker(userCoords).addTo(map).bindPopup("You are here").openPopup();
        map.setView(userCoords, 7);

        sortButton.addEventListener('click', () => {
            const sortedEvents = markers.map(event => ({
                ...event,
                distance: calculateDistance(userCoords[0], userCoords[1], event.lat, event.lng)
            })).sort((a, b) => a.distance - b.distance);

            // Display sorted list
            const sortedList = document.createElement('ul');
            sortedList.style.listStyle = 'none';
            sortedList.style.padding = '10px';
            sortedList.innerHTML = '';
            document.body.appendChild(sortedList);

            sortedEvents.forEach(event => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${event.name}</strong> - ${event.address} (${event.distance.toFixed(2)} km)`;
                sortedList.appendChild(listItem);
                event.marker.bindPopup(`<b>${event.name}</b><br>${event.address}<br>Distance: ${event.distance.toFixed(2)} km`).openPopup();
            });
        });
    }, () => {
        alert("Unable to retrieve your location.");
    });
} else {
    alert("Geolocation is not supported by your browser.");
}
