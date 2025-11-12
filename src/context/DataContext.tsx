import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Crea il context con il tipo corretto
const DataContext = createContext<ReturnType<typeof useLocalStorage> | null>(null)

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const storage = useLocalStorage()

  return (
    <DataContext.Provider value={storage}>
      {children}
    </DataContext.Provider>
  )
}

// Hook personalizzato per usare il context
export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
