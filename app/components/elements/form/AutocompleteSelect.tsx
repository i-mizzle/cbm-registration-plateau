import React, { useState, useEffect, useRef, useMemo } from 'react'
import PlusIcon from '../icons/PlusIcon'
import InlinePreloader from '../InlinePreloader'
import CheckIcon from '../icons/CheckIcon'
import { useOutsideAlerter } from './SelectField'
import { debounce } from '@/lib/debounce'

export type AutocompleteOption = string | ({ description?: string } & Record<string, unknown>)

type ConditionalItemStyling = {
    conditionTriggerKey: string
    itemIdentifier: string
    classes?: string
    includeButton?: boolean
    buttonClasses?: string
    buttonLabel?: string
    actionProcessed?: boolean
    itemProcessed?: unknown
    action: (option: AutocompleteOption) => Promise<void> | void
}

type AutocompleteSelectProps = {
    selectOptions: AutocompleteOption[]
    inputLabel: string
    placeholderText?: string
    displayImage?: boolean
    imageField?: string
    bgImage?: boolean
    titleField?: string
    preSelected?: AutocompleteOption
    preSelectedLabel?: string
    hasError?: string | boolean
    returnFieldValue: (option: AutocompleteOption) => void
    includeButton?: boolean
    buttonLabel?: string
    buttonAction?: () => void
    disabled?: boolean
    requiredField?: boolean
    conditionalItemStyling?: ConditionalItemStyling
    position?: string
    disableAutocomplete?: boolean
    enableSearch?: boolean
    searchFunction?: (term: string) => void
    searchInProgress?: boolean
}

const getField = (option: AutocompleteOption, key?: string): unknown =>
    key && typeof option !== 'string' ? option[key] : option

