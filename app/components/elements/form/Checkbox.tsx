import CheckIcon from '../icons/CheckIcon'
import type { ReactNode } from 'react'

type CheckboxProps = {
  CheckboxLabel: ReactNode
  checkboxToggleFunction: () => void
  isChecked?: boolean
  hasError?: boolean
}

const Checkbox = ({
  CheckboxLabel,
  checkboxToggleFunction,
  isChecked = false,
  hasError = false,
}: CheckboxProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      onClick={checkboxToggleFunction}
      className="flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00E58E]/20"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition duration-200 ease-out ${
          isChecked
            ? 'border-[#02BC75] bg-[#00E58E] text-[#020402]'
            : 'border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-[#080d0a]'
        } ${hasError ? 'border-red-500' : ''}`}
      >
        {isChecked && <CheckIcon className="h-4 w-4" />}
      </span>
      <span className={`mt-0.5 text-sm leading-6 ${hasError ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
        {CheckboxLabel}
      </span>
    </button>
  )
}

export default Checkbox