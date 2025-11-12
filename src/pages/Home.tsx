import { useMemo } from 'react'
import { PlusCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Home() {
  const { getStats, transactions } = useData()
  const stats = getStats()

  // Trova la spesa e l'entrata più grande
  const largestExpense = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    if (expenses.length === 0) return null
    return expenses.reduce((max, t) => t.amount > max.amount ? t : max)
  }, [transactions])

  const largestIncome = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income')
    if (incomes.length === 0) return null
    return incomes.reduce((max, t) => t.amount > max.amount ? t : max)
  }, [transactions])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Home</h1>
        <p className="text-gray-600 text-lg">Benvenuto nel tuo Expense Tracker personale</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Totale Spese</p>
              <p className="text-3xl font-bold text-red-600">€{stats.totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.expenseCount} transazioni</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Entrate</p>
              <p className="text-3xl font-bold text-green-600">€{stats.totalIncomes.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.incomeCount} transazioni</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Bilancio</p>
              <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                €{stats.balance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Saldo disponibile</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold text-lg">Aggiungi Transazione</span>
        </button>
      </div>      {/* Quick Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
          Riepilogo Rapido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-gray-500 text-sm mb-1">Spesa più grande</p>
            {largestExpense ? (
              <>
                <p className="text-xl font-bold text-gray-800">€{largestExpense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{largestExpense.description} - {formatDate(largestExpense.date)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Nessuna spesa registrata</p>
            )}
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-gray-500 text-sm mb-1">Entrata più grande</p>
            {largestIncome ? (
              <>
                <p className="text-xl font-bold text-gray-800">€{largestIncome.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{largestIncome.description} - {formatDate(largestIncome.date)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Nessuna entrata registrata</p>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8 text-center border border-indigo-100">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Grafici in Arrivo!</h2>
        <p className="text-gray-600">
          Visualizza le tue spese con grafici interattivi, analisi mensili e molto altro!
        </p>
      </div>
    </div>
  )
}
