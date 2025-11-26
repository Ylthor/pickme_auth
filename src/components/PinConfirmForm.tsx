import React, { useCallback, useState } from 'react'
import {useTranslation} from "react-i18next";
import {useAuthStore} from "../providers/auth-store-provider";
import PickMeIcon from "./icons/PickMeIcon";
import PinKeyboard from "./PinKeyboard";

interface PinConfirmFormProps {
    onConfirm: () => void
}

function PinConfirmForm({onConfirm}: PinConfirmFormProps) {
    const {t} = useTranslation()
    const [isError, setIsError] = useState(false)
    const { pin } =
        useAuthStore((state) => state);
    const onFill = useCallback((val:string) => {
        if (pin !== val) {
            setIsError(true)
        } else {
            setIsError(false);
            onConfirm();
        }
    },[pin])

    return (
        <>
            <div className={'h-[30%] flex flex-col'} >
                <div className={'text-4xl flex justify-center text-white-reversed'}>
                    <div className={'flex mx-auto rounded-full bg-black-reversed'}>
                        <PickMeIcon/>
                    </div>
                </div>
                <div className={'mt-8 text-4xl font-bold text-center'}>{t('enterPin')}</div>
                {
                    isError ? <div className={'mt-4 text-center'}>
                        {t('pinIsIncorrect')}
                    </div> : null
                }
            </div>
            <PinKeyboard onFill={onFill} isError={isError}/>
        </>
    )
}

export default PinConfirmForm