const loginBtn = document.getElementById('login');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const loginContainer = document.getElementById('login-container'); // Get the login container

let accessToken = null;

// Redirect to Spotify login
loginBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/login';
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
      li.classList.add('result-item');
      li.addEventListener('click', () => playTrack(track.uri));

      // album art
      const img = document.createElement('img');
      img.src = track.album.images[2]?.url;        // small thumb
      img.alt = track.name;
      li.appendChild(img);

      // info container
      const info = document.createElement('div');
      info.classList.add('track-info');

      const title = document.createElement('div');
      title.classList.add('track-title');
      title.textContent = track.name;
      info.appendChild(title);

      const artist = document.createElement('div');
      artist.classList.add('track-artist');
      artist.textContent = track.artists.map(a => a.name).join(', ');
      info.appendChild(artist);

      li.appendChild(info);
      resultsList.appendChild(li);
    });

  } catch (error) {
    console.error("Error fetching search results:", error);
  }
});

// Play track and update background color
async function playTrack(trackUri) {
  const trackId = trackUri.split(':')[2];

  // Fetch track details to get the album art URL
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const trackData = await response.json();

    // Get the album art URL
    const albumArtUrl = trackData.album.images[0].url; // Use the highest resolution image

    // Load the album art image
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Allow cross-origin access for the image
    img.src = albumArtUrl;

    img.onload = () => {
      // Extract the dominant color using Color Thief
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);

      // Convert RGB to HEX
      const hexColor = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

      // Update the background color of the body
      document.body.style.backgroundColor = hexColor;
    };

    // Embed the Spotify player
    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
    iframe.width = 300;
    iframe.height = 380;
    iframe.frameBorder = 0;
    iframe.allow = 'encrypted-media';

    // Clear previous results
    resultsList.innerHTML = '';
    resultsList.appendChild(iframe);
  } catch (error) {
    console.error("Error fetching track details:", error);
  }
}

// Helper function to convert RGB to HEX
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Get access token from URL after login
const params = new URLSearchParams(window.location.hash.replace('#', '?'));
accessToken = params.get('access_token');

// Hide the login container after logging in
if (accessToken) {
  loginContainer.classList.add('hidden');
}

// Add vinyl rotation effect
const record = document.querySelector('.record');
let rotation = 0;

function rotateVinyl() {
  rotation += 1;
  record.style.transform = `rotate(${rotation}deg)`;
  requestAnimationFrame(rotateVinyl);
}

rotateVinyl();




