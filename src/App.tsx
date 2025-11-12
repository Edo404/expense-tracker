import { useState } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import Incomes from './pages/Incomes'
import Categories from './pages/Categories'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />
      case 'expenses':
        return <Expenses />
      case 'incomes':
        return <Incomes />
      case 'categories':
        return <Categories />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
