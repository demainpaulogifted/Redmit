import React, { createContext, useContext, useState, useEffect } from 'react'
const AppContext = createContext<any>(undefined)
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState('NG')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => { if (darkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [darkMode])
  return (<AppContext.Provider value={{ darkMode, setDarkMode, currentUser, setCurrentUser, selectedCountry, setSelectedCountry, sidebarOpen, setSidebarOpen }}>{children}</AppContext.Provider>)
}
export function useApp() { const ctx = useContext(AppContext); if (!ctx) throw new Error('useApp must be used within AppProvider'); return ctx }
