import { useState } from 'react'
import { CreditCard, Wallet, PlusCircle, Edit, Trash2, Power } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Accounts() {
  const { accounts, getTotalBalance } = useData()

  const totalBalance = getTotalBalance()
  const activeAccounts = accounts.filter(acc => acc.isActive).length
  const inactiveAccounts = accounts.filter(acc => !acc.isActive).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Wallet className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Accounts</h1>
        <p className="text-gray-600 text-lg">Gestisci i tuoi metodi di pagamento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Saldo Totale</p>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalBalance)}</p>
              <p className="text-xs text-gray-400 mt-1">Tutti gli account attivi</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Account Attivi</p>
              <p className="text-3xl font-bold text-green-600">{activeAccounts}</p>
              <p className="text-xs text-gray-400 mt-1">In uso</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Account Inattivi</p>
              <p className="text-3xl font-bold text-gray-600">{inactiveAccounts}</p>
              <p className="text-xs text-gray-400 mt-1">Non utilizzati</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <Power className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Account Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
          <PlusCircle className="w-5 h-5" />
          Nuovo Account
        </button>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
          I Tuoi Account
        </h2>

        <div className="space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div 
                key={account.id} 
                className={`group flex items-center justify-between p-6 rounded-xl transition-all border-2 ${
                  account.isActive 
                    ? 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${account.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">{account.name}</h3>
                      {account.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Attivo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                          Inattivo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Creato il {new Date(account.createdAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-500 font-medium">Saldo</p>
                    <p className={`text-2xl font-bold ${account.isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className={`p-3 rounded-lg transition-colors ${
                      account.isActive 
                        ? 'hover:bg-amber-50' 
                        : 'hover:bg-green-50'
                    }`}
                    title={account.isActive ? 'Disattiva' : 'Attiva'}
                  >
                    <Power className={`w-5 h-5 ${account.isActive ? 'text-amber-600' : 'text-green-600'}`} />
                  </button>
                  <button 
                    className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifica account"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>
                  <button 
                    className="p-3 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina account"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nessun account registrato</p>
              <p className="text-gray-400 text-sm">Inizia aggiungendo il tuo primo metodo di pagamento!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
