import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from '@react-oauth/google'


createRoot(document.getElementById('root')!).render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_WEB_CLIENT_ID}>
<StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>,
)
