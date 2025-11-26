import React, { ReactNode, createContext, useRef, useContext } from "react";
// @ts-ignore
import { useStore } from "zustand";
import {AuthStore, createAuthStore} from "../stores/auth-store";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
    undefined,
);

export const authStoreTest = createAuthStore();
export interface AuthStoreProviderProps {
    children: ReactNode;
}

export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
    //@ts-ignore
    const storeRef = useRef<AuthStoreApi>();

    if (!storeRef.current) {
        storeRef.current = authStoreTest;
    }

    return (
        <AuthStoreContext.Provider value={storeRef.current}>
            {children}
        </AuthStoreContext.Provider>
    );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
    const authStoreContext = useContext(AuthStoreContext);

    if (!authStoreContext) {
        throw new Error(`Auth store error`);
    }

    return useStore(authStoreContext, selector);
};
