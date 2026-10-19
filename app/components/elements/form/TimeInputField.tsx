import React, { useState } from 'react'
import TimeField from 'react-simple-timefield-for-react18-temp';
import TimeIcon from '../icons/TimeIcon';

const TimeInputField = ({inputLabel, requiredField, fieldId, hasError, preloadValue,  returnFieldValue}) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue || '')


    const setValue = (value) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div className='relative' 
        >
            <label 
                className={`text-sm lg:text-md cursor-text z-10 relative py-1 block mb-1 transition duration-200  
                ${hasError ? 'text-red-600' : 'text-gray-500'}`}
            >
             {requiredField && requiredField === true && <span className='text-red-600'>*</span>}   {inputLabel}
            </label>

            <TimeField
                value={fieldValue}                       // {String}   required, format '00:00' or '00:00:00'
                onChange={(event, value) => {setValue(value)}} // {Function} required
                input={<input id={fieldId} type='text' className={`rounded py-3 px-3 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 hover:bg-gray-50 border bg-gray-100  transition duration-200 focus:bg-white font-outfit placeholder:font-outfit  ${hasError ? 'border-red-600' : 'border-gray-100'}`}  />}   // {Element}  default: <input type="text" />
                colon=":"                          // {String}   default: ":"
                showSeconds={false}                        // {Boolean}  default: false
            />
            <TimeIcon className='absolute top-9.25 right-2.5 text-gray-400 w-5 h-5 z-50' />
        </div>
    )
}

export default TimeInputField