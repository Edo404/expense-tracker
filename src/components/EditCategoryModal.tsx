import { X, FolderEdit } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, name: string, color: string, parentId?: string) => void
  category: {
    id: string
    name: string
    color: string
    type: 'expense' | 'income'
    parentId?: string
  } | null
  parentCategories: Array<{ id: string; name: string }>
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

export default function EditCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  category,
  parentCategories,
}: EditCategoryModalProps) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState('bg-blue-500')
  const [isSubcategory, setIsSubcategory] = useState(false)
  const [parentId, setParentId] = useState('')
  const [errors, setErrors] = useState<{ name?: string; parent?: string }>({})

  // Aggiorna i campi quando la categoria cambia
  useEffect(() => {
    if (category) {
      setName(category.name)
      setSelectedColor(category.color)
      setIsSubcategory(!!category.parentId)
      setParentId(category.parentId || '')
    }
  }, [category])

  if (!isOpen || !category) return null

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
    onConfirm(category.id, name.trim(), selectedColor, isSubcategory ? parentId : undefined)
    
    // Reset errors
    setErrors({})
    onClose()
  }
  const handleClose = () => {
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
          <div className={`w-12 h-12 ${category.type === 'expense' ? 'bg-orange-100' : 'bg-teal-100'} rounded-full flex items-center justify-center`}>
            <FolderEdit className={`w-6 h-6 ${category.type === 'expense' ? 'text-orange-600' : 'text-teal-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Modifica Categoria
            </h2>
            <p className="text-sm text-gray-500">Aggiorna i dettagli della categoria</p>
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
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSubcategory}
                onChange={(e) => {
                  setIsSubcategory(e.target.checked)
                  if (!e.target.checked) {
                    setParentId('')
                    setErrors({ ...errors, parent: undefined })
                  }
                }}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-gray-800">È una sotto-categoria</span>
                <p className="text-xs text-gray-500">Rendi questa categoria figlia di una esistente</p>
              </div>
            </label>
          </div>

          {/* Selezione Categoria Padre (se è sotto-categoria) */}
          {isSubcategory && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria Padre *
              </label>
              <select
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value)
                  if (errors.parent) setErrors({ ...errors, parent: undefined })
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.parent 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              >
                <option value="">Seleziona una categoria...</option>
                {parentCategories
                  .filter(cat => cat.id !== category.id) // Non permettere di selezionare se stessa
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              {errors.parent && (
                <p className="mt-1 text-sm text-red-600">{errors.parent}</p>
              )}
              {parentId === category.id && (
                <p className="mt-1 text-sm text-amber-600">⚠️ Una categoria non può essere figlia di se stessa</p>
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
                <FolderEdit className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {isSubcategory && '↳ '}{name || 'Nome Categoria'}
                </p>
                <p className="text-sm text-gray-500">
                  {category.type === 'expense' ? 'Categoria Spesa' : 'Categoria Entrata'}
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
                category.type === 'expense' 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                  : 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700'
              } text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl`}
            >
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
