import { useState } from 'react'
import { CreditCard, Wallet, PlusCircle, Edit, Trash2, Power } from 'lucide-react'
import { useData } from '../context/DataContext'
import AddAccountModal from '../components/AddAccountModal'
import EditAccountModal from '../components/EditAccountModal'
import DeleteAccountModal from '../components/DeleteAccountModal'

export default function Accounts() {
  const { accounts, getTotalBalance, addAccount, updateAccount, deleteAccount, toggleAccountStatus } = useData()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [accountToEdit, setAccountToEdit] = useState<{ id: string; name: string; balance: number; color: string } | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<{ id: string; name: string; balance: number } | null>(null)

  const totalBalance = getTotalBalance()
  const activeAccounts = accounts.filter(acc => acc.isActive).length
  const inactiveAccounts = accounts.filter(acc => !acc.isActive).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handleAddAccount = (name: string, balance: number, color: string) => {
    addAccount(name, balance, color)
    console.log(`✅ Nuovo account aggiunto: ${name}`)
  }

  const handleEditClick = (id: string) => {
    const account = accounts.find(acc => acc.id === id)
    if (account) {
      setAccountToEdit({
        id: account.id,
        name: account.name,
        balance: account.balance,
        color: account.color
      })
      setIsEditModalOpen(true)
    }
  }

  const handleEditAccount = (id: string, name: string, balance: number, color: string) => {
    updateAccount(id, { name, balance, color })
    console.log(`✅ Account modificato: ${name}`)
  }

  const handleDeleteClick = (id: string) => {
    const account = accounts.find(acc => acc.id === id)
    if (account) {
      setAccountToDelete({
        id: account.id,
        name: account.name,
        balance: account.balance
      })
      setIsDeleteModalOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (accountToDelete) {
      deleteAccount(accountToDelete.id)
      console.log(`✅ Account eliminato: ${accountToDelete.name}`)
    }
  }

  const handleToggleStatus = (id: string) => {
    toggleAccountStatus(id)
    const account = accounts.find(acc => acc.id === id)
    console.log(`✅ Account ${account?.isActive ? 'disattivato' : 'attivato'}`)
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full mb-3 md:mb-4">
          <Wallet className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Accounts</h1>
        <p className="text-gray-600 text-sm md:text-lg">Manage your payment methods</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Total Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600">{formatCurrency(totalBalance)}</p>
              <p className="text-xs text-gray-400 mt-1">All active accounts</p>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-full">
              <Wallet className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Active Accounts</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">{activeAccounts}</p>
              <p className="text-xs text-gray-400 mt-1">In use</p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-full">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Inactive Accounts</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">{inactiveAccounts}</p>
              <p className="text-xs text-gray-400 mt-1">Not used</p>
            </div>
            <div className="bg-gray-100 p-2 md:p-3 rounded-full">
              <Power className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Account Button */}
      <div className="flex justify-center md:justify-start">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          New Account
        </button>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 md:h-8 bg-purple-600 rounded-full"></div>
          Your Accounts
        </h2>

        <div className="space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div 
                key={account.id} 
                className={`flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6 rounded-xl transition-all border-2 ${
                  account.isActive 
                    ? 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                  {/* Icon */}
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${account.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">{account.name}</h3>
                      {account.isActive ? (
                        <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 md:px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      Created on {new Date(account.createdAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>

                {/* Balance and Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  {/* Balance */}
                  <div>
                    <p className={`text-xl md:text-2xl font-bold ${
                      account.isActive ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={() => handleToggleStatus(account.id)}
                      className={`p-2 md:p-3 rounded-lg transition-colors ${
                        account.isActive 
                          ? 'hover:bg-amber-50' 
                          : 'hover:bg-green-50'
                      }`}
                      title={account.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className={`w-4 h-4 md:w-5 md:h-5 ${
                        account.isActive ? 'text-amber-600' : 'text-green-600'
                      }`} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(account.id)}
                      className="p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit account"
                    >
                      <Edit className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(account.id)}
                      className="p-2 md:p-3 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No accounts registered</p>
              <p className="text-gray-400 text-sm">Start by adding your first payment method!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddAccount}
      />

      {/* Edit Account Modal */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditAccount}
        account={accountToEdit}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        accountName={accountToDelete?.name || ''}
        accountBalance={accountToDelete?.balance || 0}
      />
    </div>
  )
}
