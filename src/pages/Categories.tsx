import { useState, useMemo } from 'react'
import { PlusCircle, FolderOpen, Edit, Trash2 } from 'lucide-react'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import AddCategoryModal from '../components/AddCategoryModal'
import EditCategoryModal from '../components/EditCategoryModal'
import { useData } from '../context/DataContext'

export default function Categories() {
  const { categories, deleteCategory, addCategory, updateCategory, getCategoryStats, getSubcategories, getParentCategories } = useData()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense')
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string; type: 'expense' | 'income' } | null>(null)
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: string; name: string; color: string; type: 'expense' | 'income'; parentId?: string } | null>(null)

  // Separa le categorie per tipo e calcola le statistiche
  const expenseCategories = useMemo(() => {
    return categories
      .filter(cat => cat.type === 'expense' && !cat.parentId) // Solo categorie padre
      .map(cat => {
        const stats = getCategoryStats(cat.id)
        const subcats = getSubcategories(cat.id)
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          count: stats.count,
          total: stats.total,
          hasSubcategories: cat.hasSubcategories,
          subcategories: subcats.map(sub => {
            const subStats = getCategoryStats(sub.id)
            return {
              id: sub.id,
              name: sub.name,
              color: sub.color,
              count: subStats.count,
              total: subStats.total,
            }
          })
        }
      })
  }, [categories, getCategoryStats, getSubcategories])

  const incomeCategories = useMemo(() => {
    return categories
      .filter(cat => cat.type === 'income' && !cat.parentId) // Solo categorie padre
      .map(cat => {
        const stats = getCategoryStats(cat.id)
        const subcats = getSubcategories(cat.id)
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          count: stats.count,
          total: stats.total,
          hasSubcategories: cat.hasSubcategories,
          subcategories: subcats.map(sub => {
            const subStats = getCategoryStats(sub.id)
            return {
              id: sub.id,
              name: sub.name,
              color: sub.color,
              count: subStats.count,
              total: subStats.total,
            }
          })
        }
      })
  }, [categories, getCategoryStats, getSubcategories])

  const handleDeleteClick = (id: string, name: string, type: 'expense' | 'income') => {
    setCategoryToDelete({ id, name, type })
    setIsDeleteModalOpen(true)
  }
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id)
      console.log(`✅ Categoria eliminata: ${categoryToDelete.name}`)
    }
  }
  const handleAddCategory = (name: string, color: string, type: 'expense' | 'income', parentId?: string) => {
    addCategory(name, color, type, parentId)
    console.log(`✅ Categoria creata: ${name} (${type})${parentId ? ' come sotto-categoria' : ''}`)
  }

  const handleOpenAddModal = (type: 'expense' | 'income') => {
    setModalType(type)
    setIsAddModalOpen(true)
  }

  const handleEditClick = (id: string, name: string, color: string, type: 'expense' | 'income', parentId?: string) => {
    setCategoryToEdit({ id, name, color, type, parentId })
    setIsEditModalOpen(true)
  }

  const handleEditCategory = (id: string, name: string, color: string, parentId?: string) => {
    updateCategory(id, { name, color, parentId })
    console.log(`✅ Categoria modificata: ${name}`)
  }

  // Calcola la categoria principale per ogni tipo
  const mainExpenseCategory = useMemo(() => {
    if (expenseCategories.length === 0) return null
    return expenseCategories.reduce((max, cat) => cat.total > max.total ? cat : max)
  }, [expenseCategories])

  const mainIncomeCategory = useMemo(() => {
    if (incomeCategories.length === 0) return null
    return incomeCategories.reduce((max, cat) => cat.total > max.total ? cat : max)
  }, [incomeCategories])

  const totalExpenses = useMemo(() => 
    expenseCategories.reduce((sum, cat) => sum + cat.total, 0)
  , [expenseCategories])

  const totalIncomes = useMemo(() => 
    incomeCategories.reduce((sum, cat) => sum + cat.total, 0)
  , [incomeCategories])

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <FolderOpen className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Categories</h1>
        <p className="text-gray-600 text-lg">Organizza le tue transazioni per categoria</p>
      </div>      {/* Add Category Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => handleOpenAddModal('expense')}
          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold text-lg">Nuova Categoria Spesa</span>
        </button>
        <button 
          onClick={() => handleOpenAddModal('income')}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold text-lg">Nuova Categoria Entrata</span>
        </button>
      </div>{/* Categories Grid - Side by Side on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-red-600 rounded-full"></div>
            Categorie Spese
          </h2>          <div className="grid grid-cols-1 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.id}>
                {/* Categoria Padre */}
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-all hover:shadow-md group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} transazioni</p>
                      </div>
                    </div>                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(category.id, category.name, category.color, 'expense', undefined)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(category.id, category.name, 'expense')}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-800">€{category.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Sotto-categorie */}                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2">
                    {category.subcategories.map((subcat) => (
                      <div 
                        key={subcat.id} 
                        className="border-l-4 border-gray-200 pl-4 py-3 hover:border-gray-400 transition-all bg-gray-50 rounded-r-lg group/sub"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${subcat.color} rounded-lg flex items-center justify-center`}>
                              <FolderOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 text-sm">↳ {subcat.name}</p>
                              <p className="text-xs text-gray-500">{subcat.count} transazioni</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-gray-700">€{subcat.total.toFixed(2)}</p>
                            <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditClick(subcat.id, subcat.name, subcat.color, 'expense', category.id)}
                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Edit className="w-3 h-3 text-gray-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(subcat.id, subcat.name, 'expense')}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-green-600 rounded-full"></div>
            Categorie Entrate
          </h2>          <div className="grid grid-cols-1 gap-4">
            {incomeCategories.map((category) => (
              <div key={category.id}>
                {/* Categoria Padre */}
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-all hover:shadow-md group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} transazioni</p>
                      </div>
                    </div>                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(category.id, category.name, category.color, 'income', undefined)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(category.id, category.name, 'income')}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-800">€{category.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Sotto-categorie */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2">
                    {category.subcategories.map((subcat) => (
                      <div 
                        key={subcat.id} 
                        className="border-l-4 border-gray-200 pl-4 py-3 hover:border-gray-400 transition-all bg-gray-50 rounded-r-lg group/sub"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${subcat.color} rounded-lg flex items-center justify-center`}>
                              <FolderOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 text-sm">↳ {subcat.name}</p>
                              <p className="text-xs text-gray-500">{subcat.count} transazioni</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-gray-700">€{subcat.total.toFixed(2)}</p>                            <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditClick(subcat.id, subcat.name, subcat.color, 'income', category.id)}
                                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Edit className="w-3 h-3 text-gray-600" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(subcat.id, subcat.name, 'income')}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Categoria Spesa Principale</h3>
          {mainExpenseCategory ? (
            <>
              <p className="text-3xl font-bold text-red-600">{mainExpenseCategory.name}</p>
              <p className="text-gray-600 mt-2">
                €{mainExpenseCategory.total.toFixed(2)} • {totalExpenses > 0 ? Math.round((mainExpenseCategory.total / totalExpenses) * 100) : 0}% del totale
              </p>
            </>
          ) : (
            <p className="text-gray-500">Nessuna spesa registrata</p>
          )}
        </div>
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-lg p-6 border border-green-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Categoria Entrata Principale</h3>
          {mainIncomeCategory ? (
            <>
              <p className="text-3xl font-bold text-green-600">{mainIncomeCategory.name}</p>
              <p className="text-gray-600 mt-2">
                €{mainIncomeCategory.total.toFixed(2)} • {totalIncomes > 0 ? Math.round((mainIncomeCategory.total / totalIncomes) * 100) : 0}% del totale
              </p>
            </>
          ) : (
            <p className="text-gray-500">Nessuna entrata registrata</p>
          )}
        </div>
      </div>      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ''}
        categoryType={categoryToDelete?.type || 'expense'}
      />      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddCategory}
        type={modalType}
        parentCategories={getParentCategories(modalType)}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditCategory}
        category={categoryToEdit}
        parentCategories={categoryToEdit ? getParentCategories(categoryToEdit.type) : []}
      />
    </div>
  )
}
