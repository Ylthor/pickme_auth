import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from "@heroui/modal"
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { Options } from 'qr-code-styling'
import {Formik, FormikProps} from "formik";
import QrCodeComponent, {DEFAULT_QR_OPTIONS} from "./ui/QrCode";
import {useAuth} from "../auth-store-provider";
import ApiService from "../service/ApiService";
import SiteButton from "./ui/SiteButton";
import ComponentWrapper from "./ui/ComponentWrapper";
import CloseIcon from "./icons/CloseIcon";
import ArrowBack from "./icons/ArrowBack";
import InputCode from "./form/InputCode";
import AppStoreIcon from "./icons/AppStoreIcon";
import GooglePlayIcon from "./icons/GooglePlayIcon";

function GoogleAuth() {
    const {t} = useTranslation();
    const formikRef = useRef<FormikProps<any>>(null);
    const [isVerify, setIsVerify] = useState(false);
    const [availableMethods, setAvailableMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //@ts-ignore
    const [googleQr, setGoogleQr] = useState<any>(null)
    const [qrOptions, setQrOptions] = useState<Options>(DEFAULT_QR_OPTIONS);
    const {onClose} = useDisclosure();
    const [windowOpen, setWindowOpen] = useState<boolean>(false);
    const { email } =
        useAuth((state) => state);

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
            //@ts-ignore
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

    const onClick = () => {
        const promise = ApiService.fetchData({
            url: "/v2/auth/enable-google-authenticator",
            method: "post",
        },{});
        setIsLoading(true)
        promise.then((res) => {
            setWindowOpen(true);
            //@ts-ignore
            setGoogleQr(res.data.data)
            setQrOptions((prev) => ({
                ...prev,
                //@ts-ignore
                data: res.data.data.qr_code
            }))
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const onVerifyClick = (values:any) => {
        setIsLoading(true)
        const promise = ApiService.fetchData({
            url: "/v2/auth/verify-google-authenticator-otp",
            method: "post",
            data: {
                code: values.code
            }
        },{});

        promise.then((res) => {
            //@ts-ignore
            toast.success(res.data.data.message);
            onClose();
            setWindowOpen(false);
            setIsVerify(false);
            getAllowedVerifyMethods();
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const validationSchema = Yup.object().shape({
        code: Yup.string()
            .length(6, t('incorrectCode'))
            .required(t('codeRequired')),
    });

    const submitForm = () => {
        formikRef?.current?.submitForm();
    };

    const disableGoogleAuth = () => {
        if (window.confirm(t('doYouWantToDisableGoogleAuth'))) {
            setIsLoading(true);
            const promise = ApiService.fetchData({
                url: "/v2/auth/disable-google-authenticator",
                method: "post",
            },{});

            promise.then((res) => {
                //@ts-ignore
                toast.success(res.data.data.message ?? t('googleAuthDisabled'));
                setWindowOpen(false);
                setIsVerify(false);
                getAllowedVerifyMethods();
            }).finally(() => {
                setIsLoading(false)
            })
        } else return
    }

    const onWindowClose = () => {
        setWindowOpen(false);
        setIsVerify(false);
    }

    const googleAllowed = useMemo(() => {
        if (availableMethods.length > 0) {
            const google = availableMethods.find((el) => el.type === 'google_authenticator');
            if (google) {
                return google.enabled
            }
        }
        return false
    },[availableMethods])

    const setVerifyCode = () => {
        setIsVerify(true);
    }

    const goBack = () => {
        setIsVerify(false);
    }

    return (
        <>
            <div className={'flex flex-col mt-10 px-4'}>
                <div className={'flex justify-between mt-4 items-center w-full'}>
                    <div className={'text-lg'}>{t('googleAuth')}</div>
                    <SiteButton isLoading={isLoading || availableMethods.length === 0}
                                id={'google_auth_btn'}
                                onClick={googleAllowed ? disableGoogleAuth : onClick} variant={'static'}
                                className={'text-md w-auto py-3 h-auto'}
                                wrapperClassName={'w-auto'}>{googleAllowed ? t('disable') : t('enable')}</SiteButton>
                </div>
                {
                    windowOpen ?
                        <div
                            className={'fixed z-[1000] top-0 left-0 bottom-0 right-0 w-full h-full bg-pr-reversed'}>
                            <ComponentWrapper className={'flex-grow flex flex-col relative'}>
                                <div onClick={onWindowClose}
                                     className={'absolute right-3 p-1 top-[26px] lg:top-[40px] text-pr-black text-3xl cursor-pointer'}>
                                    <CloseIcon />
                                </div>
                                {
                                    isVerify ?
                                        <div onClick={goBack}
                                             className={'absolute left-3 p-1 top-[26px] lg:top-[40px]  text-pr-black text-2xl cursor-pointer'}>
                                            <ArrowBack />
                                        </div> : null
                                }
                                <div
                                    className={'h-full overflow-y-auto flex flex-col items-center gap-4 px-[20px] pt-[26px] lg:px-[40px] lg:pt-[40px]'}>
                                    {
                                        isVerify ? <>
                                            <h1 className={'text-center mb-4'}>{t('enterCode')}</h1>
                                            <div className={'flex flex-col gap-4 mt-10'}>
                                                <Formik
                                                    enableReinitialize={true}
                                                    initialValues={{ code: '' }}
                                                    innerRef={formikRef}
                                                    validateOnBlur={false}
                                                    validateOnChange={false}
                                                    validationSchema={validationSchema}
                                                    onSubmit={onVerifyClick}
                                                >
                                                    {() => {
                                                        return (
                                                            <>
                                                                <div
                                                                    className={'text-xl'}>{t('enterGoogleAuthCode')}</div>
                                                                <InputCode
                                                                    signs={6}
                                                                    name={'code'}
                                                                    onChange={() => {
                                                                        setTimeout(() => {
                                                                            submitForm()
                                                                        }, 10)
                                                                    }}
                                                                />
                                                                <SiteButton
                                                                    variant={'static'}
                                                                    className={'h-[46px] w-full'}
                                                                    isLoading={isLoading}
                                                                    onClick={submitForm}
                                                                >
                                                                    {t('verifyCode')}
                                                                </SiteButton>
                                                            </>
                                                        )
                                                    }}
                                                </Formik>
                                            </div>
                                        </> : <>
                                            <h1 className={'text-center mb-4'}>{t('scanQrCodeToEnable')}</h1>
                                            <div className={'my-auto flex flex-col gap-6 w-full items-center'}>
                                                {/*<CopyRow text={googleQr?.qr_code} className={'max-w-full'} label={''} />*/}
                                                <div className={'text-center text-xl'}>
                                                    {t('downloadGoogleAuthenticator')}
                                                </div>
                                                <div
                                                    className={'flex flex-col w-full max-w-[320px] xms:max-w-[360px] lg:max-w-full'}>
                                                    <div
                                                        className={'w-full gap-4 grid grid-cols-2 mb-6 xms:mb-8 lg:mb-10'}>
                                                        <a
                                                            className={'!text-white bg-pr-black rounded-xl p-3 flex justify-between items-center'}
                                                            href={'https://apps.apple.com/ru/app/google-authenticator/id388497605'}
                                                            target={'_blank'}>
                                                            <div>App store</div>
                                                            <div className={'text-2xl'}>
                                                                <AppStoreIcon />
                                                            </div>
                                                        </a>
                                                        <a className={'!text-white bg-pr-black rounded-xl p-3 flex justify-between items-center'}
                                                           href={'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'}
                                                           target={'_blank'}>
                                                            <div>Google play</div>
                                                            <div className={'text-2xl'}>
                                                                <GooglePlayIcon />
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className={'w-full pt-[100%] relative'}>
                                                        <div className={'absolute w-full h-full top-0 left-0'}>
                                                            <QrCodeComponent
                                                                wrapperClassName={'w-full p-6 lg:p-8'}
                                                                qrOptionsForced={qrOptions} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'text-center text-xl'}>
                                                    {t('enterCodeFromGoogleAuth')}
                                                </div>
                                            </div>
                                            <SiteButton
                                                id={'verify_google_code'}
                                                variant={'sticky'}
                                                className={'h-[46px] w-full'}
                                                isLoading={isLoading}
                                                onClick={setVerifyCode}
                                            >
                                                {t('verifyCode')}
                                            </SiteButton>
                                        </>
                                    }
                                </div>
                            </ComponentWrapper>
                        </div> : null
                }
            </div>
        </>
    )
}

export default GoogleAuth