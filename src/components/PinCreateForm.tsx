import React, { useCallback, useState } from 'react'
import {useTranslation} from "react-i18next";
import PickMeIcon from "./icons/PickMeIcon";
import PinKeyboard from "./PinKeyboard";

interface PinCreateForm {
    onCreation: (val:string) => void
}

function PinCreateForm({onCreation}:PinCreateForm) {
    const {t} = useTranslation();
    const [isCreate, setIsCreate] = useState(true);
    const [isConfirm, setIsConfirm] = useState(false);
    const [resetHeuristicKey, setResetHeuristicKey] = useState(false);
    const [isError, setIsError] = useState(false)
    const [value, setValue] = useState('')
    const onFill = useCallback((val:string) => {
        if (isCreate) {
            setIsCreate(false);
            setIsConfirm(true);
            setValue(val);
            setResetHeuristicKey(!resetHeuristicKey)
        } else if (isConfirm) {
            if (value !== val) {
                setIsError(true)
            } else {
                onCreation(val);
            }
        }
    },[isCreate,isConfirm,value])

    const onReset = () => {
        setIsCreate(true);
        setIsConfirm(false);
        setIsError(false);
        setValue('');
        setResetHeuristicKey(!resetHeuristicKey)
    }

    return (
        <>
            <div className={'h-[30%] flex flex-col'}>
                <div className={'text-4xl flex justify-center text-white-reversed'}>
                    <div className={'flex mx-auto rounded-full bg-black-reversed'}>
                        <PickMeIcon />
                    </div>
                </div>
                <div
                    className={'mt-8 text-4xl font-bold text-center'}>{isCreate ? t('createNewPin') : <div id={'confirm_new_pin'}>{t('confirmNewPin')}</div>}</div>
                {
                    isError ? <div className={'mt-4 text-center'}>
                    {t('pinIsIncorrect')}
                    </div> : null
                }
            </div>
            <PinKeyboard onFill={onFill} additionalBtnOnclick={onReset} additionalBtn={<div className={'text-sm'}>{t('reset')}</div>}
                         //@ts-ignore
                         key={resetHeuristicKey} isError={isError}/>
        </>
    )
}

export default PinCreateForm