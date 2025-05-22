#  Digital Vinyl – Interactive Music Player with Spotify API

A **Digital Vinyl Player** is a web application that lets you search, preview, and play your favorite Spotify tracks on a realistic vinyl-record animation, complete with dynamic background theming based on album art.

---

## Features

- **Spotify OAuth Login**: Securely authenticate with your Spotify account.
- **Track Search**: Search for tracks by keyword (powered by Spotify Web API).
- **Vinyl Animation**: Realistic vinyl record with grooves, spinning and wobbling animations.
- **Dynamic Theming**: Background color adapts to the dominant color of the album art (via ColorThief).
- **Embedded Playback**: Preview tracks using the Spotify embedded player.

---
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- A **Spotify Developer** account
- (Optional) A static server for frontend (e.g., VSCode Live Server, `serve`, or similar)

### 1. Register a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a new application.
3. Add the following Redirect URI:
   - `http://localhost:3000/callback`
4. Copy your **Client ID** and **Client Secret**.

### 2. Clone this Repository

```bash
git clone https://github.com/your-username/digital-vinyl-player.git
cd digital-vinyl-player
```
### 3. Configure Backend

#### 1. Navigate to the backend folder:

```bash
cd backend
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Create a .env file with the following content:

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:3000/callback
```

#### 4. Start the backend server:

```bash
npm start
```

The backend will run on http://localhost:3000/ and expose routes for Spotify login, callback, and search.

### 4. Serve the Frontend

#### 1. From the project root, open the frontend folder in your editor or terminal.

#### 2. Serve index.html on a static server at http://127.0.0.1:5501/ (or similar).

- VSCode Live Server: Right-click index.html → "Open with Live Server".

- npm serve:
```bash
npx serve frontend -l 5501
```

#### 3. Open your browser and visit http://127.0.0.1:5501/.

### 5.  Use the App

#### 1. Click Login to Spotify and grant permissions.
#### 2. Enter a search term and click the Search icon.
#### 3. Browse results and click a track card to load the vinyl animation and play a preview.

## Project Structure

```bash
├── backend               
│   ├── node_modules      
│   ├── .env              
│   ├── package.json      
│   └── server.js         
│
├── frontend              
│   ├── index.html        
│   ├── main.js          
│   └── styles.css        
│
├── .gitignore           
└── README.md            
```

## Technologies

- Frontend: Vanilla JavaScript, HTML, CSS

- Backend: Node.js, Express, Axios, CORS

- APIs & Libraries:

    - Spotify Web API

    - ColorThief









