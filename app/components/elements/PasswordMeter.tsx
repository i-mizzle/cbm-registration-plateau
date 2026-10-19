const levels = [
    { label: 'Too short', color: 'bg-red-400' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-lime-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
]

export function scorePassword(password: string) {
    if (password.length < 8) return 0
    let score = 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
}

const PasswordMeter = ({ password }: { password: string }) => {
    const score = password ? scorePassword(password) : 0
    const { label, color } = levels[score]

    return (
        <div className="mt-2" aria-live="polite">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                    <span
                        key={segment}
                        className={`h-1 flex-1 rounded ${password && segment <= score ? color : 'bg-gray-200'}`}
                    />
                ))}
            </div>
            {password && <p className="mt-1 text-xs text-gray-500">{label}</p>}
        </div>
    )
}

export default PasswordMeter
