import React, { useState } from 'react'
import {NumericFormat} from 'react-number-format';

const NumberField = ({
    inputLabel, 
    fieldId, 
    inputPlaceholder, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    maxLength,
    requiredField
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
            
            <NumericFormat
                id={fieldId}
                thousandsGroupStyle="thousand"
                value={fieldValue}
                prefix=""
                decimalSeparator="."
                displayType="input"
                type="text"
                maxLength={maxLength}
                thousandSeparator={true}
                placeholder={inputPlaceholder}
                disabled={disabled}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={false}
                className={`rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:text-slate-400 placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`}
                onValueChange={(values, sourceInfo)=>{setValue(values.floatValue)}}
            />
        </div>
    )

}

export default NumberField