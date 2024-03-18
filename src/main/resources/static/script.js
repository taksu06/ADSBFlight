// Initialize and add the map
let map;

function initMap() {
  // The center of the world
  const center = { lat: 0, lng: 0 };

  // The map, centered at the center of the world
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2, // You may need to adjust the zoom level
    center: center,
  });

  // Get aircraft locations from Java code
  getAircraftLocations();
}

// Get aircraft locations from Java code
function getAircraftLocations() {
  fetch('http://localhost:8080/api/aircrafts')
    .then(response => response.json())
    .then(aircrafts => {
      // Uçakları haritaya eklemek için döngü
      aircrafts.forEach((aircraft) => {
        const marker = new google.maps.Marker({
          position: { lat: aircraft.lat, lng: aircraft.lon },
          map: map,
          title: aircraft.flight,
          icon: "https://maps.google.com/mapfiles/kml/shapes/airports.png" // Uçak simgesi

        });

        const infowindow = new google.maps.InfoWindow({
          content: '<div><strong>Uçuş Adı:</strong> ' + aircraft.flight + '</div><div><strong>İrtifa(feet):</strong> ' + aircraft.alt_geom + '</div><div><strong>Ucak Türü:</strong> ' + aircraft.t + '</div><div><strong>Uçağın kayıtlı ismi:</strong> ' + aircraft.r + '</div><div><strong>Hız:</strong> ' + aircraft.gs + '</div>'
        });

        // Marker'a mouse üzerine gelindiğinde bilgilerin görünmesi için bir event listener ekle
        marker.addListener("mouseover", () => {
          infowindow.open(map, marker);
        });

        // Mouse marker üzerinden ayrılınca bilgileri kapat
        marker.addListener("mouseout", () => {
          infowindow.close();
        });
      });
    })
    .catch(error => {
      console.error('Error fetching aircraft locations:', error);
    });
}
