import { useMemo } from 'react'
import { PlusCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useData } from '../context/DataContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface HomeProps {
  setActiveTab?: (tab: string) => void
  onAddExpense?: () => void
  onAddIncome?: () => void
}

export default function Home({ onAddExpense, onAddIncome }: HomeProps) {
  const { getStats, transactions, getCategoriesByType } = useData()
  const stats = getStats()
  const expenseCategories = getCategoriesByType('expense')
  const incomeCategories = getCategoriesByType('income')

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
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
        date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        saldo: parseFloat(balance.toFixed(2)),
        entrate: parseFloat(values.incomes.toFixed(2)),
        spese: parseFloat(values.expenses.toFixed(2))
      })
    })
    
    return data
  }, [transactions])

  // Colori per i grafici a torta
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

  // Dati per grafico a torta spese per categoria
  const expensesByCategoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const categoryTotals: Record<string, { name: string; value: number; color?: string }> = {}
    
    expenses.forEach(expense => {
      const category = expenseCategories.find(c => c.id === expense.categoryId)
      if (category) {
        if (!categoryTotals[category.id]) {
          categoryTotals[category.id] = {
            name: category.name,
            value: 0,
            color: category.color
          }
        }
        categoryTotals[category.id].value += expense.amount
      }
    })
    
    return Object.values(categoryTotals).sort((a, b) => b.value - a.value)
  }, [transactions, expenseCategories])

  // Dati per grafico a torta entrate per categoria
  const incomesByCategoryData = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income')
    const categoryTotals: Record<string, { name: string; value: number; color?: string }> = {}
    
    incomes.forEach(income => {
      const category = incomeCategories.find(c => c.id === income.categoryId)
      if (category) {
        if (!categoryTotals[category.id]) {
          categoryTotals[category.id] = {
            name: category.name,
            value: 0,
            color: category.color
          }
        }
        categoryTotals[category.id].value += income.amount
      }
    })
    
    return Object.values(categoryTotals).sort((a, b) => b.value - a.value)
  }, [transactions, incomeCategories])

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full mb-3 md:mb-4">
          <Wallet className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Home</h1>
        <p className="text-gray-600 text-sm md:text-lg">Welcome to your personal Expense Tracker</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600">€{stats.totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.expenseCount} transactions</p>
            </div>
            <div className="bg-red-100 p-2 md:p-3 rounded-full">
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Incomes</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">€{stats.totalIncomes.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.incomeCount} transactions</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-full">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Balance</p>
              <p className={`text-2xl md:text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                €{stats.balance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Available balance</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-full">
              <Wallet className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Buttons */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
        <button 
          onClick={() => onAddExpense?.()}
          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-semibold text-base md:text-lg">Add Expense</span>
        </button>
        <button 
          onClick={() => onAddIncome?.()}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-semibold text-base md:text-lg">Add Income</span>
        </button>
      </div>      {/* Quick Summary */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-indigo-600 rounded-full"></div>
          Quick Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-gray-500 text-sm mb-1">Largest Expense</p>
            {largestExpense ? (
              <>
                <p className="text-xl font-bold text-gray-800">€{largestExpense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{largestExpense.description} - {formatDate(largestExpense.date)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No expenses recorded</p>
            )}
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-gray-500 text-sm mb-1">Largest Income</p>
            {largestIncome ? (
              <>
                <p className="text-xl font-bold text-gray-800">€{largestIncome.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{largestIncome.description} - {formatDate(largestIncome.date)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No incomes recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-indigo-600 rounded-full"></div>
          Portfolio Trend
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
                name="Balance"
              />
              <Line 
                type="monotone" 
                dataKey="entrate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
                name="Incomes"
              />
              <Line 
                type="monotone" 
                dataKey="spese" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">No data available</p>
            <p className="text-gray-400 text-sm">Add transactions to view the chart</p>
          </div>
        )}
      </div>

      {/* Pie Charts: Expenses and Incomes by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-1 h-6 md:h-8 bg-red-600 rounded-full"></div>
            Expenses Distribution
          </h2>
          {expensesByCategoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={expensesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => {
                      const percentage = ((percent || 0) * 100).toFixed(0)
                      return percentage !== '0' ? `${percentage}%` : ''
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategoryData.map((entry, index) => {
                      // Converti il colore Tailwind in hex
                      const colorMap: Record<string, string> = {
                        'bg-red-500': '#ef4444',
                        'bg-orange-500': '#f97316',
                        'bg-amber-500': '#f59e0b',
                        'bg-yellow-500': '#eab308',
                        'bg-lime-500': '#84cc16',
                        'bg-green-500': '#22c55e',
                        'bg-emerald-500': '#10b981',
                        'bg-teal-500': '#14b8a6',
                        'bg-cyan-500': '#06b6d4',
                        'bg-sky-500': '#0ea5e9',
                        'bg-blue-500': '#3b82f6',
                        'bg-blue-400': '#60a5fa',
                        'bg-indigo-500': '#6366f1',
                        'bg-violet-500': '#8b5cf6',
                        'bg-purple-500': '#a855f7',
                        'bg-fuchsia-500': '#d946ef',
                        'bg-pink-500': '#ec4899',
                      }
                      const color = entry.color ? colorMap[entry.color] || COLORS[index % COLORS.length] : COLORS[index % COLORS.length]
                      return (
                        <Cell key={`cell-${index}`} fill={color} />
                      )
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number, name: string) => [
                      `€${value.toFixed(2)}`,
                      <span style={{ fontWeight: 'bold', color: '#374151' }}>{name}</span>
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expensesByCategoryData.map((entry, index) => {
                  const colorMap: Record<string, string> = {
                    'bg-red-500': '#ef4444',
                    'bg-orange-500': '#f97316',
                    'bg-amber-500': '#f59e0b',
                    'bg-yellow-500': '#eab308',
                    'bg-lime-500': '#84cc16',
                    'bg-green-500': '#22c55e',
                    'bg-emerald-500': '#10b981',
                    'bg-teal-500': '#14b8a6',
                    'bg-cyan-500': '#06b6d4',
                    'bg-sky-500': '#0ea5e9',
                    'bg-blue-500': '#3b82f6',
                    'bg-blue-400': '#60a5fa',
                    'bg-indigo-500': '#6366f1',
                    'bg-violet-500': '#8b5cf6',
                    'bg-purple-500': '#a855f7',
                    'bg-fuchsia-500': '#d946ef',
                    'bg-pink-500': '#ec4899',
                  }
                  const color = entry.color ? colorMap[entry.color] || COLORS[index % COLORS.length] : COLORS[index % COLORS.length]
                  const total = expensesByCategoryData.reduce((sum, e) => sum + e.value, 0)
                  const percentage = ((entry.value / total) * 100).toFixed(1)
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-gray-700 font-medium">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{percentage}%</span>
                        <span className="text-gray-800 font-semibold">€{entry.value.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No expenses recorded</p>
              <p className="text-gray-400 text-sm">Add expenses to view the chart</p>
            </div>
          )}
        </div>

        {/* Incomes by Category */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-1 h-6 md:h-8 bg-green-600 rounded-full"></div>
            Incomes Distribution
          </h2>
          {incomesByCategoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={incomesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => {
                      const percentage = ((percent || 0) * 100).toFixed(0)
                      return percentage !== '0' ? `${percentage}%` : ''
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomesByCategoryData.map((entry, index) => {
                      // Converti il colore Tailwind in hex
                      const colorMap: Record<string, string> = {
                        'bg-red-500': '#ef4444',
                        'bg-orange-500': '#f97316',
                        'bg-amber-500': '#f59e0b',
                        'bg-yellow-500': '#eab308',
                        'bg-lime-500': '#84cc16',
                        'bg-green-500': '#22c55e',
                        'bg-emerald-500': '#10b981',
                        'bg-emerald-400': '#34d399',
                        'bg-teal-500': '#14b8a6',
                        'bg-cyan-500': '#06b6d4',
                        'bg-sky-500': '#0ea5e9',
                        'bg-blue-500': '#3b82f6',
                        'bg-indigo-500': '#6366f1',
                        'bg-violet-500': '#8b5cf6',
                        'bg-purple-500': '#a855f7',
                        'bg-fuchsia-500': '#d946ef',
                        'bg-pink-500': '#ec4899',
                      }
                      const color = entry.color ? colorMap[entry.color] || COLORS[index % COLORS.length] : COLORS[index % COLORS.length]
                      return (
                        <Cell key={`cell-${index}`} fill={color} />
                      )
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number, name: string) => [
                      `€${value.toFixed(2)}`,
                      <span style={{ fontWeight: 'bold', color: '#374151' }}>{name}</span>
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {incomesByCategoryData.map((entry, index) => {
                  const colorMap: Record<string, string> = {
                    'bg-red-500': '#ef4444',
                    'bg-orange-500': '#f97316',
                    'bg-amber-500': '#f59e0b',
                    'bg-yellow-500': '#eab308',
                    'bg-lime-500': '#84cc16',
                    'bg-green-500': '#22c55e',
                    'bg-emerald-500': '#10b981',
                    'bg-emerald-400': '#34d399',
                    'bg-teal-500': '#14b8a6',
                    'bg-cyan-500': '#06b6d4',
                    'bg-sky-500': '#0ea5e9',
                    'bg-blue-500': '#3b82f6',
                    'bg-indigo-500': '#6366f1',
                    'bg-violet-500': '#8b5cf6',
                    'bg-purple-500': '#a855f7',
                    'bg-fuchsia-500': '#d946ef',
                    'bg-pink-500': '#ec4899',
                  }
                  const color = entry.color ? colorMap[entry.color] || COLORS[index % COLORS.length] : COLORS[index % COLORS.length]
                  const total = incomesByCategoryData.reduce((sum, e) => sum + e.value, 0)
                  const percentage = ((entry.value / total) * 100).toFixed(1)
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-gray-700 font-medium">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{percentage}%</span>
                        <span className="text-gray-800 font-semibold">€{entry.value.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No incomes recorded</p>
              <p className="text-gray-400 text-sm">Add incomes to view the chart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
