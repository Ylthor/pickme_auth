import React, { ReactNode, createContext, useRef, useContext } from "react";
import {createOtpConfirmStore, OtpConfirmStore} from "../stores/otp-confirm-store";
// @ts-ignore
import {useStore} from "zustand";

export type OtpConfirmStoreApi = ReturnType<typeof createOtpConfirmStore>;

export const OtpConfirmStoreContext = createContext<OtpConfirmStoreApi | undefined>(
    undefined,
);

export const otpConfirmStoreTest = createOtpConfirmStore();
export interface OtpConfirmStoreProviderProps {
    children: ReactNode;
}

export const OtpConfirmStoreProvider = ({ children }: OtpConfirmStoreProviderProps) => {
    //@ts-ignore
    const storeRef = useRef<OtpConfirmStoreApi>();

    if (!storeRef.current) {
        storeRef.current = otpConfirmStoreTest;
    }

    return (
        <OtpConfirmStoreContext.Provider value={storeRef.current}>
            {children}
        </OtpConfirmStoreContext.Provider>
    );
};

export const useOtpConfirmStore = <T,>(selector: (store: OtpConfirmStore) => T): T => {
    const otpConfirmStoreContext = useContext(OtpConfirmStoreContext);

    if (!otpConfirmStoreContext) {
        throw new Error(`OtpConfirm store error`);
    }

    return useStore(otpConfirmStoreContext, selector);
};
