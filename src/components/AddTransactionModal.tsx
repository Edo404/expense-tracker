import { X, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import DatePicker from './DatePicker'
import CategorySelect from './CategorySelect'
import AccountSelect from './AccountSelect'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (description: string, amount: number, categoryId: string, accountId: string, date: string) => void
  type: 'expense' | 'income'
  categories: Array<{ id: string; name: string; parentId?: string }>
  accounts: Array<{ id: string; name: string; color: string; isActive: boolean }>
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  categories,
  accounts,
}: AddTransactionModalProps) {  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Data odierna come default
  const [errors, setErrors] = useState<{ description?: string; amount?: string; category?: string; account?: string; date?: string }>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione
    const newErrors: { description?: string; amount?: string; category?: string; account?: string; date?: string } = {}
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0'
    }
    
    if (!categoryId) {
      newErrors.category = 'Select a category'
    }
    
    if (!accountId) {
      newErrors.account = 'Select an account'
    }
    
    if (!date) {
      newErrors.date = 'Date is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Invia i dati
    onConfirm(description.trim(), parsedAmount, categoryId, accountId, date)
    
    // Reset form
    setDescription('')
    setAmount('')
    setCategoryId('')
    setAccountId('')
    setDate(new Date().toISOString().split('T')[0])
    setErrors({})
    onClose()
  }
  const handleClose = () => {
    setDescription('')
    setAmount('')
    setCategoryId('')
    setAccountId('')
    setDate(new Date().toISOString().split('T')[0])
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 ${type === 'expense' ? 'bg-orange-100' : 'bg-teal-100'} rounded-full flex items-center justify-center`}>
            <PlusCircle className={`w-6 h-6 ${type === 'expense' ? 'text-orange-600' : 'text-teal-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              New {type === 'expense' ? 'Expense' : 'Income'}
            </h2>
            <p className="text-sm text-gray-500">Add a new transaction</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Descrizione */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              placeholder="e.g. Grocery shopping, Salary..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Data */}
          <DatePicker
            value={date}
            onChange={(value) => {
              setDate(value)
              if (errors.date) setErrors({ ...errors, date: undefined })
            }}
            error={errors.date}
          />

          {/* Categoria */}
          <CategorySelect
            value={categoryId}
            onChange={(value) => {
              setCategoryId(value)
              if (errors.category) setErrors({ ...errors, category: undefined })
            }}
            categories={categories}
            error={errors.category}
          />

          {/* Importo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (errors.amount) setErrors({ ...errors, amount: undefined })
              }}
              placeholder="0.00"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.amount 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Account */}
          <AccountSelect
            value={accountId}
            onChange={(value) => {
              setAccountId(value)
              if (errors.account) setErrors({ ...errors, account: undefined })
            }}
            accounts={accounts}
            error={errors.account}
          />

          {/* Anteprima */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">PREVIEW</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">
                  {description || 'Description'}
                </p>
                <p className="text-sm text-gray-500">
                  {categories.find(c => c.id === categoryId)?.name || 'Category'} • {date || 'Date'}
                </p>
              </div>
              <p className={`text-2xl font-bold ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                {type === 'expense' ? '-' : '+'}€{amount || '0.00'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${
                type === 'expense' 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                  : 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700'
              } text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl`}
            >
              Add {type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
