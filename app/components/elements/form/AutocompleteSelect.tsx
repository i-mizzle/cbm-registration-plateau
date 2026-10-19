import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types';
import PlusIcon from '../icons/PlusIcon';
import InlinePreloader from '../InlinePreloader';
import CheckIcon from '../icons/CheckIcon';
import { useOutsideAlerter } from './SelectField';
import { debounce } from '../../../../utils/utils';

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
    position='top-[90px]',
    disableAutocomplete=false,
    enableSearch=false,
    searchFunction,
    searchInProgress=false
}) => {
    const [activeValue, setActiveValue] = useState(preSelected && preSelectedLabel ? preSelected[preSelectedLabel] : '')
    const [visibleOptions, setVisibleOptions] = useState(selectOptions)
    const [optionsOpen, setOptionsOpen] = useState(false)

    const debouncedSearch = useMemo(() => {
        if (!enableSearch || !searchFunction) {
            return null
        }
        return debounce(searchFunction, 3000)
    }, [enableSearch, searchFunction])

    useEffect(() => {
        return () => {
            if (debouncedSearch?.cancel) {
                debouncedSearch.cancel()
            }
        }
    }, [debouncedSearch])

    useEffect(() => {
        setVisibleOptions(selectOptions || [])
    }, [selectOptions])

    useEffect(() => {
        const preSelect = () => {
            if(!preSelected || preSelected === undefined) {
                return
            }

            if (preSelectedLabel && preSelected[preSelectedLabel]) {
                setActiveValue(preSelected[preSelectedLabel])
                return
            }
    
            selectOptions?.forEach((option) => {
                if (preSelectedLabel && preSelectedLabel !== '' && option[preSelectedLabel] && option[preSelectedLabel] === preSelected) {
                    setActiveValue(option[titleField])
                }

                if ((!preSelectedLabel || preSelectedLabel === '') && option === preSelected) {
                    setActiveValue(option)
                }
            })
        }
        preSelect()
    
    }, [preSelected, preSelectedLabel, selectOptions, titleField])


    const openOptions = () => {
        if(disabled) {return}
        setOptionsOpen(true)
    }

    const closeOptions = () => {
        setOptionsOpen(false)
    }

    const filterOptions = (term) => {
        if(enableSearch && enableSearch === true && searchFunction) {
            debouncedSearch?.(term)
            setActiveValue(term)
            return
        } 
        const filtered = selectOptions.filter((option)=> {
            if (titleField && titleField !== '') {
                return option[titleField].toLowerCase().includes(term.toLowerCase())
            } else {
                return option.toLowerCase().includes(term.toLowerCase())
            }
        })
        setActiveValue(term)
        setVisibleOptions(filtered)

    }

    const changeActiveValue = (value, object) => {
        setActiveValue(value)
        returnFieldValue(object)
        closeOptions()
    }

    const [conditionalItemProcessing, setConditionalItemProcessing] = useState('');
    const fireConditionalAction = async (option) => {
        setConditionalItemProcessing(option[conditionalItemStyling.itemIdentifier])

        await conditionalItemStyling.action(option)
        setTimeout(() => {
            setConditionalItemProcessing('')        
        }, 3000);
    }

    const wrapperRef = useRef(null);
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
                            <button key={optionIndex} 
                                className={
                                    `relative w-full capitalize p-3 my-1 flex flex-row text-left items-center gap-x-3 text-sm transition duration-200 hover:bg-gray-100 
                                    ${conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] == true 
                                        ? conditionalItemStyling.classes 
                                        : 'text-gray-500'}`
                                } 
                                
                                onClick={()=>{
                                    if(conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] === true) {
                                        fireConditionalAction(option)
                                    } else {
                                        changeActiveValue(titleField && titleField !== '' ? option[titleField] : option, option)}
                                    }
                                }
                            >
                                {displayImage && !bgImage &&
                                    <img alt="" src={option[imageField]} className='w-7.5' />
                                }

                                {displayImage && bgImage &&
                                    <div className='w-8.75 h-8.75 rounded-full' style={{
                                        backgroundImage: `url(${ option[imageField]})`, backgroundSize: 'cover', backgroundPosition: 'center'
                                    }} />
                                }
                                {/* <img alt="" src={option[imageField]} className='w-[30px]' /> */}

                                {conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey]}

                                
                                <div className='w-full'>
                                    <span className='dark:text-at-white block font-space-grotesk'>{titleField && titleField !== '' ? option[titleField] : option}</span>
                                    {option.description && <span className='text-xs dark:text-at-white/70'>{option.description}</span>}
                                </div>
                                
                                {conditionalItemStyling && option[conditionalItemStyling.conditionTriggerKey] === true && !conditionalItemStyling.actionProcessed && conditionalItemStyling.includeButton &&
                                    <>
                                        {conditionalItemProcessing === option[conditionalItemStyling.itemIdentifier] ?
                                            <span className='absolute right-12 w-5'>
                                                <InlinePreloader />
                                            </span>
                                            :
                                            <span className={`${conditionalItemStyling.buttonClasses}`}>
                                                {conditionalItemStyling.itemProcessed === option[conditionalItemStyling.itemIdentifier] ?
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
                            <button className='absolute -bottom-13.75 left-[10%] right-auto w-[80%] px-3 py-4 text-center text-sm bg-black font-tomato transition duration-200 hover:bg-gray-800 text-white flex items-center justify-center gap-x-1' onClick={()=>{buttonAction()}}>
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

AutocompleteSelect.propTypes = {
    selectOptions: PropTypes.array.isRequired,
    inputLabel: PropTypes.string.isRequired,
    titleField: PropTypes.string.isRequired,
    displayImage: PropTypes.bool.isRequired,
    imageField: PropTypes.string,
    fieldId: PropTypes.string.isRequired,
    hasError: PropTypes.bool,
    includeButton: PropTypes.bool,
    buttonLabel: PropTypes.string,
    buttonAction: PropTypes.func,
    returnFieldValue: PropTypes.func.isRequired
};

export default AutocompleteSelect
