import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tema-oscuro.css'
import App from './App.tsx'
import { ProveedorTema } from './tema'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorTema>
      <App />
    </ProveedorTema>
  </StrictMode>,
)
