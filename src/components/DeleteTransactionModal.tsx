import { AlertTriangle, X } from 'lucide-react'

interface DeleteTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transactionDescription: string
  transactionType: 'expense' | 'income'
  transactionAmount: number
}

export default function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  transactionDescription,
  transactionType,
  transactionAmount,
}: DeleteTransactionModalProps) {
  if (!isOpen) return null

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

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Conferma Eliminazione</h2>
            <p className="text-sm text-gray-500">Questa azione non può essere annullata</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-gray-700 mb-3">
            Sei sicuro di voler eliminare {transactionType === 'expense' ? 'questa spesa' : 'questa entrata'}?
          </p>
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <p className="font-bold text-gray-800 text-lg">{transactionDescription}</p>
            <p className={`text-xl font-bold ${transactionType === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
              {transactionType === 'expense' ? '-' : '+'}€{transactionAmount.toFixed(2)}
            </p>
          </div>
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
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  )
}
