import React from "react";
export type spinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadSpinnerProps {
    size?: spinnerSize
}

const getSizeValue = (size:spinnerSize) => {
    switch (size) {
        case 'xs': return 5;
        case 'sm': return 6;
        case 'md': return 8;
        case 'lg': return 9;
        case 'xl': return 11;
    }
}

function LoadSpinner({size}:LoadSpinnerProps) {
    return (
        <svg className={`relative flex animate-spin w-${getSizeValue(size ?? 'md')} h-${getSizeValue(size ?? 'md')}`} fill="none" viewBox="0 0 24 24">
            <circle className="absolute w-full h-full rounded-full border-2 border-b-primary opacity-25" cx="12" cy="12"
                    r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="absolute w-full h-full rounded-full border-2 border-b-primary opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"></path>
        </svg>
    )
}

export default LoadSpinner