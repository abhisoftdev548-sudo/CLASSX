import { useState, createContext, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LandingPage from './pages/LandingPage'
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast';
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [count, setCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
    <div data-theme={isDarkMode ? "dark" : "light"} className='min-h-screen min-w-screen relative'>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        reverseOrder={false}
      />
      
      {/* Fixed Theme Toggle Button at Bottom */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 btn btn-circle btn-sm bg-primary text-primary-content hover:bg-primary/80 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110"
      >
        {isDarkMode ? <IoSunnyOutline className="text-lg" /> : <IoMoonOutline className="text-lg" />}
      </button>
    </div>
    </ThemeContext.Provider>
  )
}

export default App
