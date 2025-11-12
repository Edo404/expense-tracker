import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Category, Transaction, Account } from '../types'

// Dati iniziali di esempio
const createInitialCategories = (): Category[] => {
  // Expense categories
  const alimentari = { id: uuidv4(), name: 'Alimentari', color: 'bg-red-500', type: 'expense' as const }
  const trasporti = { id: uuidv4(), name: 'Trasporti', color: 'bg-orange-500', type: 'expense' as const }
  const ristoranti = { id: uuidv4(), name: 'Ristoranti', color: 'bg-yellow-500', type: 'expense' as const }
  const casa = { id: uuidv4(), name: 'Casa', color: 'bg-blue-500', type: 'expense' as const, hasSubcategories: true }
  const shopping = { id: uuidv4(), name: 'Shopping', color: 'bg-purple-500', type: 'expense' as const }
  const intrattenimento = { id: uuidv4(), name: 'Intrattenimento', color: 'bg-pink-500', type: 'expense' as const }
  
  // Income categories
  const lavoro = { id: uuidv4(), name: 'Lavoro', color: 'bg-green-500', type: 'income' as const }
  const freelance = { id: uuidv4(), name: 'Freelance', color: 'bg-teal-500', type: 'income' as const }
  const vendite = { id: uuidv4(), name: 'Vendite', color: 'bg-emerald-500', type: 'income' as const, hasSubcategories: true }
  const extra = { id: uuidv4(), name: 'Extra', color: 'bg-lime-500', type: 'income' as const }
  
  // Subcategories
  const bollette = { id: uuidv4(), name: 'Bollette', color: 'bg-blue-400', type: 'expense' as const, parentId: casa.id }
  const strumentiMusicali = { id: uuidv4(), name: 'Strumenti musicali', color: 'bg-emerald-400', type: 'income' as const, parentId: vendite.id }
  
  return [
    alimentari, trasporti, ristoranti, casa, shopping, intrattenimento,
    lavoro, freelance, vendite, extra,
    bollette, strumentiMusicali
  ]
}

const createInitialTransactions = (categories: Category[]): Transaction[] => {
  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')
  
  // Trova le sotto-categorie specifiche
  const bolletteCategory = categories.find(c => c.name === 'Bollette')
  const strumentiMusicaliCategory = categories.find(c => c.name === 'Strumenti musicali')

  return [
    // Expenses
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 87.50,
      categoryId: expenseCategories[0]?.id || '',
      categoryName: expenseCategories[0]?.name || '',
      description: 'Spesa al supermercato',
      date: '2025-11-03',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 65.00,
      categoryId: expenseCategories[1]?.id || '',
      categoryName: expenseCategories[1]?.name || '',
      description: 'Benzina',
      date: '2025-11-02',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 45.00,
      categoryId: expenseCategories[2]?.id || '',
      categoryName: expenseCategories[2]?.name || '',
      description: 'Cena ristorante',
      date: '2025-11-01',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 450.00,
      categoryId: expenseCategories[3]?.id || '',
      categoryName: expenseCategories[3]?.name || '',
      description: 'Affitto',
      date: '2025-11-01',
      createdAt: new Date().toISOString(),
    },
    // Transazioni per sotto-categoria Bollette
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 85.00,
      categoryId: bolletteCategory?.id || '',
      categoryName: bolletteCategory?.name || '',
      description: 'Bolletta elettricità',
      date: '2025-10-28',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'expense' as const,
      amount: 45.00,
      categoryId: bolletteCategory?.id || '',
      categoryName: bolletteCategory?.name || '',
      description: 'Bolletta gas',
      date: '2025-10-25',
      createdAt: new Date().toISOString(),
    },
    // Incomes
    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 2800.00,
      categoryId: incomeCategories[0]?.id || '',
      categoryName: incomeCategories[0]?.name || '',
      description: 'Stipendio',
      date: '2025-10-30',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 450.00,
      categoryId: incomeCategories[1]?.id || '',
      categoryName: incomeCategories[1]?.name || '',
      description: 'Freelance Web Design',
      date: '2025-10-25',
      createdAt: new Date().toISOString(),
    },    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 120.00,
      categoryId: incomeCategories[2]?.id || '',
      categoryName: incomeCategories[2]?.name || '',
      description: 'Vendita Online',
      date: '2025-10-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 300.00,
      categoryId: incomeCategories[3]?.id || '',
      categoryName: incomeCategories[3]?.name || '',
      description: 'Bonus',
      date: '2025-10-15',
      createdAt: new Date().toISOString(),
    },
    // Transazioni per sotto-categoria Strumenti musicali
    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 250.00,
      categoryId: strumentiMusicaliCategory?.id || '',
      categoryName: strumentiMusicaliCategory?.name || '',
      description: 'Vendita chitarra usata',
      date: '2025-10-18',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: 'income' as const,
      amount: 180.00,
      categoryId: strumentiMusicaliCategory?.id || '',
      categoryName: strumentiMusicaliCategory?.name || '',
      description: 'Vendita amplificatore',
      date: '2025-10-12',
      createdAt: new Date().toISOString(),
    },
  ]
}

