import { useState } from 'react'

type RadioItem = {
    label: string
    description?: string
}

type RadioGroupProps = {
    items: RadioItem[]
    returnSelected: (item: RadioItem) => void
    hasError?: string | boolean
    inputLabel: string
    requiredField?: boolean
    inline?: boolean
    preSelectedIndex?: number
}

const RadioGroup = ({
    items,
    returnSelected,
    hasError,
    inputLabel,
    requiredField,
    inline,
    preSelectedIndex,
}: RadioGroupProps) => {
    const [selectedOption, setSelectedOption] = useState(preSelectedIndex)

    const selectOption = (index: number, item: RadioItem) => {
        setSelectedOption(index)
        returnSelected(item)
    }

    return (
        <div className='max-w-full'>
            <div className="flex items-center justify-between">
                <label 
                    className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
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
            <div
                className={`w-full ${inline && 'flex gap-x-3 gap-y-1 items-center'}`}
                role="radiogroup"
                aria-label={inputLabel}
            >
                {items.map((item, itemIndex)=>(
                <button
                    type="button"
                    role="radio"
                    aria-checked={selectedOption === itemIndex}
                    onClick={() => selectOption(itemIndex, item)}
                    key={itemIndex}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00E58E]/20 ${
                        selectedOption === itemIndex
                            ? 'border-[#02BC75] bg-[#00E58E]/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#101512] dark:hover:border-slate-600 dark:hover:bg-[#151b17]'
                    } ${inline ? 'min-w-0 flex-1' : 'my-2'} ${hasError ? 'border-red-400' : ''}`}
                >
                    <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition duration-200 ${
                            selectedOption === itemIndex
                                ? 'border-[#02BC75]'
                                : 'border-slate-300 dark:border-slate-600'
                        }`}
                    >
                        {selectedOption === itemIndex && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#02BC75]" />
                        )}
                    </span>
                    <span className="min-w-0">
                        <span className="block text-sm font-medium text-[#171717] dark:text-slate-100">{item.label}</span>
                        {item.description && !inline && (
                            <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</span>
                        )}
                    </span>
                </button>
                ))
                }
            </div>
        </div>
    )
}

export default RadioGroup