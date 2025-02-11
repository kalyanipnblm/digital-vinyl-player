const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Enable CORS for frontend (http://localhost:5500)
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));

app.use(express.json());

// Add this route to check if the backend is running
app.get('/', (req, res) => {
  res.send('🎵 Spotify Backend is Running!');
});

// Redirect to Spotify login
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-read-playback-state';
  const authURL = `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}`;

  // Log the redirect URL for debugging
  console.log('Redirect URL:', authURL);

  // Redirect to Spotify login
  res.redirect(authURL);
});

// Handle callback from Spotify
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.REDIRECT_URI,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    res.redirect(`http://127.0.0.1:5500/frontend/#access_token=${access_token}`);

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send('Authentication failed');
  }
});

// Search music using Spotify API
app.get('/search', async (req, res) => {
  const { q, access_token } = req.query;

  if (!access_token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q, type: 'track', limit: 10 },
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

