import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling, {
    CornerDotType,
    CornerSquareType,
    DotType,
    DrawType,
    ErrorCorrectionLevel,
    Mode,
    Options,
    TypeNumber
} from 'qr-code-styling'
import {useSiteAttributeStore} from "../../providers/site-attribute-store-provider";
import {twMerge} from "tailwind-merge";

interface QRCodeProps {
    varToTriggerUpdate?: any,
    qrOptionsForced?: any,
    wrapperClassName?: string,
    className?: string
}

export const DEFAULT_QR_OPTIONS = {
    width: 100,
    height: 100,

    type: 'svg' as DrawType,
    image: '/img/logo-dark-streamline.png',
    margin: 0,
    qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: 'anonymous',
    },
    dotsOptions: {
        color: 'currentColor',
        type: 'rounded' as DotType
    },
    backgroundOptions: {
        color: 'transparent',
    },
    cornersSquareOptions: {
        type: 'extra-rounded' as CornerSquareType,
        color: 'currentColor'
    },
    cornersDotOptions: {
        type: 'dot' as CornerDotType,
        color: 'currentColor'
    }
}

function QrCodeComponent({varToTriggerUpdate,qrOptionsForced,wrapperClassName,className}:QRCodeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const refWrapper = useRef<HTMLDivElement>(null);
    const [qrOptions, setQrOptions] = useState<Options>(DEFAULT_QR_OPTIONS);
    const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(qrOptions));
    const {colorScheme} = useSiteAttributeStore((store) => store);
    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [qrCode, ref,varToTriggerUpdate]);

    useEffect(() => {
        setQrOptions((prev) => ({
            ...prev,
            ...qrOptionsForced
        }))
    }, [qrOptionsForced])

    useEffect(() => {
        setQrOptions((prev) => ({
            ...prev,
            image: `/img/logo-${colorScheme}-streamline.png`,
        }))
    }, [colorScheme])

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries:any) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    const s = entry.contentBoxSize[0];
                    setQrOptions((prev) => ({
                        ...prev,
                        width: s.inlineSize,
                        height: s.inlineSize
                    }))
                }
            }
        });

        resizeObserver.disconnect();
        if (refWrapper.current) {
            resizeObserver.observe(refWrapper.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [refWrapper,varToTriggerUpdate]);

    useEffect(() => {
        if (!qrCode) return;
        qrCode.update(qrOptions);
    }, [qrCode, qrOptions]);

    return (
        <div ref={refWrapper} className={twMerge('bg-gray-main flex rounded-[20px] p-8 relative',wrapperClassName)}>
            <div className={twMerge('w-full',className)} ref={ref}></div>
        </div>
    )
}

export default QrCodeComponent