import React from 'react'
import { twMerge } from "tailwind-merge"

interface ComponentWrapperProps {
    children: React.ReactNode,
    className?: string
}

function ComponentWrapper({children,className}: ComponentWrapperProps) {
    return (
        <div className={twMerge('container h-full max-w-full lg:max-w-[500px] mx-auto',className)}>
            {children}
        </div>
    )
}

export default ComponentWrapper