import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid';
import {useOtpConfirmStore} from "../providers/otp-confirm-store-provider";
import ApiService from "../service/ApiService";
import {setNewInterval} from "../functions/intervalFunc";
import {getCallbackFuncsByKey} from "../functions/utils";
import ComponentWrapper from "./ui/ComponentWrapper";
import CloseIcon from "./icons/CloseIcon";
import InputCode from "./form/InputCode";
import SiteButton from "./ui/SiteButton";
import Loading from "./ui/Loading";

let mainTimeInterval: ReturnType<typeof setInterval>;
let resendTimeInterval: ReturnType<typeof setInterval>;
let dataLoadedTimeOut: ReturnType<typeof setInterval>;

function ConfirmWindow() {
    const {t} = useTranslation();
    const [availableMethods, setAvailableMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const formikRef = useRef<FormikProps<any>>(null);
    const [googleAllowed, setGoogleAllowed] = useState<boolean | null>(null);
    const [mainTime, setMainTime] = useState<number | null>(null);
    const [resendTime, setResendTime] = useState<number | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [uuid, setUuid] = useState<string | null>(null);
    const {
        needConfirm,
        email,
        urlDataToReuseOnConfirm,
        onConfirm,
        onError,
        onFinally,
        setClose,
    } = useOtpConfirmStore((state) => state);
    const submitForm = () => {
        if (!isLoading)
            formikRef?.current?.submitForm();
    };

    const isCloseAble = useMemo(() => {
        return !!(needConfirm && urlDataToReuseOnConfirm && urlDataToReuseOnConfirm.url);
    },[needConfirm,urlDataToReuseOnConfirm])

    const googleEnabled = useMemo(() => {
        if (availableMethods.length > 0) {
            const google = availableMethods.find((el) => el.type === 'google_authenticator');
            if (google) {
                return google.enabled
            }
        }
        return false
    },[availableMethods])

    useEffect(() => {
        if (availableMethods.length > 0) {
            const google = availableMethods.find((el) => el.type === 'google_authenticator');
            if (google) {
                setGoogleAllowed(google.enabled);
                return;
            }
            setGoogleAllowed(false);
        }
        setGoogleAllowed(null)
    }, [availableMethods])

    const getAllowedVerifyMethods = () => {
        setIsLoading(true);
        const promise = ApiService.fetchData({
            url: "/v2/auth/available-auth-methods",
            method: "get",
            params: {
                email: email
            }
        },{});

        promise.then((res) => {
            setAvailableMethods(res.data.data);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        if (email) {
            getAllowedVerifyMethods();
        }
    }, [email])

    const signs = googleAllowed ? 6 : 4;

    const validationSchema = Yup.object().shape({
        confirm_code: Yup.string()
            .length(signs, t('incorrectCode'))
            .required(t('codeRequired')),
    });

    const fireResendInterval = () => {
        clearInterval(resendTimeInterval);
        setResendTime(60);
        resendTimeInterval = setNewInterval(60000,(secondsLeft) => {
            setResendTime(secondsLeft === 0 ? null : secondsLeft);
        });
    };

    const sendOtpCode = (email: string) => {
        setResetLoading(true);
        const promise = ApiService.fetchData({
            url: "/v2/auth/send-otp",
            method: "post",
            data: {
                email: email,
            },
        },{});

        promise
            .then(() => {
                //@ts-ignore
                // setWaitingForCode(true);
                fireResendInterval();
            })
            .catch((err) => {
                //@ts-ignore
                toast(err.response?.data?.message, { type: "error" });
            })
            .finally(() => {
                setResetLoading(false);
                setIsLoading(false);
            });
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            submitForm();
        }
    };

    useEffect(() => {
        if (googleAllowed === null)
            return;

        if (needConfirm) {
            setMainTime(300);
            setDataLoaded(false);
            dataLoadedTimeOut = setInterval(() => {
                setDataLoaded(true);
                clearInterval(dataLoadedTimeOut)
            },50)
            mainTimeInterval = setNewInterval(300 * 1000,(secondsLeft) => {
                setMainTime(secondsLeft);
            });
            if (!googleAllowed) {
                sendOtpCode(email);
            } else {
                setDataLoaded(false)
                clearInterval(mainTimeInterval);
                clearInterval(resendTimeInterval);
            }
        } else {
            setDataLoaded(false)
            clearInterval(dataLoadedTimeOut)
            clearInterval(mainTimeInterval);
            clearInterval(resendTimeInterval);
        }
    }, [needConfirm,googleAllowed]);

    useEffect(() => {
        if (!isLoading)
            window.addEventListener("keydown", onKeyDown);
        else
            window.removeEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isLoading]);

    useEffect(() => {
        setUuid(uuidv4());
    },[])

    const verifyOtp = (values: any) => {
        setIsLoading(true);
        const promise = ApiService.fetchData({
            url: urlDataToReuseOnConfirm.url ?? "/v2/auth/check-otp",
            method: urlDataToReuseOnConfirm.method ?? "post",
            data: urlDataToReuseOnConfirm.data ? JSON.parse(urlDataToReuseOnConfirm.data) : {
                email: email,
                code: values.confirm_code,
            },
            ...(urlDataToReuseOnConfirm ? {
                otpCode: values.confirm_code,
                otpType: 'email'
            } : {}),
            ...getCallbackFuncsByKey(['onResolve','onError'],urlDataToReuseOnConfirm)
            //@ts-ignore
        },{idempotentKey: uuid});

        setResetLoading(true);
        promise
            .then((res) => {
                onConfirm?.(res);
                setTimeout(() => {
                    setClose()
                },0);
                fireResendInterval();
                setResetLoading(false);
            })
            .catch((err) => {
                onError?.(err);
            })
            .finally(() => {
                onFinally?.();
                setIsLoading(false);
            });

        return;
    }

    const verifyGoogle = (values: any) => {
        setIsLoading(true);
        const promise = ApiService.fetchData({
            url: urlDataToReuseOnConfirm?.url ?? "/v2/auth/login-google-authenticator",
            method: urlDataToReuseOnConfirm?.method ?? "post",
            data: urlDataToReuseOnConfirm.data ? JSON.parse(urlDataToReuseOnConfirm.data) : {
                email: email,
                code: values.confirm_code,
            },
            ...(urlDataToReuseOnConfirm ? {
                otpCode: values.confirm_code,
                otpType: 'google',
                ...getCallbackFuncsByKey(['onResolve','onError'],urlDataToReuseOnConfirm)
            } : {})
            //@ts-ignore
        },{idempotentKey: uuid});

        promise
            .then((res) => {
                onConfirm?.(res);
                setTimeout(() => {
                    setClose()
                },0)
            })
            .catch((err) => {
                onError?.(err);
            })
            .finally(() => {
                setIsLoading(false);
                onFinally?.();
            });

        return;
    }

    const onClose = () => {
        setClose();
    }

    const onSubmit = (values: any) => {
        if (googleAllowed) {
            verifyGoogle(values)
        } else {
            verifyOtp(values)
        }
    };

    const transformTime = (seconds: number | null, withBracers = false) => {
        if (seconds === null) return '';
        const m = ~~(seconds / 60);
        const s = seconds % 60;
        const tm = `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;

        if (withBracers) {
            return `( ${tm} )`;
        }

        return tm;
    };

    const forceOtpVerification = () => {
        setGoogleAllowed(false);
    }

    const forceGoogleAuth = () => {
        if (googleEnabled) {
            setGoogleAllowed(true);
        }
    }
    if (!needConfirm) {
        return <></>
    }

    return (
        <div
            className={'fixed z-[999] top-0 left-0 bottom-0 right-0 w-full h-full bg-pr-reversed'}>
            <ComponentWrapper className={'px-[20px] py-[26px] lg:px-[40px] lg:py-[40px] flex-grow flex flex-col gap-8 relative'}>
                {
                    isCloseAble ?
                        <div onClick={onClose} className={'text-3xl absolute top-4 right-4 cursor-pointer'}>
                            <CloseIcon />
                        </div> : null
                }

                <div className={'flex flex-col items-start gap-[20px] h-full'}>
                    {
                        dataLoaded ?
                            <Formik
                                enableReinitialize={true}
                                initialValues={{ confirm_code: '' }}
                                innerRef={formikRef}
                                validateOnBlur={false}
                                validateOnChange={false}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {() => {
                                    return (
                                        <>
                                            <div className={"w-full gap-1 flex flex-col items-start"}>
                                                <h5>
                                                    {t('enterConfirmCode')}
                                                </h5>
                                                <span className={"text-large mt-[6px]"}>
                                            {googleAllowed ? t('openGoogleAuth') : t('weSendCodeTo', { to: email })}
                                        </span>
                                            </div>
                                            <InputCode
                                                isLoading={isLoading}
                                                signs={signs}
                                                name={"confirm_code"}
                                                onChange={() => {
                                                    setTimeout(() => {
                                                        submitForm();
                                                    }, 10);
                                                }}
                                            />
                                            <SiteButton
                                                variant={'static'}
                                                className={"h-[46px] w-full"}
                                                isLoading={isLoading}
                                                onClick={submitForm}
                                            >
                                                {t('continue')}
                                            </SiteButton>
                                            {
                                                !googleAllowed ?
                                                    <div
                                                        className={
                                                            "w-full flex flex-col flex-grow gap-6"
                                                        }
                                                    >
                                                        <SiteButton
                                                            variant={'static'}
                                                            className={"w-full border-none bg-transparent !text-black-reversed text-lg py-2 h-auto"}
                                                            disabled={resendTime !== null}
                                                            isLoading={resetLoading}
                                                            onClick={() => sendOtpCode(email)}
                                                        >
                                                            {t('sendNewCode', { value: `${transformTime(resendTime, true)}` })}
                                                        </SiteButton>
                                                        {
                                                            googleEnabled ?
                                                                <SiteButton
                                                                    variant={'static'}
                                                                    className={"w-full border-none bg-transparent !text-black-reversed text-lg py-2 h-auto"}
                                                                    isLoading={isLoading}
                                                                    onClick={forceGoogleAuth}
                                                                >
                                                                    {t('useGoogleAuth')}
                                                                </SiteButton> : null
                                                        }
                                                        <div className={"mt-auto text-md w-full text-center"}>
                                                            {transformTime(mainTime)}
                                                        </div>
                                                    </div> : <SiteButton
                                                        variant={'static'}
                                                        className={"w-full border-none bg-transparent !text-black-reversed text-lg py-2 h-auto"}
                                                        isLoading={isLoading}
                                                        onClick={forceOtpVerification}
                                                    >
                                                        {t('useEmailVerification')}
                                                    </SiteButton>
                                            }
                                        </>
                                    );
                                }}
                            </Formik> : <Loading loading={true} className={'m-auto'} />
                    }
                </div>
            </ComponentWrapper>
        </div>
    )
}

export default ConfirmWindow