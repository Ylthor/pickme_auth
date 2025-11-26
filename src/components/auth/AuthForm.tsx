import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Formik, FormikProps} from "formik";
import * as Yup from "yup";
import DefaultInput from "../form/DefaultInput";
import SiteButton from "../ui/SiteButton";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {useAuthStore} from "../../providers/auth-store-provider";
import {useOtpConfirmStore} from "../../providers/otp-confirm-store-provider";
import {Provider} from "../../provider";

function AuthForm() {
    const {
        is_anonymous,
        email: emailFromStore,
        setUserInfo,
        setAuthToken,
    } = useAuthStore((state) => state);
    const {
        setOpen,
    } = useOtpConfirmStore((state) => state);
    const {t} = useTranslation();
    const [waitingForCode, setWaitingForCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formikRef = useRef<FormikProps<any>>(null);
    const submitForm = () => {
        formikRef?.current?.submitForm();
    };

    const formState = useMemo(() => {
        if ((!emailFromStore || is_anonymous) && !waitingForCode) return "email";
        if (waitingForCode) return "code";

        return null;
    }, [emailFromStore, waitingForCode]);

    const onEnter = useCallback(() => {
        if (formState) submitForm();
    }, [formState]);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            onEnter();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const onSubmit = (values: any) => {
        setIsLoading(true);
        const getLocalstorageUserInfo = () => {
            const ls = localStorage.getItem("user");

            if (ls) return JSON.parse(ls);
        };

        if (formState === 'email' && values.email) {
            setOpen({
                needConfirm: true,
                email: values.email,
                onConfirm: (res:any) => {
                    const tokens = res.data.data;
                    const { access_token, refresh_token } = tokens;

                    void setAuthToken({
                        access_token: access_token,
                        refresh_token: refresh_token,
                    });
                    void setUserInfo({ email: values.email });
                    const localInfo = getLocalstorageUserInfo();

                    localStorage.setItem(
                        "user",
                        JSON.stringify({ ...(localInfo ?? {}), email: values.email }),
                    );
                    setWaitingForCode(false);
                },
                onError: (err:any) => {
                    //@ts-ignore
                    toast(err.response?.data?.message, { type: "error" });
                },
                onFinally: () => {
                    setIsLoading(false);
                }
            })

            return;
        }
        setIsLoading(false);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required(t('emailRequired')),
    })

    return (
        <Provider>
            <Formik
                enableReinitialize={true}
                initialValues={{email: ''}}
                innerRef={formikRef}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values }) => {
                    return (
                        <>
                            <>
                                <div className={"w-full gap-1 flex flex-col items-start"}>
                                    <h5>
                                        {t('enterEmail')}
                                    </h5>
                                    <span className={"text-large mt-[6px]"}>
                                            {t('loginOrJoin',{name:'Pick Me'})}
                                        </span>
                                </div>
                                <DefaultInput
                                    isClearable={false}
                                    type={'email'}
                                    name={"email"}
                                    placeholder={"example@example.com"}
                                    value={values?.email}
                                />
                            </>
                            <SiteButton
                                id={'login_continue_button'}
                                variant={'static'}
                                className={"h-[46px] w-full"}
                                isLoading={isLoading}
                                onClick={submitForm}
                            >
                                {t('continue')}
                            </SiteButton>
                        </>
                    );
                }}
            </Formik>
        </Provider>
    );
}

export default AuthForm;