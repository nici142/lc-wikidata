import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Service Worker nur im Produktions-Build registrieren, damit der Dev-Server
// nicht durch gecachte Responses verwirrt wird. Pfad relativ zu BASE_URL, damit
// die App auch aus einem Unterverzeichnis heraus funktioniert (z. B. GitHub Pages).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Offline-Unterstützung ist ein Bonus – ein Registrierungsfehler darf die App nicht blockieren.
    })
  })
}
