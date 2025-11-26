import { useState, useRef, useEffect } from 'react'
import { FolderOpen, ChevronDown, Check } from 'lucide-react'

interface Category {
  id: string
  name: string
  parentId?: string
  color?: string
}

interface CategorySelectProps {
  value: string
  onChange: (categoryId: string) => void
  categories: Category[]
  error?: string
  label?: string
  placeholder?: string
  allowEmpty?: boolean
}

export default function CategorySelect({ 
  value, 
  onChange, 
  categories, 
  error, 
  label = 'Categoria',
  placeholder = 'Seleziona categoria',
  allowEmpty = false
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Chiudi quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Organizza le categorie in alberatura
  const organizedCategories = () => {
    const parents = categories.filter(cat => !cat.parentId)
    const result: Array<{ category: Category; isChild: boolean }> = []
    
    parents.forEach(parent => {
      result.push({ category: parent, isChild: false })
      const children = categories.filter(cat => cat.parentId === parent.id)
      children.forEach(child => {
        result.push({ category: child, isChild: true })
      })
    })
    
    return result
  }

  const selectedCategory = categories.find(cat => cat.id === value)

  const handleSelect = (categoryId: string) => {
    onChange(categoryId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Select Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 md:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between gap-3
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-gray-300 focus:ring-indigo-200 hover:border-gray-400'
          }`}
      >
        <div className="flex items-center gap-3 flex-1">
          {selectedCategory ? (
            <>
              <div className={`w-8 h-8 ${selectedCategory.color || 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">{selectedCategory.name}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-400">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-h-80 overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div className="p-2">
            {allowEmpty && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={`
                  flex items-center gap-2 p-2 rounded-lg transition-all text-left w-full
                  ${value === '' 
                    ? 'bg-indigo-50 border border-indigo-500' 
                    : 'hover:bg-gray-50 border border-transparent'
                  }
                `}
              >
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-3 h-3 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${value === '' ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {placeholder}
                  </p>
                </div>
                {value === '' && (
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                )}
              </button>
            )}
            {organizedCategories().length > 0 ? (
              organizedCategories().map(({ category, isChild }) => {
                const isSelected = value === category.id
                
                return (                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg transition-all text-left
                      ${isChild ? 'ml-4 w-[calc(100%-1rem)]' : 'w-full'}
                      ${isSelected 
                        ? 'bg-indigo-50 border border-indigo-500' 
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                  >{/* Icon */}
                    <div className={`${isChild ? 'w-5 h-5' : 'w-6 h-6'} ${category.color || 'bg-gray-400'} rounded flex items-center justify-center flex-shrink-0`}>
                      <FolderOpen className={`${isChild ? 'w-3 h-3' : 'w-3 h-3'} text-white`} />
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isChild ? 'truncate' : ''} ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                        {isChild && '↳ '}{category.name}
                      </p>
                    </div>
                    
                    {/* Check Icon */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nessuna categoria disponibile</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
