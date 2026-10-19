import React, { useState } from 'react'
import TimeIcon from '../icons/TimeIcon';

type TimeInputFieldProps = {
    inputLabel: string
    requiredField?: boolean
    fieldId: string
    hasError?: string | boolean
    preloadValue?: string
    returnFieldValue: (value: string) => void
}

const TimeInputField = ({inputLabel, requiredField, fieldId, hasError, preloadValue, returnFieldValue}: TimeInputFieldProps) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue || '')


    const setValue = (value: string) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div className='relative' 
        >
            <label
                htmlFor={fieldId}
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 block mb-1 transition duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && <span className='text-red-600'>*</span>}   {inputLabel}
            </label>

            <input
                id={fieldId}
                type='time'
                value={fieldValue}
                onChange={(event) => setValue(event.target.value)}
                className={`rounded py-3 px-3 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 hover:bg-gray-50 border bg-gray-100 transition duration-200 focus:bg-white font-outfit placeholder:font-outfit ${hasError ? 'border-red-600' : 'border-gray-100'}`}
            />
            <TimeIcon className='absolute top-9.25 right-2.5 text-gray-400 w-5 h-5 z-50' />
        </div>
    )
}

export default TimeInputField