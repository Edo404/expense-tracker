import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  error?: string
  label?: string
}

export default function DatePicker({ value, onChange, error, label = 'Data' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
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

  // Imposta il mese corrente quando si apre il picker
  useEffect(() => {
    if (isOpen && value) {
      setCurrentMonth(new Date(value))
    }
  }, [isOpen, value])

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const getDaysArray = () => {
    const days = daysInMonth(currentMonth)
    const firstDay = firstDayOfMonth(currentMonth)
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1 // Lunedì = 0
    const totalCells = Math.ceil((days + prevMonthDays) / 7) * 7
    
    const result: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = []
    
    // Giorni del mese precedente
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const prevMonthLastDay = daysInMonth(prevMonth)
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      result.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthLastDay - i)
      })
    }
    
    // Giorni del mese corrente
    for (let i = 1; i <= days; i++) {
      result.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      })
    }
    
    // Giorni del mese successivo
    const remainingCells = totalCells - result.length
    for (let i = 1; i <= remainingCells; i++) {
      result.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i)
      })
    }
    
    return result
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Seleziona una data'
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const handleDateClick = (date: Date) => {
    onChange(formatDate(date))
    setIsOpen(false)
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!value) return false
    const selectedDate = new Date(value)
    return date.toDateString() === selectedDate.toDateString()
  }

  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
  const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} *
      </label>
      
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-left flex items-center gap-3
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 hover:border-gray-400'
          }`}
      >
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className={value ? 'text-gray-700 font-medium' : 'text-gray-400'}>
          {formatDisplayDate(value)}
        </span>
      </button>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <h3 className="text-base font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysArray().map((item, index) => {
              const isTodayDay = isToday(item.date)
              const isSelectedDay = isSelected(item.date)
              
              return (
                <button                  key={index}
                  type="button"
                  onClick={() => handleDateClick(item.date)}
                  className={`
                    aspect-square rounded-lg text-xs font-medium transition-all
                    ${!item.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${isTodayDay ? 'ring-2 ring-indigo-400' : ''}
                    ${isSelectedDay 
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {item.day}
                </button>
              )
            })}
          </div>          {/* Quick Actions */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onChange(formatDate(new Date()))
                setIsOpen(false)
              }}
              className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-xs"
            >
              Oggi
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-xs"
            >
              Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
