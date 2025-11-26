import { useMemo, useState, useEffect } from 'react'
import { PlusCircle, TrendingDown, Search, Calendar, Edit, Trash2, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import DeleteTransactionModal from '../components/DeleteTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'
import AddTransactionModal from '../components/AddTransactionModal'
import CategorySelect from '../components/CategorySelect'
import DatePicker from '../components/DatePicker'

export default function Expenses() {
  const { getTransactionsByType, deleteTransaction, updateTransaction, getCategoriesByType, addTransaction, accounts } = useData()
  const expenses = getTransactionsByType('expense')
  const categories = getCategoriesByType('expense')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
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
    accountId: string
    accountName: string
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

  // Inizializza i filtri con il mese corrente
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  // Filtra per data, categoria e ricerca testuale
  const filteredExpenses = useMemo(() => {
    let filtered = expenses

    // Filtro per data
    if (startDate || endDate) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null
        
        if (start && expenseDate < start) return false
        if (end && expenseDate > end) return false
        return true
      })
    }

    // Filtro per categoria
    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategory)
    }

    // Filtro per ricerca testuale
    if (searchQuery) {
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, searchQuery, selectedCategory, startDate, endDate])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }

  const handleEditClick = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      setTransactionToEdit({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        categoryName: expense.categoryName,
        accountId: expense.accountId,
        accountName: expense.accountName,
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

  const handleAddTransaction = (description: string, amount: number, categoryId: string, accountId: string, date: string) => {
    addTransaction('expense', amount, categoryId, accountId, description, date)
    console.log(`✅ Nuova spesa aggiunta: ${description}`)
  }
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full mb-3 md:mb-4">
          <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Expenses</h1>
        <p className="text-gray-600 text-sm md:text-lg">Gestisci e monitora tutte le tue spese</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Spese Totali</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600">€{stats.total.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Totale registrato</p>
            </div>
            <div className="bg-red-100 p-2 md:p-3 rounded-full">
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Numero Transazioni</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.count}</p>
              <p className="text-xs text-gray-400 mt-1">Spese registrate</p>
            </div>
            <div className="bg-orange-100 p-2 md:p-3 rounded-full">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Media Giornaliera</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600">€{stats.averageDaily.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Ultimi 30 giorni</p>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-full">
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          {/* Prima riga: Ricerca e Bottone Aggiungi */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca spese..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
              Nuova Spesa
            </button>
          </div>

          {/* Seconda riga: Filtri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Filtro Data Inizio */}
            <DatePicker
              label="Data Inizio"
              value={startDate}
              onChange={setStartDate}
            />

            {/* Filtro Data Fine */}
            <DatePicker
              label="Data Fine"
              value={endDate}
              onChange={setEndDate}
            />

            {/* Filtro Categoria */}
            <CategorySelect
              label="Categoria"
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Tutte le categorie"
              allowEmpty
            />
          </div>

          {/* Bottone Cancella Filtri */}
          {(searchQuery || selectedCategory || startDate || endDate) && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancella filtri
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-red-600 rounded-full"></div>
          Ultime Spese
        </h2>          <div className="space-y-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6 rounded-xl transition-all border-2 bg-white border-gray-200 hover:border-red-300 hover:shadow-md">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">{expense.description}</h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">
                      {expense.categoryName} • {formatDate(expense.date)}
                    </p>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  {/* Amount */}
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-red-600">
                      -€{expense.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={() => handleEditClick(expense.id)}
                      className="p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifica spesa"
                    >
                      <Edit className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(expense.id)}
                      className="p-2 md:p-3 hover:bg-red-50 rounded-lg transition-colors"
                      title="Elimina spesa"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
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
        accounts={accounts}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddTransaction}
        type="expense"
        categories={getCategoriesByType('expense')}
        accounts={accounts}
      />
    </div>
  )
}
