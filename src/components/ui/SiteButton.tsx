import React from "react";
import { Button, ButtonProps } from "@heroui/button"
import { PropsWithChildren } from 'react'
import {twMerge} from "tailwind-merge";
interface SiteButtonProps
    extends PropsWithChildren,
        Omit<ButtonProps, "color"> {
    variant?: 'static' | 'sticky' | 'sticky_auto',
    wrapperClassName?: string,
    id?: string
}
function SiteButton(props: SiteButtonProps) {
    const { id,color, className, wrapperClassName , disabled = false, children, variant = 'sticky' ,...rest } = props;
    const positionClassName = variant === 'static' ? '' : `${variant === 'sticky' ? 'mt-auto' : ''} sticky bottom-[30px] left-[30px] right-[30px] z-[1]`;
    const classTransformed = `font-secondary ${disabled ? "opacity-[0.5] pointer-events-none" : ""} w-full rounded-2xl flex-shrink-0 !text-white bg-pr-black text-large h-[50px]`;

    return (
        <div className={`${twMerge(`bg-transparent w-full flex ${positionClassName}`,wrapperClassName)}`}>
            <Button id={id} className={twMerge(classTransformed,className)} color={'default'} disabled={disabled} {...rest}>
                {children}
            </Button>
        </div>
    );
}

export default SiteButton;