const getText = (option: AutocompleteOption, key?: string) => {
    const value = getField(option, key)
    return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const AutocompleteSelect = ({
    selectOptions,
    inputLabel,
    placeholderText,
    displayImage,
    imageField,
    bgImage,
    titleField,
    preSelected,
    preSelectedLabel,
    hasError,
    returnFieldValue,
    includeButton,
    buttonLabel,
    buttonAction,
    disabled,
    requiredField,
    conditionalItemStyling,
    position = 'top-[90px]',
    disableAutocomplete = false,
    enableSearch = false,
    searchFunction,
    searchInProgress = false,
}: AutocompleteSelectProps) => {
    const preselectedText = useMemo(() => {
        if (!preSelected) {
            return ''
        }

        if (preSelectedLabel && getText(preSelected, preSelectedLabel)) {
            return getText(preSelected, preSelectedLabel)
        }

        const match = selectOptions?.find((option) =>
            preSelectedLabel ? getField(option, preSelectedLabel) === preSelected : option === preSelected,
        )
        if (!match) {
            return ''
        }
        return preSelectedLabel ? getText(match, titleField) : getText(match)
    }, [preSelected, preSelectedLabel, selectOptions, titleField])

    // typedValue overrides the preselected text until the preselection changes
    const [typedValue, setTypedValue] = useState<string | null>(null)
    const [lastPreselectedText, setLastPreselectedText] = useState(preselectedText)
    if (lastPreselectedText !== preselectedText) {
        setLastPreselectedText(preselectedText)
        setTypedValue(null)
    }
    const activeValue = typedValue ?? preselectedText
    const setActiveValue = setTypedValue

    const [filterTerm, setFilterTerm] = useState('')
    const visibleOptions = useMemo(() => {
        if (!filterTerm || (enableSearch && searchFunction)) {
            return selectOptions || []
        }
        return selectOptions.filter((option) =>
            getText(option, titleField).toLowerCase().includes(filterTerm.toLowerCase()),
        )
    }, [filterTerm, enableSearch, searchFunction, selectOptions, titleField])
    const [optionsOpen, setOptionsOpen] = useState(false)

    const debouncedSearch = useMemo(() => {
        if (!enableSearch || !searchFunction) {
            return null
        }
        return debounce(searchFunction, 3000)
    }, [enableSearch, searchFunction])

    useEffect(() => {
        return () => debouncedSearch?.cancel()
    }, [debouncedSearch])

    const openOptions = () => {
        if (disabled) { return }
        setOptionsOpen(true)
    }

    const closeOptions = () => {
        setOptionsOpen(false)
    }

    const filterOptions = (term: string) => {
        if (enableSearch && searchFunction) {
            debouncedSearch?.(term)
            setActiveValue(term)
            return
        }
        setActiveValue(term)
        setFilterTerm(term)
    }

    const changeActiveValue = (value: string, option: AutocompleteOption) => {
        setActiveValue(value)
        setFilterTerm('')
        returnFieldValue(option)
        closeOptions()
    }

    const [conditionalItemProcessing, setConditionalItemProcessing] = useState('')
    const fireConditionalAction = async (option: AutocompleteOption) => {
        if (!conditionalItemStyling) { return }
        setConditionalItemProcessing(getText(option, conditionalItemStyling.itemIdentifier))

        await conditionalItemStyling.action(option)
        setTimeout(() => {
            setConditionalItemProcessing('')
        }, 3000)
    }

    const wrapperRef = useRef<HTMLDivElement>(null);
    useOutsideAlerter(wrapperRef, closeOptions);


    return (
        // <div className='w-full relative'>
        <div  ref={wrapperRef} className='relative w-full'>
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
                
                {/* Text input */}
                <input 
                    type="text" 
                    className={`rounded py-4 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-at-dark-gray border bg-at-black/5 dark:bg-at-dark-gray/5 transition duration-200 focus:bg-white dark:focus:bg-at-black/60 font-outfit placeholder:text-slate-400 placeholder:font-outfit capitalize  ${hasError ? 'border-red-400' : 'border-transparent'}`}
                    onClick={()=>{openOptions()}}  
                    onFocus={()=>{openOptions()}}  
                    placeholder={placeholderText}
                    readOnly={disabled || disableAutocomplete}
                    // onBlur={()=>{closeOptions()}} 
                    onChange={(e)=>{filterOptions(e.target.value)}}
                    value={activeValue} 
                />
            </div>
            {/* Options */}
            {optionsOpen && !disabled && 
                <div className={`absolute shadow-lg border border-gray-200 dark:border-at-dark-gray/10 shadow-at-black/5 rounded w-full left-0 py-1 bg-white dark:bg-at-black overflow-y-scroll pt-1 z-50 scrollbar-hidden ${position}`} 
                style={{
                    maxHeight: '450px', 
                    paddingBottom:'5px'
                }}>
                    {/* <button className='absolute top-3 right-3 text-gray-600 hover:text-gray-400 transition duration-200' onClick={()=>{closeOptions()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button> */}
                    <div className='relative'>
                        {searchInProgress && <InlinePreloader />}
                        {!searchInProgress && visibleOptions.map((option, optionIndex) => (
                            <button type='button' key={optionIndex}
                                className={
                                    `relative w-full capitalize p-3 my-1 flex flex-row text-left items-center gap-x-3 text-sm transition duration-200 hover:bg-gray-100 
                                    ${conditionalItemStyling && getField(option, conditionalItemStyling.conditionTriggerKey) === true 
                                        ? conditionalItemStyling.classes 
                                        : 'text-gray-500'}`
                                } 
                                
                                onClick={()=>{
                                    if(conditionalItemStyling && getField(option, conditionalItemStyling.conditionTriggerKey) === true) {
                                        fireConditionalAction(option)
                                    } else {
                                        changeActiveValue(getText(option, titleField), option)}
                                    }
                                }
                            >
                                {displayImage && !bgImage &&
                                    <img alt="" src={getText(option, imageField)} className='w-7.5' />
                                }

                                {displayImage && bgImage &&
                                    <div className='w-8.75 h-8.75 rounded-full' style={{
                                        backgroundImage: `url(${ getText(option, imageField)})`, backgroundSize: 'cover', backgroundPosition: 'center'
                                    }} />
                                }
                                {/* <img alt="" src={getText(option, imageField)} className='w-[30px]' /> */}

                                
                                
                                <div className='w-full'>
                                    <span className='dark:text-at-white block font-space-grotesk'>{getText(option, titleField)}</span>
                                    {typeof option !== 'string' && option.description && <span className='text-xs dark:text-at-white/70'>{option.description}</span>}
                                </div>
                                
                                {conditionalItemStyling && getField(option, conditionalItemStyling.conditionTriggerKey) === true && !conditionalItemStyling.actionProcessed && conditionalItemStyling.includeButton &&
                                    <>
                                        {conditionalItemProcessing === getText(option, conditionalItemStyling.itemIdentifier) ?
                                            <span className='absolute right-12 w-5'>
                                                <InlinePreloader />
                                            </span>
                                            :
                                            <span className={`${conditionalItemStyling.buttonClasses}`}>
                                                {conditionalItemStyling.itemProcessed === getField(option, conditionalItemStyling.itemIdentifier) ?
                                                    <CheckIcon className={`w-4 h-4 text-green-500`} />
                                                    :
                                                    conditionalItemStyling.buttonLabel
                                                }
                                            </span>
                                        }
                                    </>
                                }
                            </button>
                        ))}
                        {/* Footer Button */}
                        {includeButton && includeButton === true &&
                            <button type='button' className='absolute -bottom-13.75 left-[10%] right-auto w-[80%] px-3 py-4 text-center text-sm bg-black font-tomato transition duration-200 hover:bg-gray-800 text-white flex items-center justify-center gap-x-1' onClick={()=>{buttonAction?.()}}>
                                <PlusIcon className={`w-4 h-4`}/>
                                {buttonLabel}
                            </button>
                        }
                    </div>
                </div>
            }            
        </div>
    )
}

export default AutocompleteSelect
