import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, CreditCard } from 'lucide-react'

interface AccountSelectProps {
  value: string
  onChange: (accountId: string) => void
  accounts: Array<{ id: string; name: string; color: string; isActive: boolean }>
  error?: string
}

export default function AccountSelect({ value, onChange, accounts, error }: AccountSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filtra solo account attivi
  const activeAccounts = accounts.filter(acc => acc.isActive)

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedAccount = activeAccounts.find(acc => acc.id === value)

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Account *
      </label>
      
      <div ref={dropdownRef} className="relative">
        {/* Selected Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {selectedAccount ? (
              <>
                <div className={`w-8 h-8 ${selectedAccount.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-800">{selectedAccount.name}</span>
              </>
            ) : (
              <span className="text-gray-500">Seleziona un account...</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
            {activeAccounts.length > 0 ? (
              activeAccounts.map((account) => {
                const isSelected = value === account.id
                
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      onChange(account.id)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                      ${isSelected 
                        ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1">
                      <p className={`font-semibold text-base ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                        {account.name}
                      </p>
                    </div>

                    {/* Check Icon */}
                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nessun account attivo disponibile
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
