import React, { ReactNode, createContext, useRef, useContext } from "react";
// @ts-ignore
import { useStore } from "zustand";
import {createSiteAttributeStore, SiteAttributeStore} from "../stores/site-attribute-store";

export type SiteAttributeStoreApi = ReturnType<typeof createSiteAttributeStore>;

export const SiteAttributeStoreContext = createContext<SiteAttributeStoreApi | undefined>(
    undefined,
);

export const siteAttributeStoreTest = createSiteAttributeStore();
export interface SiteAttributeStoreProviderProps {
    children: ReactNode;
}

export const SiteAttributeStoreProvider = ({ children }: SiteAttributeStoreProviderProps) => {
    //@ts-ignore
    const storeRef = useRef<SiteAttributeStoreApi>();

    if (!storeRef.current) {
        storeRef.current = siteAttributeStoreTest;
    }

    return (
        <SiteAttributeStoreContext.Provider value={storeRef.current}>
            {children}
        </SiteAttributeStoreContext.Provider>
    );
};

export const useSiteAttributeStore = <T,>(selector: (store: SiteAttributeStore) => T): T => {
    const siteAttributeStoreContext = useContext(SiteAttributeStoreContext);

    if (!siteAttributeStoreContext) {
        throw new Error(`siteAttribute store error`);
    }

    return useStore(siteAttributeStoreContext, selector);
};
