import { X, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import DatePicker from './DatePicker'
import CategorySelect from './CategorySelect'

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, description: string, amount: number, categoryId: string, date: string) => void
  transaction: {
    id: string
    description: string
    amount: number
    categoryId: string
    categoryName: string
    date: string
    type: 'expense' | 'income'
  } | null
  categories: Array<{ id: string; name: string; parentId?: string }>
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  categories,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [errors, setErrors] = useState<{ description?: string; amount?: string; category?: string; date?: string }>({})  // Aggiorna i campi quando la transazione cambia
  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description)
      setAmount(transaction.amount.toString())
      setCategoryId(transaction.categoryId)
      setDate(transaction.date)
    }
  }, [transaction])

  if (!isOpen || !transaction) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione
    const newErrors: { description?: string; amount?: string; category?: string; date?: string } = {}
    
    if (!description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria'
    }
    
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Inserisci un importo valido maggiore di 0'
    }
    
    if (!categoryId) {
      newErrors.category = 'Seleziona una categoria'
    }
    
    if (!date) {
      newErrors.date = 'La data è obbligatoria'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Invia i dati
    onConfirm(transaction.id, description.trim(), parsedAmount, categoryId, date)
    
    // Reset errors
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()  }

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
          <div className={`w-12 h-12 ${transaction.type === 'expense' ? 'bg-orange-100' : 'bg-teal-100'} rounded-full flex items-center justify-center`}>
            <Edit className={`w-6 h-6 ${transaction.type === 'expense' ? 'text-orange-600' : 'text-teal-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Modifica {transaction.type === 'expense' ? 'Spesa' : 'Entrata'}
            </h2>
            <p className="text-sm text-gray-500">Aggiorna i dettagli della transazione</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">          {/* Descrizione */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrizione *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              placeholder="es. Spesa al supermercato, Stipendio..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>          {/* Data */}
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
              Importo (€) *
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

          {/* Anteprima */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">ANTEPRIMA</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">
                  {description || 'Descrizione'}
                </p>
                <p className="text-sm text-gray-500">
                  {categories.find(c => c.id === categoryId)?.name || 'Categoria'} • {date || 'Data'}
                </p>
              </div>
              <p className={`text-2xl font-bold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                {transaction.type === 'expense' ? '-' : '+'}€{amount || '0.00'}
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
              Annulla
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${
                transaction.type === 'expense' 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                  : 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700'
              } text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl`}
            >
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