const createInitialAccounts = (): Account[] => {
  return [
    {
      id: uuidv4(),
      name: 'PayPal',
      balance: 2000.00,
      isActive: true,
      color: 'bg-blue-500',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Cash',
      balance: 2000.00,
      isActive: true,
      color: 'bg-green-500',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Bank Account',
      balance: 2000.00,
      isActive: true,
      color: 'bg-indigo-500',
      createdAt: new Date().toISOString(),
    },
  ]
}

// Hook per gestire localStorage
export function useLocalStorage() {
  const STORAGE_KEYS = {
    CATEGORIES: 'expense-tracker-categories',
    ACCOUNTS: 'expense-tracker-accounts',
    TRANSACTIONS: 'expense-tracker-transactions',
  }
  // Inizializza o recupera dati da localStorage
  const initializeData = () => {
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    const storedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)

    let categories: Category[]
    let transactions: Transaction[]
    let accounts: Account[]

    if (storedCategories) {
      categories = JSON.parse(storedCategories)
    } else {
      categories = createInitialCategories()
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    }

    if (storedTransactions) {
      transactions = JSON.parse(storedTransactions)
    } else {
      transactions = createInitialTransactions(categories)
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    }

    if (storedAccounts) {
      accounts = JSON.parse(storedAccounts)
    } else {
      accounts = createInitialAccounts()
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
    }

    return { categories, transactions, accounts }
  }

  const { categories: initialCats, transactions: initialTrans, accounts: initialAccounts } = initializeData()

  const [categories, setCategories] = useState<Category[]>(initialCats)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTrans)
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)

  // Salva categories in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  }, [categories])

  // Salva transactions in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  }, [transactions])

  // Salva accounts in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
  }, [accounts])
  // ===== CATEGORY OPERATIONS =====

  const addCategory = (name: string, color: string, type: 'expense' | 'income', parentId?: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
      type,
      ...(parentId && { parentId }),
    }
    
    // Se è una sotto-categoria, aggiorna la categoria padre con hasSubcategories
    if (parentId) {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === parentId 
            ? { ...cat, hasSubcategories: true } 
            : cat
        )
      )
    }
    
    setCategories(prev => [...prev, newCategory])
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    )
  }
  const deleteCategory = (id: string) => {
    // Trova tutte le sotto-categorie (ricorsivamente)
    const findAllSubcategories = (parentId: string): string[] => {
      const subcats = categories.filter(cat => cat.parentId === parentId)
      const subcatIds = subcats.map(cat => cat.id)
      
      // Ricorsione per trovare sotto-categorie delle sotto-categorie
      const deeperSubcats = subcatIds.flatMap(subcatId => findAllSubcategories(subcatId))
      
      return [...subcatIds, ...deeperSubcats]
    }
    
    // Trova tutte le categorie da eliminare (categoria principale + tutte le sotto-categorie)
    const categoriesToDelete = [id, ...findAllSubcategories(id)]
    
    // Rimuovi tutte le categorie
    setCategories(prev => prev.filter(cat => !categoriesToDelete.includes(cat.id)))
    
    // Rimuovi tutte le transazioni associate a queste categorie
    setTransactions(prev => prev.filter(trans => !categoriesToDelete.includes(trans.categoryId)))
  }
  const getCategoriesByType = (type: 'expense' | 'income') => {
    return categories.filter(cat => cat.type === type)
  }

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId)
  }

  const getParentCategories = (type: 'expense' | 'income') => {
    return categories.filter(cat => cat.type === type && !cat.parentId)
  }

  // ===== TRANSACTION OPERATIONS =====

  const addTransaction = (
    type: 'expense' | 'income',
    amount: number,
    categoryId: string,
    description: string,
    date: string
  ) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
      throw new Error('Category not found')
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      type,
      amount,
      categoryId,
      categoryName: category.name,
      description,
      date,
      createdAt: new Date().toISOString(),
    }
    setTransactions(prev => [...prev, newTransaction])
    return newTransaction
  }

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    setTransactions(prev =>
      prev.map(trans => {
        if (trans.id === id) {
          const updated = { ...trans, ...updates }
          // Se la categoria è cambiata, aggiorna anche il nome
          if (updates.categoryId) {
            const category = categories.find(cat => cat.id === updates.categoryId)
            if (category) {
              updated.categoryName = category.name
            }
          }
          return updated
        }
        return trans
      })
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(trans => trans.id !== id))
  }

  const getTransactionsByType = (type: 'expense' | 'income') => {
    return transactions.filter(trans => trans.type === type)
  }

  const getTransactionsByCategory = (categoryId: string) => {
    return transactions.filter(trans => trans.categoryId === categoryId)
  }

  // ===== STATISTICS =====

  const getStats = () => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const incomes = transactions.filter(t => t.type === 'income')

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
    const totalIncomes = incomes.reduce((sum, t) => sum + t.amount, 0)

    return {
      totalExpenses,
      totalIncomes,
      balance: totalIncomes - totalExpenses,
      expenseCount: expenses.length,
      incomeCount: incomes.length,
    }
  }

  const getCategoryStats = (categoryId: string) => {
    const categoryTransactions = getTransactionsByCategory(categoryId)
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
    return {
      count: categoryTransactions.length,
      total,
    }
  }
  // ===== ACCOUNT OPERATIONS =====

  const addAccount = (name: string, balance: number, color: string) => {
    const newAccount: Account = {
      id: uuidv4(),
      name,
      balance,
      isActive: true,
      color,
      createdAt: new Date().toISOString(),
    }
    setAccounts([...accounts, newAccount])
    return newAccount
  }

  const updateAccount = (id: string, updates: { name?: string; balance?: number; color?: string; isActive?: boolean }) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ))
  }

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id))
  }

  const toggleAccountStatus = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, isActive: !account.isActive } : account
    ))
  }

  const getTotalBalance = () => {
    return accounts
      .filter(account => account.isActive)
      .reduce((sum, account) => sum + account.balance, 0)
  }

  // Reset tutto (per debug)
  const resetAllData = () => {
    const newCategories = createInitialCategories()
    const newTransactions = createInitialTransactions(newCategories)
    const newAccounts = createInitialAccounts()
    setCategories(newCategories)
    setTransactions(newTransactions)
    setAccounts(newAccounts)
  }
  return {
    // Data
    categories,
    transactions,
    accounts,
    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getSubcategories,
    getParentCategories,
    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByCategory,
    // Account operations
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    getTotalBalance,
    // Statistics
    getStats,
    getCategoryStats,
    // Utility
    resetAllData,
  }
}
