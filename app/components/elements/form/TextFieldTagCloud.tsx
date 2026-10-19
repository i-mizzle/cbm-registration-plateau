import React, { useCallback, useEffect, useRef, useState } from 'react'
import CloseIcon from '../icons/CloseIcon'

const TextFieldTagCloud = ({
    inputLabel, 
    fieldId, 
    inputPlaceholder,
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
    autoFocus,
    maxLength,
    maxTags,
    requiredField
}) => {
    const inputRef = useRef(null)
    const [ isFocused, setIsFocused ] = useState(false)
    const [ fieldValue, setFieldValue ] = useState('')

    const focusField = useCallback(() => {
        setIsFocused(true)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    useEffect(() => {
        if (autoFocus === true && inputRef.current) {
            inputRef.current.focus()
        }
    }, [autoFocus])

    const setValue = (value) => {
        setFieldValue(value)
        // returnFieldValue(value)
    }

    const [tags, setTags] = useState(preloadValue ? preloadValue : [])

    const addTag = (e) => {
        if(disabled){
            return
        }
        if (e) {
            e.preventDefault()
        }

        const newTag = fieldValue.trim()
        if (!newTag) {
            return
        }

        if(tags.length === maxTags) {
            return
        }

        if(tags.includes(newTag)) {
            focusField()
            return
        }
        
        const tempTags = [...tags]
        tempTags.push(newTag)
        setTags(tempTags)

        returnFieldValue(tempTags)
        setFieldValue('')
        focusField()
    }

    const handleKeyDown = (e) => {
        if (disabled) {
            return
        }

        if (e.key === 'Backspace' && !fieldValue) {
            if (tags.length === 0) {
                return
            }

            const tempTags = tags.slice(0, -1)
            setTags(tempTags)
            returnFieldValue(tempTags)
            return
        }

        const delimiterKeys = ['Enter', 'Tab', ',']
        if (delimiterKeys.includes(e.key)) {
            if (!fieldValue.trim()) {
                return
            }
            addTag(e)
        }
    }

    const removeTag = (toDelete) => {
        if(disabled){
            return
        }
        const tempTags = [...tags]
        const removed = tempTags.filter((tag)=>{
            return tag !== toDelete
        }) 
        setTags(removed)
        returnFieldValue(removed)   
    }


    return (
        <>
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
            <div 
                className={`rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`}
                onClick={()=>{focusField()}} 
                onBlur={()=>{setIsFocused(false)}}
            >
                {/* {fieldValue} */}

                <div className='flex flex-wrap gap-3'>
                    {tags.map((tag, tagIndex)=>(
                        <span key={tagIndex} className='flex items-center gap-x-3 px-2 py-2 rounded bg-gray-100 dark:bg-at-black text-xs text-black dark:text-white w-max font-medium'>
                            {tag}
                            {!disabled && <button className='' onClick={()=>{removeTag(tag)}}>
                                <CloseIcon className={`w-4`} />
                            </button>}
                        </span>
                    ))}
                    {!disabled && <form onSubmit={(e)=>{addTag(e)}}>
                        <input 
                            id={fieldId} 
                            ref={inputRef}
                            type="text" 
                            maxLength={maxLength}
                            className={`z-30 border-transparent bg-transparent outline-none w-max w-inherit inline`} 
                            onFocus={()=>{setIsFocused(true)}} 
                            onChange={(e)=>{setValue(e.target.value)}}
                            onKeyDown={handleKeyDown}
                            placeholder={isFocused ? '' : inputPlaceholder}
                            value={fieldValue}
                            disabled={disabled}
                        />
                    </form>}
                </div>

            </div>
        </>
    )
}

export default TextFieldTagCloud