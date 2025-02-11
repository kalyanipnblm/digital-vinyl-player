// Get elements from the DOM
const loginBtn = document.getElementById('login');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');

let accessToken = null;

// Redirect to Spotify login
loginBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/login'; // Backend login URL
});

// Handle search
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value;
  if (!query) return;

  try {
    const response = await fetch(`http://localhost:3000/search?q=${query}&access_token=${accessToken}`); // Backend search URL
    const data = await response.json();

    resultsList.innerHTML = ''; // Clear previous results

    data.tracks.items.forEach(track => {
      const li = document.createElement('li');
      li.textContent = `${track.name} - ${track.artists[0].name}`;
      li.addEventListener('click', () => playTrack(track.uri));
      resultsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
});

// Play track
function playTrack(trackUri) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://open.spotify.com/embed/track/${trackUri.split(':')[2]}`;
  iframe.width = 300;
  iframe.height = 380;
  iframe.frameBorder = 0;
  iframe.allow = 'encrypted-media';

  resultsList.appendChild(iframe);
}

// Get access token from URL after login
const params = new URLSearchParams(window.location.hash.replace('#', '?'));
accessToken = params.get('access_token');

// Add vinyl rotation effect
const record = document.querySelector('.record');
let rotation = 0;

function rotateVinyl() {
  rotation += 1;
  record.style.transform = `rotate(${rotation}deg)`;
  requestAnimationFrame(rotateVinyl);
}

rotateVinyl();

