let map;
const markers = {}; // Markerları saklamak için bir obje
const initialPositions = {}; // İlk konumları saklamak için bir obje
const flightPaths = {}; // Her uçağın yolunu saklamak için bir obje

function initMap() {
  const center = { lat: 0, lng: 0 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: center,
  });
  updateAircraftLocations();
}

function updateAircraftLocations() {
  setInterval(getAircraftLocations, 1000); // Verileri her 1 saniyede bir güncelle
}

function getAircraftLocations() {
  fetch('http://localhost:8080/api/aircrafts')
    .then(response => response.json())
    .then(aircrafts => {
      aircrafts.forEach(aircraft => {
        const id = aircraft.hex; // Uçağın benzersiz bir identifier'ı varsayılıyor
        const newPosition = { lat: aircraft.lat, lng: aircraft.lon };
        let heading = aircraft.heading || 0; // Uçağın yönü

        if (heading === 0) {
          heading = Math.random() * 360; // Rastgele bir yön değeri oluştur
        }

        if (!flightPaths[id]) {
          flightPaths[id] = [newPosition];
        } else {
          const lastPosition = flightPaths[id][flightPaths[id].length - 1];
          if (newPosition.lat !== lastPosition.lat || newPosition.lng !== lastPosition.lng) {
            flightPaths[id].push(newPosition);
          }
        }

        const icon = getMarkerIcon(heading); // Aşağıda tanımlanacak olan fonksiyon

        if (markers[id]) {
          markers[id].setPosition(newPosition);
          markers[id].setIcon(icon);
          if (markers[id].line) {
            markers[id].line.setPath(flightPaths[id]);
          }
        } else {
          const marker = new google.maps.Marker({
            position: newPosition,
            map: map,
            title: aircraft.flight,
            icon: icon
          });

          setupMarker(marker, aircraft, id, newPosition);
          markers[id] = marker;
        }
      });

      Object.keys(markers).forEach(id => {
        if (!aircrafts.some(aircraft => aircraft.hex === id)) {
          markers[id].setMap(null);
          delete markers[id];
        }
      });
    })
    .catch(error => {
      console.error('Error fetching aircraft locations:', error);
    });
}

function setupMarker(marker, aircraft, id, newPosition) {
  const infowindow = new google.maps.InfoWindow({
    content: generateInfoContent(aircraft)
  });

  marker.addListener("mouseover", () => {
    infowindow.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    infowindow.close();
  });

  marker.addListener("click", () => {
    if (markers[id].line) {
      markers[id].line.setMap(null);
      delete markers[id].line;
    } else {
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
      };
      const line = new google.maps.Polyline({
        path: flightPaths[id],
        geodesic: true,
        strokeColor: "#000000",
        strokeOpacity: 0,
        strokeWeight: 4,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
      });
      line.setMap(map);
      markers[id].line = line;
    }
  });
}

function generateInfoContent(aircraft) {
  return '<div><strong>Uçuş Adı:</strong> ' + aircraft.flight + '</div>' +
    '<div><strong>İrtifa(feet):</strong> ' + aircraft.alt_geom + '</div>' +
    '<div><strong>Ucak Türü:</strong> ' + aircraft.t + '</div>' +
    '<div><strong>Uçağın kayıtlı ismi:</strong> ' + aircraft.r + '</div>' +
    '<div><strong>Hız:</strong> ' + aircraft.gs + '</div>';
}

function getMarkerIcon(rotation) {
  const scale = 0.5; // Önceden ayarladığın ölçeklendirme faktörü
  const anchorX = 50 * scale; // SVG'nin genişliğinin yarısı ölçeklendirildi
  const anchorY = 50 * scale; // SVG'nin yüksekliğinin yarısı ölçeklendirildi

  // Anchor değerlerini ince ayarla, bu örnek için varsayımsal değerlerdir.
  // Eğer ikon çizginin üstünde ise Y değerini azaltmayı deneyin.
  // Eğer ikon çizginin sağında ise X değerini azaltmayı deneyin.
  const adjustedAnchorX = anchorX - (scale * 2); // İkonun x koordinatını hafifçe sola çek
  const adjustedAnchorY = anchorY - (scale * 1); // İkonun y koordinatını hafifçe aşağı çek

  return {
    path: "M42 32v-4l-16-10v-11c0-1.66-1.34-3-3-3s-3 1.34-3 3v11l-16 10v4l16-5v11l-4 3v3l7-2 7 2v-3l-4-3v-11l16 5z",
    scale: scale,
    strokeColor: 'black',
    strokeWeight: 1,
    rotation: rotation,
    fillColor: '#0000FF',
    fillOpacity: 1.0,
    anchor: new google.maps.Point(adjustedAnchorX, adjustedAnchorY)
  };
}

window.onload = initMap;
