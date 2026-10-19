import React, { useEffect, useState } from 'react'
import {NumericFormat} from 'react-number-format';
import InlinePreloader from '../InlinePreloader';

const CurrencyField = ({
    inputLabel, 
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    includeButton, 
    buttonLabel, 
    buttonProcessing,
    buttonAction,
    bgClass,
    currencySymbol,
    autoFocus,
    maximumAmount
}) => {
    const [ isFocused, setIsFocused ] = useState(false)
    const [ fieldValue, setFieldValue ] = useState(preloadValue)

    const focusField = () => {
        setIsFocused(true)
        document.getElementById(fieldId).focus()
    }

    useEffect(() => {
        if (autoFocus && autoFocus === true) {
            focusField()
        }
    }, [autoFocus, focusField])

    const setValue = (value) => {
        setFieldValue(value)
        if(maximumAmount && maximumAmount !== '' && value > maximumAmount) {
            setFieldValue(maximumAmount)
        }
        returnFieldValue(value)
    }

    return (
        <div 
            className={`w-full cursor-text border rounded p-4 relative z-0 ${isFocused || fieldValue !== '' ? 'border-black bg-white' : 'border-black bg-gray-100'} ${hasError && 'border-red-600'}`} 
            onClick={()=>{focusField()}} 
            onBlur={()=>{setIsFocused(false)}}
        >
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

            <NumericFormat
                id={fieldId}
                thousandsGroupStyle="thousand"
                value={fieldValue}
                prefix={currencySymbol && currencySymbol !== '' ? currencySymbol : "$"}
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                className="z-30 border-transparent bg-transparent outline-none w-full font-bold placeholder:text-slate-400 placeholder:font-outfit"
                onValueChange={(values, sourceInfo)=>{setValue(values.floatValue)}}
            />
            {includeButton && includeButton === true && 
            <button disabled={buttonProcessing} className={`flex items-center justify-center w-24 text-center py-2 text-sm rounded bg-gray-200 text-black absolute z-40 right-4 top-3 hover:bg-black hover:text-white transition duration-200`} onClick={()=>{buttonAction()}}>
               {buttonProcessing && buttonProcessing === true ? <InlinePreloader /> : buttonLabel}
            </button>
            }
        </div>
    )
}

export default CurrencyField