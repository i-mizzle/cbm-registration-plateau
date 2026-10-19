import { useState } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

type TextFieldProps = {
    requiredField?: boolean
    inputLabel: string
    inputPlaceholder?: string
    fieldId: string
    hasError?: string | boolean
    returnFieldValue: (value: string) => void
    preloadValue?: string
    disabled?: boolean
    maxLength?: number
    inputType?: HTMLInputTypeAttribute
    inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
    autoComplete?: string
}

const TextField = ({
    requiredField,
    inputLabel, 
    inputPlaceholder,
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    maxLength,
    inputType = 'text',
    inputMode,
    autoComplete,
}: TextFieldProps) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue || '')

    const setValue = (value: string) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <label 
                    htmlFor={fieldId}
                    className={`relative z-10 mb-1 block cursor-text py-1 text-sm font-medium transition duration-200  
                    ${hasError ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                    {inputLabel} {requiredField && requiredField === true && <span className='text-red-400'>*</span>}
                </label>
                <label 
                    className="text-xs text-red-600 dark:text-red-400"
                >
                    {hasError}
                </label>
            </div>

            <input 
                id={fieldId} 
                type={inputType}
                inputMode={inputMode}
                autoComplete={autoComplete}
                maxLength={maxLength}
                className={`block w-full rounded-xl border bg-[#F7F7F9] px-4 py-3.5 text-sm text-[#171717] placeholder:text-slate-400 transition duration-200 ease-out focus:border-[#02BC75] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00E58E]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#101512] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-[#151b17] ${hasError ? 'border-red-400' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'}`}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
                placeholder={inputPlaceholder}
            />

            {maxLength && maxLength > 0 && <p className={`mt-1 text-[11px] ${fieldValue.length > maxLength ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-slate-300'}`}>Max {maxLength} Characters</p>}

        </div>
    )
}

export default TextField