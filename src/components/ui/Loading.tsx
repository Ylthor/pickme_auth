import React from "react";
import LoadSpinner from "../LoadSpinner";
import {spinnerSize} from "../LoadSpinner";

interface LoadingProps {
    loading: boolean,
    className?: string,
    spinnerSize?: spinnerSize
}

function Loading({loading, className,spinnerSize}: LoadingProps) {
    if (loading) return (
        <>
            <div className={`mt-auto flex text-pr-t-black ${className}`}>
                <LoadSpinner size={spinnerSize ?? 'lg'}/>
            </div>
        </>
    )

    return null
}

export default Loading