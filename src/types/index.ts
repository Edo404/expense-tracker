// Types for our data models

export interface Category {
  id: string
  name: string
  color: string
  type: 'expense' | 'income'
  parentId?: string // ID della categoria padre (se è una sotto-categoria)
  hasSubcategories?: boolean // Flag per indicare se ha sotto-categorie
}

export interface Transaction {
  id: string
  type: 'expense' | 'income'
  amount: number
  categoryId: string
  categoryName: string
  description: string
  date: string // ISO string format
  createdAt: string
}

export interface Stats {
  totalExpenses: number
  totalIncomes: number
  balance: number
  expenseCount: number
  incomeCount: number
}

export interface Account {
  id: string
  name: string
  balance: number
  isActive: boolean
  color: string
  createdAt: string
}
