import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LandingPage from './pages/LandingPage'
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div data-theme="light" className='min-h-screen min-w-screen'>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        reverseOrder={false}
      />
    </div>
    </>
  )
}

export default App
