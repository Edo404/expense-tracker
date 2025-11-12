import { useMemo, useState } from 'react'
import { PlusCircle, TrendingDown, Search, Calendar, Edit, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import DeleteTransactionModal from '../components/DeleteTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'
import AddTransactionModal from '../components/AddTransactionModal'

export default function Expenses() {
  const { getTransactionsByType, deleteTransaction, updateTransaction, getCategoriesByType, addTransaction } = useData()
  const expenses = getTransactionsByType('expense')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string; amount: number } | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<{ 
    id: string
    description: string
    amount: number
    categoryId: string
    categoryName: string
    date: string
    type: 'expense' | 'income'
  } | null>(null)

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, t) => sum + t.amount, 0)
    const count = expenses.length
    const averageDaily = count > 0 ? total / 30 : 0
    return { total, count, averageDaily }
  }, [expenses])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  // Filtra e ordina per data più recente
  const filteredExpenses = useMemo(() => {
    const filtered = expenses.filter(expense => 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, searchQuery])
  const handleEditClick = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      setTransactionToEdit({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        categoryName: expense.categoryName,
        date: expense.date,
        type: 'expense'
      })
      setIsEditModalOpen(true)
    }
  }

  const handleEditTransaction = (id: string, description: string, amount: number, categoryId: string, date: string) => {
    updateTransaction(id, { description, amount, categoryId, date })
    console.log(`✅ Spesa modificata: ${description}`)
  }

  const handleDeleteClick = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      setTransactionToDelete({
        id: expense.id,
        description: expense.description,
        amount: expense.amount
      })
      setIsDeleteModalOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      console.log(`✅ Spesa eliminata: ${transactionToDelete.description}`)
    }
  }

  const handleAddTransaction = (description: string, amount: number, categoryId: string, date: string) => {
    addTransaction('expense', amount, categoryId, description, date)
    console.log(`✅ Nuova spesa aggiunta: ${description}`)
  }
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <TrendingDown className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Expenses</h1>
        <p className="text-gray-600 text-lg">Gestisci e monitora tutte le tue spese</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Spese Totali</p>
              <p className="text-3xl font-bold text-red-600">€{stats.total.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Totale registrato</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Numero Transazioni</p>
              <p className="text-3xl font-bold text-gray-800">{stats.count}</p>
              <p className="text-xs text-gray-400 mt-1">Spese registrate</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Media Giornaliera</p>
              <p className="text-3xl font-bold text-purple-600">€{stats.averageDaily.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Ultimi 30 giorni</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingDown className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca spese..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Nuova Spesa
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-8 bg-red-600 rounded-full"></div>
          Ultime Spese
        </h2>          <div className="space-y-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all border border-gray-100 hover:border-gray-300 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{expense.description}</p>
                    <p className="text-sm text-gray-500">{expense.categoryName} • {formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-red-600">-€{expense.amount.toFixed(2)}</p>                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(expense.id)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifica spesa"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(expense.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Elimina spesa"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'Nessuna spesa trovata' : 'Nessuna spesa registrata'}
              </p>              <p className="text-gray-400 text-sm">
                {searchQuery ? 'Prova con un altro termine di ricerca' : 'Inizia aggiungendo la tua prima spesa!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        transactionDescription={transactionToDelete?.description || ''}
        transactionType="expense"
        transactionAmount={transactionToDelete?.amount || 0}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditTransaction}
        transaction={transactionToEdit}
        categories={getCategoriesByType('expense')}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddTransaction}
        type="expense"
        categories={getCategoriesByType('expense')}
      />
    </div>
  )
}
