import React, { useState, useEffect } from 'react'

const formatDisplayDate = (value) => {
  if (!value) return ''
  if (typeof value === 'string') {
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value
    }
  }
  return ''
}

const parseDateValue = (value) => {
  if (!value || typeof value !== 'string') return ''
  const displayMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (displayMatch) {
    const [, day, month, year] = displayMatch
    const candidate = new Date(`${year}-${month}-${day}`)
    if (
      candidate instanceof Date &&
      !Number.isNaN(candidate.getTime()) &&
      candidate.getFullYear() === Number(year) &&
      candidate.getMonth() + 1 === Number(month) &&
      candidate.getDate() === Number(day)
    ) {
      return `${year}-${month}-${day}`
    }
  }
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    return value
  }
  return value
}

const DateField = ({
    requiredField,
    inputLabel, 
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
}) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue)


    const setValue = (value) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <label 
                    className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
                    ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
                >
                    {inputLabel} {requiredField && requiredField === true && <span className='text-red-400'>*</span>}
                </label>
                <label 
                    className={`text-xs text-red-400`}
                >
                    {hasError}
                </label>
            </div>
            <input 
                id={fieldId} 
                type="date" 
                className={`rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
            /> 
        </div>
    )
}

export default DateField