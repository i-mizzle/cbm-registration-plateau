import React from 'react'

const CalendarWaitlistIcon = ({className}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            fill="none"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M7 1a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h8.101a7 7 0 0 1-1.427-2H5a1 1 0 0 1-1-1v-9h16v.29a7 7 0 0 1 2 .965V6a3 3 0 0 0-3-3h-1V2a1 1 0 1 0-2 0v1H8V2a1 1 0 0 0-1-1m9 5V5H8v1a1 1 0 0 1-2 0V5H5a1 1 0 0 0-1 1v3h16V6a1 1 0 0 0-1-1h-1v1a1 1 0 1 1-2 0"
                clipRule="evenodd"
            ></path>
            <path
                fill="currentColor"
                d="M17 16a1 1 0 1 1 2 0v1.703l.88.88a1 1 0 0 1-1.414 1.414l-1.173-1.173a1 1 0 0 1-.291-.765L17 18z"
            ></path>
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M24 18a6 6 0 1 1-12 0 6 6 0 0 1 12 0m-10.018 0a4.018 4.018 0 1 0 8.036 0 4.018 4.018 0 0 0-8.036 0"
                clipRule="evenodd"
            ></path>
        </svg>
    )
}

export default CalendarWaitlistIcon