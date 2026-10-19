import { Switch } from '@headlessui/react';
import React from 'react'

const ToggleSwitch = ({label, description, toggle, checked}) => {
  return (
    <div className='w-full flex items-start justify-between gap-x-5 p-3 bg-gray-100 dark:bg-slate-900/20'>
        <div className="w-full">
            <h3 className='text-at-black dark:text-at-white text-[15px] font-[550]'>{label}</h3>
            <p className='text-xs text-gray-500 dark:text-slate-300'>{description}</p>
        </div>
        <div className='w-15'>
            <Switch
                checked={checked}
                onChange={toggle}
                className={`${
                    checked ? 'bg-accent/20 dark:bg-at-dark-gray/30' : 'bg-gray-200 dark:bg-at-dark-gray/20'
                } relative inline-flex items-center h-6 cursor-pointer rounded-full w-10 mt-2`}
                >
                <span
                className={`transform transition ease-in-out duration-200 ${
                    checked ? 'translate-x-5 bg-accent dark:bg-accent-dark' : 'translate-x-1 bg-white dark:bg-slate-700'
                } inline-block w-4 h-4 transform rounded-full`}
                />
            </Switch>
        </div>
    </div>
  )
}

export default ToggleSwitch