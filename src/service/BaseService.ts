import axios from "axios";
import { useDeviceSelectors } from "react-device-detect";

import toast from 'react-hot-toast'
import i18n from 'i18next'
import {authStoreTest} from "../providers/auth-store-provider";
import {REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE} from "./ApiService";
import {otpConfirmStoreTest} from "../providers/otp-confirm-store-provider";

const unauthorizedCode = [401];

const baseURL = "https://admin.birs.app";

const BaseService = axios.create({
    timeout: 60000,
    baseURL: baseURL,
});

BaseService.interceptors.request.use(
    (config) => {
        if (config.method === "GET" || config.method === "get")
            config.paramsSerializer = { indexes: null };

        const access_token = authStoreTest.getState().access_token;
        const [selectors] = useDeviceSelectors(window.navigator.userAgent);

        config.headers["X-Brand"] = selectors.mobileVendor;
        config.headers["X-Device-Model"] = selectors.mobileModel;
        config.headers["X-System-Name"] = selectors.osName;
        config.headers["X-System-Version"] = selectors.osVersion;
        config.headers["X-Browser-Name"] = selectors.browserName;
        config.headers["X-Browser-Version"] = selectors.browserVersion;
        config.headers["X-Browser-Full-Version"] = selectors.fullBrowserVersion;
        //@ts-ignore
        if (config.idempotentKey) {
            //@ts-ignore
            config.headers["X-Idempotent-Key"] = config.idempotentKey;
        }
        //@ts-ignore
        if (config.otpCode && config.otpType) {
            //@ts-ignore
            config.headers['X-Otp'] = config.otpCode;
            //@ts-ignore
            config.headers['X-Otp-Type'] = config.otpType;
        }
        if (access_token) {
            config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

const otpConfirmAction = (config:any,onfalse: () => void) => {
    const otpConfirmState = otpConfirmStoreTest.getState();
    const authState = authStoreTest.getState();
    const email = authState.email;
    otpConfirmState.setOpen(
    {
            needConfirm: true,
            email: email ?? '',
            onConfirm: (res:any) => {
                config?.onResolve?.(res);
            },
            onError: (err:any) => {
                if (err.status === 403) {
                    toast.error(i18n.t('incorrectCode'));
                } else {
                    const msg = err.response.data.message.message;
                    toast.error(msg ?? i18n.t('defaultWarning'))
                    otpConfirmState.setClose();
                }
            }
        }
    )
    otpConfirmState.setUrlDataToReuseOnConfirm(
        {
                url: config.url,
                method: config.method,
                data: config.data,
                params: config.params,
                idempotentKey: config.idempotentKey,
                onResolve: (res:any) => {
                    config?.onResolve?.(res);
                },
                onError: (err:any) => {
                    if (err.status === 403) {
                        toast.error(i18n.t('incorrectCode'));
                    } else {
                        const msg = err.response.data.message.message;
                        toast.error(msg ?? i18n.t('defaultWarning'))
                        otpConfirmState.setClose();
                    }
                }
        }
    );
    return onfalse
}

const refreshTokenAction = async (config: any, onfalse: () => void) => {
    const authState = authStoreTest.getState();
    const refresh_token = authState.refresh_token;

    if (refresh_token) {
        //@ts-ignore
        const instance = axios.create({
            baseURL: baseURL,
            //@ts-ignore
            headers: {
                Authorization: 'Bearer ' + refresh_token
            },
            timeout: 2000
        });

        //@ts-ignore
        instance.interceptors.response.use(
            //@ts-ignore
            (res: any) => {
                if (res) {
                    authState.setAuth({
                        ...res.data.data,
                        isAuth: true,
                    });
                }

                if (config) {
                    return tryOldRequest(config);
                }

                return {};
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        return await instance.post("/v2/auth/refresh");
    } else {
        // store.dispatch(signOutSuccess())
        return onfalse;
    }
};

const tryOldRequest = async (config: any) => {
    return await BaseService(config);
};

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response && unauthorizedCode.includes(response.status)) {
            //@ts-ignore
            return refreshTokenAction(response.config, Promise.reject(error));
        } else if (response && response.status === 403) {
            //@ts-ignore
            return otpConfirmAction(response.config, Promise.reject(error));
        } else {
            return Promise.reject(error);
        }
    },
);

export default BaseService;
