import type { ReactNode } from 'react'

type FormButtonProps = {
  buttonLabel: ReactNode
  buttonAction?: () => void
  processing?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
}

const FormButton = ({
  buttonLabel,
  buttonAction,
  processing = false,
  disabled = false,
  type = 'button',
  variant = 'primary',
}: FormButtonProps) => {
  const isDisabled = processing || disabled

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={buttonAction}
      className={`font-display flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00E58E]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-[#00E58E] text-[#020402] shadow-sm shadow-[#00E58E]/20 hover:-translate-y-0.5 hover:bg-[#02BC75] hover:shadow-md'
          : 'border border-slate-200 bg-white text-[#171717] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#101512] dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-[#151b17]'
      }`}
    >
      {processing ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      ) : null}
      {buttonLabel}
    </button>
  )
}

export default FormButton