import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'
import { SavedGamesProvider } from './context/savedGames.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SavedGamesProvider>
      <App />
    </SavedGamesProvider>
  </StrictMode>,
)
