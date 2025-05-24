

const loginBtn = document.getElementById('login');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const loginContainer = document.getElementById('login-container');

let accessToken = null;

loginBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/login';
});

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value;
  if (!query) return;

  try {
    const res = await fetch(`http://localhost:3000/search?q=${query}&access_token=${accessToken}`);
    const data = await res.json();

    resultsList.innerHTML = '';
    data.tracks.items.forEach(track => {
      const li = document.createElement('li');
      li.classList.add('result-item');
      li.addEventListener('click', () => playTrack(track.uri));

      const img = document.createElement('img');
      img.src = track.album.images[2]?.url;
      img.alt = track.name;
      li.appendChild(img);

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
  } catch (err) {
    console.error("Error fetching search results:", err);
  }
});

async function playTrack(trackUri) {
  const trackId = trackUri.split(':')[2];
  try {
    // Slide vinyl into view first
    document.querySelector('.vinyl-container').classList.add('visible');

    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const trackData = await res.json();
    const albumArt = trackData.album.images[0].url;

    // Rest of your existing playTrack code
    document.getElementById('label').style.backgroundImage = `url(${albumArt})`;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = albumArt;
    img.onload = () => {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(img);
      document.body.style.backgroundColor = rgbToHex(r, g, b);
    };

    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
    iframe.width = 300;
    iframe.height = 380;
    iframe.frameBorder = 0;
    iframe.allow = 'encrypted-media';

    resultsList.innerHTML = '';
    resultsList.appendChild(iframe);
  } catch (err) {
    console.error("Error fetching track details:", err);
  }
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// grab token from URL
const params = new URLSearchParams(window.location.hash.replace('#', '?'));
accessToken = params.get('access_token');
if (accessToken) loginContainer.classList.add('hidden');

//Realistic-vinyl initialization 

document.addEventListener('DOMContentLoaded', () => {
  const groovesEl = document.getElementById('grooves');
  const labelEl = document.getElementById('label');
  const recordEl = document.getElementById('record');

  // fill these URLs with whatever label-art you like
  const covers = [
    'https://path/to/cover1.jpg',
    'https://path/to/cover2.jpg',
    'https://path/to/cover3.jpg',
  ];

  // relative inner-groove positions for track breaks
  const tracks = [0.1, 0.33, 0.42, 0.56, 0.78, 0.94];

  const start = labelEl.offsetWidth * 1.15;
  const end = recordEl.offsetWidth * 0.96;
  const inc = 6;
  const varian = 3;

  function random(n) { return Math.round(Math.random() * n); }

  // fine random grooves
  for (let size = start; size < end; size += inc + random(varian)) {
    const d = document.createElement('div');
    d.className = 'groove round centered';
    d.style.width = d.style.height = `${size}px`;
    groovesEl.appendChild(d);
  }

  // wider “track” grooves
  tracks.forEach(p => {
    const d = document.createElement('div');
    const size = start + (end - start) * p;
    d.className = 'groove round centered trackGroove';
    d.style.width = d.style.height = `${size}px`;
    groovesEl.appendChild(d);
  });

  // pick a random label art to start with
  const randomCover = covers[Math.floor(Math.random() * covers.length)];
  labelEl.style.backgroundImage = `url(${randomCover})`;
});








