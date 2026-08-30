'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('fahad_gsn_theme') as Theme | null
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved)
      applyTheme(saved)
    } else {
      applyTheme(defaultTheme)
    }
  }, [defaultTheme, applyTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('fahad_gsn_theme', newTheme)
    document.cookie = `fahad_gsn_theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`
    applyTheme(newTheme)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Fallback for SSR or non-wrapped components
    return {
      theme: 'light' as Theme,
      isDark: false,
      toggleTheme: () => {},
      setTheme: () => {},
    }
  }
  return ctx
}
