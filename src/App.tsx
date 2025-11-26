import { useState } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import Incomes from './pages/Incomes'
import Categories from './pages/Categories'
import Accounts from './pages/Accounts'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [openExpenseModal, setOpenExpenseModal] = useState(false)
  const [openIncomeModal, setOpenIncomeModal] = useState(false)

  const handleAddExpense = () => {
    setOpenExpenseModal(true)
    setActiveTab('expenses')
  }

  const handleAddIncome = () => {
    setOpenIncomeModal(true)
    setActiveTab('incomes')
  }

  // Reset modal flags quando cambia tab manualmente
  const handleSetActiveTab = (tab: string) => {
    if (tab !== 'expenses') setOpenExpenseModal(false)
    if (tab !== 'incomes') setOpenIncomeModal(false)
    setActiveTab(tab)
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home onAddExpense={handleAddExpense} onAddIncome={handleAddIncome} />
      case 'expenses':
        return <Expenses openAddModal={openExpenseModal} />
      case 'incomes':
        return <Incomes openAddModal={openIncomeModal} />
      case 'categories':
        return <Categories />
      case 'accounts':
        return <Accounts />
      default:
        return <Home onAddExpense={handleAddExpense} onAddIncome={handleAddIncome} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
