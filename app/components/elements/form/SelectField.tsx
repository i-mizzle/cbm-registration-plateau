import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export type SelectOption = {
  id: number | string
  name: string
  label?: string
  code?: string
}

type SelectFieldProps = {
  disabled?: boolean
  selectOptions: SelectOption[]
  inputLabel: string
  titleField: keyof SelectOption
  fieldId: string
  hasError?: string | boolean
  returnFieldValue: (option: SelectOption) => void
  preSelectedIndex?: number
  preSelected?: string | number
  preSelectedLabel?: keyof SelectOption
  requiredField?: boolean
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter<T extends HTMLElement>(
  ref: RefObject<T | null>,
  closeFunction: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        closeFunction();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeFunction, ref]);
}

const SelectField = ({
  disabled,
  selectOptions,
  inputLabel,
  titleField,
  hasError,
  returnFieldValue,
  preSelectedIndex,
  preSelected,
  preSelectedLabel,
  requiredField,
  fieldId,
}: SelectFieldProps) => {
  const [activeValue, setActiveValue] = useState(() => {
    if (preSelected !== undefined && preSelectedLabel) {
      const selectedOption = selectOptions.find(
        (option) => option[preSelectedLabel] === preSelected
      );
      return selectedOption ? String(selectedOption[titleField]) : '';
    }
    if (preSelectedIndex !== undefined && selectOptions[preSelectedIndex]) {
      return String(selectOptions[preSelectedIndex][titleField]);
    }
    return '';
  });

  const changeActiveValue = (valueIndex: string) => {
    if (valueIndex !== '') {
      const selectedOption = selectOptions[Number(valueIndex)];
      if (selectedOption) {
        setActiveValue(String(selectedOption[titleField]));
        returnFieldValue(selectedOption);
      }
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedOptionIndex =
    preSelected !== undefined && preSelectedLabel
      ? selectOptions.findIndex(
          (option) => option[preSelectedLabel] === preSelected
        )
      : selectOptions.findIndex(
          (option) => String(option[titleField]) === activeValue
        );

  return (
    <div ref={wrapperRef} className="relative w-full">
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

        <select
          id={fieldId}
          className={`block w-full rounded-xl border bg-[#F7F7F9] px-4 py-3.5 text-sm text-[#171717] transition duration-200 ease-out focus:border-[#02BC75] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00E58E]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#101512] dark:text-slate-100 dark:focus:bg-[#151b17] ${hasError ? 'border-red-400' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'}`}
          onChange={(e) => { changeActiveValue(e.target.value); }}
          value={selectedOptionIndex < 0 ? '' : selectedOptionIndex}
          disabled={disabled}
        >
          <option value="">
            Select an option
          </option>
          {selectOptions.map((option, optionIndex) => (
            <option value={optionIndex} key={optionIndex}>
              {option[titleField]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
