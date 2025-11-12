import { X, Trash2, AlertTriangle } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  accountName: string
  accountBalance: number
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  accountName,
  accountBalance,
}: DeleteAccountModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Elimina Account</h2>
            <p className="text-sm text-gray-500">Questa azione non può essere annullata</p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
          <p className="text-gray-700 mb-3">
            Sei sicuro di voler eliminare l'account <span className="font-bold text-gray-900">"{accountName}"</span>?
          </p>
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Saldo corrente:</span>
              <span className="text-lg font-bold text-red-600">{formatCurrency(accountBalance)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            ⚠️ L'account e il suo saldo verranno eliminati permanentemente.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Elimina
          </button>
        </div>
      </div>
    </div>
  )
}
