import { X, FolderPlus, ChevronDown, Check, FolderOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string, color: string, type: 'expense' | 'income', parentId?: string) => void
  type: 'expense' | 'income'
  parentCategories: Array<{ id: string; name: string; color: string }>
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

export default function AddCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  parentCategories,
}: AddCategoryModalProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState('bg-blue-500')
  const [isSubcategory, setIsSubcategory] = useState(false)
  const [parentId, setParentId] = useState('')
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; parent?: string }>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsParentDropdownOpen(false)
      }
    }

    if (isParentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isParentDropdownOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione
    const newErrors: { name?: string; parent?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Il nome è obbligatorio'
    }
    
    if (isSubcategory && !parentId) {
      newErrors.parent = 'Seleziona una categoria padre'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Invia i dati
    onConfirm(name.trim(), selectedColor, type, isSubcategory ? parentId : undefined)
    
    // Reset form
    setName('')
    setSelectedColor('bg-blue-500')
    setIsSubcategory(false)
    setParentId('')
    setErrors({})
    onClose()
  }
  const handleClose = () => {
    setName('')
    setSelectedColor('bg-blue-500')
    setIsSubcategory(false)
    setParentId('')
    setErrors({})
    onClose()
  }

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
          <div className={`w-12 h-12 ${type === 'expense' ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
            <FolderPlus className={`w-6 h-6 ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Nuova Categoria {type === 'expense' ? 'Spesa' : 'Entrata'}
            </h2>
            <p className="text-sm text-gray-500">Crea una nuova categoria personalizzata</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Categoria *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: undefined })
              }}
              placeholder="es. Ristoranti, Shopping, Freelance..."
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

          {/* Tipo: Sotto-categoria o Categoria Principale */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">È una sotto-categoria</span>
                <p className="text-xs text-gray-500">Crea una categoria figlio di una esistente</p>
              </div>
              
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSubcategory(!isSubcategory)
                  if (isSubcategory) {
                    setParentId('')
                    setErrors({ ...errors, parent: undefined })
                  }
                }}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubcategory ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    isSubcategory ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Selezione Categoria Padre (se è sotto-categoria) */}
          {isSubcategory && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria Padre *
              </label>
              
              {/* Custom Dropdown */}
              <div ref={dropdownRef} className="relative">
                {/* Selected Button */}
                <button
                  type="button"
                  onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.parent 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {parentId ? (
                      <>
                        <div className={`w-8 h-8 ${parentCategories.find(c => c.id === parentId)?.color || selectedColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <FolderOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {parentCategories.find(c => c.id === parentId)?.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Seleziona una categoria...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isParentDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isParentDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
                    {parentCategories.map((category) => {
                      const isSelected = parentId === category.id
                      
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setParentId(category.id)
                            setIsParentDropdownOpen(false)
                            if (errors.parent) setErrors({ ...errors, parent: undefined })
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
                          <div className={`w-10 h-10 ${category.color || selectedColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          
                          {/* Name */}
                          <div className="flex-1">
                            <p className={`font-semibold text-base ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                              {category.name}
                            </p>
                          </div>

                          {/* Check Icon */}
                          {isSelected && (
                            <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {errors.parent && (
                <p className="mt-1 text-sm text-red-600">{errors.parent}</p>
              )}
            </div>
          )}

          {/* Selezione Colore */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Colore
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
            <p className="text-xs font-semibold text-gray-500 mb-2">ANTEPRIMA</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedColor} rounded-lg flex items-center justify-center shadow-md`}>
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {isSubcategory && '↳ '}{name || 'Nome Categoria'}
                </p>
                <p className="text-sm text-gray-500">
                  {type === 'expense' ? 'Categoria Spesa' : 'Categoria Entrata'}
                  {isSubcategory && parentId && ` • Sotto ${parentCategories.find(c => c.id === parentId)?.name}`}
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
              Annulla
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${
                type === 'expense' 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
              } text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl`}
            >
              Crea Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
