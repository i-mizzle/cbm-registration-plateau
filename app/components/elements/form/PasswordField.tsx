import React, { useState } from 'react'
import type { MouseEvent } from 'react'
import EyeIcon from '../icons/EyeIcon'
import EyeOffIcon from '../icons/EyeOffIcon'
import PasswordMeter from '../PasswordMeter'

type PasswordFieldProps = {
    requiredField?: boolean
    inputLabel: string
    fieldId: string
    hasError?: string | boolean
    returnFieldValue: (value: string) => void
    preloadValue?: string
    disabled?: boolean
    inputPlaceholder?: string
    maxLength?: number
    showPasswordMeter?: boolean
}

const PasswordField = ({
    requiredField,
    inputLabel, 
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    inputPlaceholder,
    maxLength,
    showPasswordMeter,
}: PasswordFieldProps) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue ?? '')
    const [ hiddenInput, setHiddenInput ] = useState(true)
    // const id = generateCode(12)

    // const [fieldId, setFieldId] = useState(id)

    const toggleHiddenInput = (e: MouseEvent) => {
        e.preventDefault()
        setHiddenInput(!hiddenInput)
    }

    const setValue = (value: string) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div className='relative'
        >
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

            <span className={`absolute z-40 cursor-pointer pt-2 top-11 right-4`} onClick={(e)=>{toggleHiddenInput(e)}}>
                {hiddenInput ?
                <EyeIcon className={`w-5 h-5 text-gray-600 dark:text-gray-300`} />
                :
                <EyeOffIcon className={`w-5 h-5 text-gray-600 dark:text-gray-300`} />}
            </span>

            <input 
                id={fieldId} 
                type={hiddenInput ? 'password' : "text"} 
                maxLength={maxLength}
                className={`rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray  border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:text-slate-400 placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`} 
                placeholder={inputPlaceholder}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
            />

            {showPasswordMeter === true && <PasswordMeter password={fieldValue} />}


            

        </div>
    )
}
export default PasswordField