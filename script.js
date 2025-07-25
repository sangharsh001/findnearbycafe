const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const locateBtn = document.getElementById('locate-btn');
const networkStatus = document.getElementById('network-status');
const cafesList = document.getElementById('cafes');

let cafes = []; // Will be filled from JSON

// Fetch cafés from local JSON file
fetch('assets/cafes.json')
  .then(response => response.json())
  .then(data => {
    cafes = data;
  })
  .catch(error => console.error("Failed to load cafes.json:", error));

// Monitor network info
function checkNetwork() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    if (connection.effectiveType.includes('2g') || connection.effectiveType.includes('slow-2g')) {
      networkStatus.textContent = '⚠️ You are on a slow network.';
    } else {
      networkStatus.textContent = '✅ Network looks good!';
    }
  } else {
    networkStatus.textContent = 'Network information not available.';
  }
}

// Draw map and cafes
function drawMap(userLat, userLng) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e0f7fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw user location
  ctx.beginPath();
  ctx.arc(250, 200, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.fillText("You", 260, 200);

  // Display cafes
  cafesList.innerHTML = '';
  cafes.forEach((cafe, index) => {
    const x = 250 + (cafe.lng - userLng) * 10000;
    const y = 200 - (cafe.lat - userLat) * 10000;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.fillText(cafe.name, x + 10, y);

    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${cafe.name}`;
    cafesList.appendChild(li);
  });
}

// Geolocation
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      drawMap(latitude, longitude);
    },
    error => {
      alert("Failed to retrieve location.");
      console.error(error);
    }
  );
});

// On page load
checkNetwork();
window.addEventListener('load', () => {
  if (navigator.onLine) {
    networkStatus.textContent = '✅ You are online.';
  } else {
    networkStatus.textContent = '⚠️ You are offline.';
  }
});
