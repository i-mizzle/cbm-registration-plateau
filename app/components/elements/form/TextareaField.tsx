import React, { useState } from 'react'

type TextareaFieldProps = {
    inputLabel: string
    fieldId: string
    maxLength?: number
    requiredField?: boolean
    hasError?: string | boolean
    returnFieldValue?: (value: string) => void
    preloadValue?: string
    disabled?: boolean
    inputPlaceholder?: string
}

const TextareaField = ({inputLabel, fieldId, maxLength, requiredField, hasError, returnFieldValue, preloadValue, disabled, inputPlaceholder}: TextareaFieldProps) => {

    const [ fieldValue, setFieldValue ] = useState(preloadValue || '')

    const setValue = (value: string) => {
        setFieldValue(value)
        if (returnFieldValue) {
            returnFieldValue(value)
        }
    }

    return (
        <div>
            {/* {fieldValue} */}
            <div className="flex items-center justify-between">
                <label
                    htmlFor={fieldId}
                    className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
                    ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
                >
                    {inputLabel} {requiredField && <span className='text-red-400'>*</span>}
                </label>
                <span className='text-xs text-red-400'>{typeof hasError === 'string' ? hasError : ''}</span>
            </div>
            <textarea 
                id={fieldId} 
                className={`auto-grow-textarea rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:font-outfit placeholder:text-slate-400 resize-none overflow-hidden ${hasError ? 'border-red-400' : 'border-transparent'} min-h-30`}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
                maxLength={maxLength}
                placeholder={inputPlaceholder}
                />
        </div>
    )
}

export default TextareaField