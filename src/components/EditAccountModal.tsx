import { X, Edit, CreditCard } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EditAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, name: string, balance: number, color: string) => void
  account: {
    id: string
    name: string
    balance: number
    color: string
  } | null
}

const AVAILABLE_COLORS = [
  { name: 'Red', class: 'bg-red-500' },
  { name: 'Orange', class: 'bg-orange-500' },
  { name: 'Yellow', class: 'bg-yellow-500' },
  { name: 'Green', class: 'bg-green-500' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Indigo', class: 'bg-indigo-500' },
  { name: 'Purple', class: 'bg-purple-500' },
  { name: 'Pink', class: 'bg-pink-500' },
  { name: 'Teal', class: 'bg-teal-500' },
  { name: 'Cyan', class: 'bg-cyan-500' },
  { name: 'Emerald', class: 'bg-emerald-500' },
  { name: 'Lime', class: 'bg-lime-500' },
]

export default function EditAccountModal({
  isOpen,
  onClose,
  onConfirm,
  account,
}: EditAccountModalProps) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [selectedColor, setSelectedColor] = useState('bg-blue-500')
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({})

  // Popola i campi quando si apre il modal con i dati dell'account
  useEffect(() => {
    if (account) {
      setName(account.name)
      setBalance(account.balance.toString())
      setSelectedColor(account.color)
    }
  }, [account])

  if (!isOpen || !account) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione
    const newErrors: { name?: string; balance?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    const parsedBalance = parseFloat(balance)
    if (!balance || isNaN(parsedBalance)) {
      newErrors.balance = 'Enter a valid balance'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Invia i dati
    onConfirm(account.id, name.trim(), parsedBalance, selectedColor)
    
    // Reset errors
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Edit className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Account</h2>
            <p className="text-sm text-gray-500">Update account details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome Account */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              placeholder="e.g. PayPal, Cash, Bank Account..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Saldo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Balance (€) *
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value)
                if (errors.balance) setErrors({ ...errors, balance: undefined })
              }}
              placeholder="0.00"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.balance 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.balance && (
              <p className="mt-1 text-sm text-red-600">{errors.balance}</p>
            )}
          </div>

          {/* Selezione Colore */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.class}
                  type="button"
                  onClick={() => setSelectedColor(color.class)}
                  className={`w-10 h-10 ${color.class} rounded-lg transition-all hover:scale-110 ${
                    selectedColor === color.class 
                      ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Anteprima */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-3">PREVIEW</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${selectedColor} rounded-xl flex items-center justify-center shadow-md`}>
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {name || 'Account Name'}
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-0.5">
                    Active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-xl font-bold text-purple-600">
                  €{balance ? formatCurrency(balance) : '0.00'}
                </p>
              </div>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
