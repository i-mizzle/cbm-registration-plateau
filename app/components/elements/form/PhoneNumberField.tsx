import React, { useState, useRef, useEffect } from 'react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import ChevronIcon from '../icons/ChevronIcon'

const PhoneNumberField = ({
    requiredField,
    inputLabel, 
    inputPlaceholder,
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled
}) => {
    const [fieldValue, setFieldValue] = useState(preloadValue || '')
    const [selectedCountry, setSelectedCountry] = useState('NG')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    // Get all countries with their calling codes
    const getCountriesList = () => {
        const countries = getCountries()
        return countries.map(code => {
            const callingCode = getCountryCallingCode(code)
            const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(code)
            return {
                code,
                callingCode,
                name: countryName || code
            }
        }).sort((a, b) => a.name.localeCompare(b.name))
    }

    const countries = getCountriesList()
    const selectedCountryCode = countries.find(c => c.code === selectedCountry)?.callingCode || '234'

    // Filter countries based on search term
    const filteredCountries = countries.filter(country => {
        const searchLower = searchTerm.toLowerCase()
        return (
            country.name.toLowerCase().includes(searchLower) ||
            country.code.toLowerCase().includes(searchLower) ||
            country.callingCode.includes(searchLower)
        )
    })

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCountrySelect = (countryCode) => {
        setSelectedCountry(countryCode)
        setDropdownOpen(false)
        setSearchTerm('')
    }

    const setValue = (value) => {
        // Remove alphabetic characters, only allow digits and common phone number characters
        const filteredValue = value.replace(/[a-zA-Z]/g, '')
        
        setFieldValue(filteredValue)
        let phoneNumber = filteredValue
        
        // For Nigerian numbers, remove leading 0 if present
        if (selectedCountry === 'NG' && phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1)
        }
        
        const fullNumber = `+${selectedCountryCode}${phoneNumber}`
        returnFieldValue(fullNumber)
    }

    return (
        <div className='max-w-full'>
            {inputLabel && inputLabel !== '' && (
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
            )}

            <div className={`flex items-center gap-x-2 rounded py-4 px-4 text-sm w-full focus-within:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:text-slate-400 placeholder:font-outfit   ${
                    hasError ? 'border-red-400' : 'border-transparent'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {/* Country Code Selector */}
                <div className='relative w-16' ref={dropdownRef}>
                    <button
                        type='button'
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        disabled={disabled}
                        className={`flex items-center justify-between font-outfit focus:outline-none pr-2 border-r border-at-dark-gray/40 ${disabled ? 'cursor-not-allowed' : ''}`}
                    >
                        <span className='text-sm font-medium '>+{selectedCountryCode}</span>
                        <ChevronIcon className={`w-3 h-3 ml-1.5 -rotate-90 transition ${dropdownOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className='absolute top-full left-0 right-0 mt-1 bg-at-black border border-at-dark-gray/40 rounded shadow-lg z-50 w-44'>
                            {/* Search Input */}
                            <input
                                type='text'
                                placeholder='Search country...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-3 py-3 border-b border-at-dark-gray/40 text-xs focus:outline-none focus:border-at-dark-gray/50'
                            />

                            {/* Countries List */}
                            <div className='max-h-60 overflow-y-auto'>
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map(country => (
                                        <button
                                            key={country.code}
                                            type='button'
                                            onClick={() => handleCountrySelect(country.code)}
                                            className={`w-full text-left px-3 py-3 text-xs font-outfit hover:bg-at-dark-gray/20 transition ${
                                                selectedCountry === country.code ? 'bg-at-black text-at-white' : ''
                                            }`}
                                        >
                                            <span className='font-medium'>{country.name}</span>
                                            <span className='text-gray-500 ml-2'>(+{country.callingCode})</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className='px-3 py-2 text-xs text-gray-500 text-center'>
                                        No countries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <input 
                    id={fieldId} 
                    type='text'
                    className={`focus:outline-none w-full`}
                    onChange={(e) => setValue(e.target.value)}
                    value={fieldValue}
                    disabled={disabled}
                    placeholder={inputPlaceholder}
                />
            </div>
        </div>
    )
}

export default PhoneNumberField
