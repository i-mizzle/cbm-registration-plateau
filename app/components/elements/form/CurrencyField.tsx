import React, { useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import InlinePreloader from '../InlinePreloader'

type CurrencyFieldProps = {
    inputLabel: string
    requiredField?: boolean
    fieldId: string
    hasError?: string | boolean
    returnFieldValue: (value: number | undefined) => void
    preloadValue?: number | string
    disabled?: boolean
    includeButton?: boolean
    buttonLabel?: string
    buttonProcessing?: boolean
    buttonAction?: () => void
    bgClass?: string
    currencySymbol?: string
    autoFocus?: boolean
    maximumAmount?: number
}

const CurrencyField = ({
    inputLabel,
    requiredField,
    fieldId,
    hasError,
    returnFieldValue,
    preloadValue = '',
    disabled,
    includeButton,
    buttonLabel,
    buttonProcessing,
    buttonAction,
    currencySymbol,
    autoFocus,
    maximumAmount,
}: CurrencyFieldProps) => {
    const [isFocused, setIsFocused] = useState(Boolean(autoFocus))
    const [fieldValue, setFieldValue] = useState<number | string | undefined>(preloadValue)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const focusField = () => {
        setIsFocused(true)
        inputRef.current?.focus()
    }


    const setValue = (value: number | undefined) => {
        const capped =
            maximumAmount !== undefined && value !== undefined && value > maximumAmount
                ? maximumAmount
                : value
        setFieldValue(capped)
        returnFieldValue(capped)
    }

    return (
        <div
            className={`w-full cursor-text border rounded p-4 relative z-0 ${isFocused || fieldValue !== '' ? 'border-black bg-white' : 'border-black bg-gray-100'} ${hasError ? 'border-red-600' : ''}`}
            onClick={focusField}
            onBlur={() => setIsFocused(false)}
        >
            <div className="flex items-center justify-between">
                <label
                    htmlFor={fieldId}
                    className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200
                    ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
                >
                    {inputLabel} {requiredField && <span className='text-red-400'>*</span>}
                </label>
                <span className="text-xs text-red-400">{typeof hasError === 'string' ? hasError : ''}</span>
            </div>

            <NumericFormat
                id={fieldId}
                getInputRef={inputRef}
                thousandsGroupStyle="thousand"
                value={fieldValue}
                prefix={currencySymbol ? currencySymbol : '$'}
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                disabled={disabled}
                autoFocus={autoFocus}
                className="z-30 border-transparent bg-transparent outline-none w-full font-bold placeholder:text-slate-400 placeholder:font-outfit"
                onValueChange={(values) => setValue(values.floatValue)}
            />
            {includeButton && (
                <button
                    type="button"
                    disabled={buttonProcessing}
                    className="flex items-center justify-center w-24 text-center py-2 text-sm rounded bg-gray-200 text-black absolute z-40 right-4 top-3 hover:bg-black hover:text-white transition duration-200"
                    onClick={() => buttonAction?.()}
                >
                    {buttonProcessing ? <InlinePreloader /> : buttonLabel}
                </button>
            )}
        </div>
    )
}

export default CurrencyField
