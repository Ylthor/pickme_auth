import React, {JSX, useEffect, useState} from 'react'
import Loading from "./ui/Loading";
import DeleteIcon from "./icons/DeleteIcon";

interface PinKeyboardProps {
    onFill: (val: string) => void,
    isError?: boolean,
    additionalBtn?: JSX.Element,
    additionalBtnOnclick?: () => void
}

function PinKeyboard({isError,onFill,additionalBtn,additionalBtnOnclick}: PinKeyboardProps) {
    const [value, setValue] = useState<string>('');
    const [filled, setFilled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false)
    const onDelete = () => {
        setValue((prev) => prev.slice(0, -1));
        setFilled(false);
    }

    const btnPressed = (v:string) => {
        if (value.length === 4)
            return;

        const newVal = value + v;
        if (newVal.length === 4) {
            setTimeout(() => {
                setIsLoading(true);
                setTimeout(() => {
                    setFilled(true);
                    onFill(newVal);
                    setIsLoading(false)
                },750)
            },250)
        }
        setValue(newVal);
    }

    const onKeyPress = (e: any) => {
        if (['0','1','2','3','4','5','6','7','8','9'].includes(e.key)) {
            btnPressed(e.key)
        } else if (e.key === 'Backspace') {
            onDelete();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', onKeyPress);

        return () => {
            window.removeEventListener('keydown', onKeyPress);
        }
    }, [value])

    return (
        <div className={'flex flex-col w-full flex-grow mt-auto'}>
            <div className={`flex gap-8 justify-center mb-auto relative ${isLoading ? 'dots-loading' : ''}`}>
                {
                    Array.from(Array(4).keys()).map((_, i) => {
                        return <div key={`dot_${i}`} className={`dot dot-${i} rounded-full w-4 h-4 ${i < value.length ? 'blob_active bg-green-main' : 'bg-pr-black'} ${filled && isError ? '!bg-red-main' : ''}`}></div>
                    })
                }
                <Loading loading={isLoading} className={'absolute inset-0 flex items-center justify-center'} spinnerSize={'xs'}></Loading>
            </div>
            <div className={'grid grid-cols-3 gap-y-6 gap-x-2 mt-12'} id={'pin_keyboard'}>
                {Array.from(Array(12).keys()).map((_, i) => {
                    if (i < 9) {
                        return <div className={'flex justify-center'} key={`pin_key_${i}`} id={`pin_key_${i}`}>
                        <div
                                className={'cursor-pointer py-5 w-[65px] rounded-md active:bg-gray-main text-center text-[25px]'}
                                onClick={() => btnPressed(`${i + 1}`)}>
                                {i + 1}
                            </div>
                        </div>
                    } else if (i === 9) {
                        return additionalBtn ? <div className={'flex justify-center'} key={'keyboard_additional_btn'}>
                            <div
                                className={'cursor-pointer flex justify-center py-5.5 w-[65px] rounded-md active:bg-gray-main text-center text-[21px]'}
                                onClick={additionalBtnOnclick}>
                                {additionalBtn}
                            </div>
                        </div> : <div key={'keyboard_spacer'}></div>
                    } else if (i === 10) {
                        return <div className={'flex justify-center'} key={'pin_key_00'}>
                            <div
                                className={'cursor-pointer  py-5 w-[65px] rounded-md active:bg-gray-main text-center text-[25px]'}
                                onClick={() => btnPressed('0')}>
                            0
                            </div>
                        </div>
                    } else {
                        return <div className={'flex justify-center'} key={'pin_key_delete'}>
                            <div
                                className={'cursor-pointer flex justify-center py-5.5 w-[65px] rounded-md active:bg-gray-main text-center text-[21px]'}
                                onClick={onDelete}>
                                <DeleteIcon />
                            </div>
                        </div>
                    }
                })}
            </div>
        </div>
    )
}

export default PinKeyboard