import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './features/auth/context/AuthContext.jsx'
import { ClassProvider } from './features/classroom/context/ClassContext.jsx'

createRoot(document.getElementById('root')).render(
<AuthProvider>
    <ClassProvider>
        
    <App />
    </ClassProvider>
</AuthProvider>
)
