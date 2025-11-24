import { useMemo } from 'react'
import { PlusCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useData } from '../context/DataContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

  // Calcola l'andamento del portafoglio nel tempo
  const portfolioData = useMemo(() => {
    // Ordina le transazioni per data
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    let balance = 0
    const data: { date: string; saldo: number; entrate: number; spese: number }[] = []
    
    // Raggruppa per data
    const groupedByDate = sorted.reduce((acc, t) => {
      const date = t.date
      if (!acc[date]) {
        acc[date] = { incomes: 0, expenses: 0 }
      }
      if (t.type === 'income') {
        acc[date].incomes += t.amount
      } else {
        acc[date].expenses += t.amount
      }
      return acc
    }, {} as Record<string, { incomes: number; expenses: number }>)
    
    // Crea i dati per il grafico
    Object.entries(groupedByDate).forEach(([date, values]) => {
      balance += values.incomes - values.expenses
      data.push({
        date: new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
        saldo: parseFloat(balance.toFixed(2)),
        entrate: parseFloat(values.incomes.toFixed(2)),
        spese: parseFloat(values.expenses.toFixed(2))
      })
    })
    
    return data
  }, [transactions])

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full mb-3 md:mb-4">
          <Wallet className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Home</h1>
        <p className="text-gray-600 text-sm md:text-lg">Benvenuto nel tuo Expense Tracker personale</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Totale Spese</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600">€{stats.totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.expenseCount} transazioni</p>
            </div>
            <div className="bg-red-100 p-2 md:p-3 rounded-full">
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Entrate</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">€{stats.totalIncomes.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.incomeCount} transazioni</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-full">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Bilancio</p>
              <p className={`text-2xl md:text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                €{stats.balance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Saldo disponibile</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-full">
              <Wallet className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-xl flex items-center gap-2 md:gap-3 mx-auto transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold text-lg">Aggiungi Transazione</span>
        </button>
      </div>      {/* Quick Summary */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-indigo-600 rounded-full"></div>
          Riepilogo Rapido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-indigo-600 rounded-full"></div>
          Andamento Portafoglio
        </h2>
        {portfolioData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={portfolioData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#888888"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#888888"
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => `€${value.toFixed(2)}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
                name="Saldo"
              />
              <Line 
                type="monotone" 
                dataKey="entrate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
                name="Entrate"
              />
              <Line 
                type="monotone" 
                dataKey="spese" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
                name="Spese"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">Nessun dato disponibile</p>
            <p className="text-gray-400 text-sm">Aggiungi transazioni per visualizzare il grafico</p>
          </div>
        )}
      </div>
    </div>
  )
}
