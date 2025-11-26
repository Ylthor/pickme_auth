// @ts-ignore
import { createStore } from "zustand/vanilla";
import {DEFAULT_TZ} from "../components/ui/TimezoneSelector";
interface CompanyAttrs {
    id: string,
    title: string,
    location: string,
    currency_code: string
}

export type SiteAttributeState = {
    lang: string;
    theme: string;
    colorScheme: string;
    tz: string;
    force_company_modal_opened: boolean;
    user_attrs_modal_opened: boolean;
    company_data_loading: boolean;
    company_info: CompanyAttrs | null | undefined
};

export type SiteAttributeActions = {
    setLang: (lang: string) => void;
    setCompanyInfo: (data: CompanyAttrs) => void;
    setColorScheme: (theme: string) => void;
    setThemeStore: (theme: string) => void;
    setUserAttrsModalState: (data: boolean) => void;
    setCompanyDataLoading: (val: boolean) => void;
    forceCompanyAddScreen: (val: boolean) => void;
    setTz: (tz: string) => void;
    setDef: () => void;
};

export type SiteAttributeStore = SiteAttributeState & SiteAttributeActions;

export const defaultInitState: SiteAttributeState = {
    lang: 'en',
    colorScheme: 'light',
    tz: DEFAULT_TZ,
    theme: 'system',
    user_attrs_modal_opened: false,
    force_company_modal_opened: false,
    company_data_loading: false,
    company_info: null
};
export const createSiteAttributeStore = (initState: SiteAttributeState = defaultInitState) => {
    //@ts-ignore
    return createStore<SiteAttributeStore>()((set) => ({
        ...initState,
        setDef: () => set(() => ({...defaultInitState})),
        setCompanyInfo: (data:any) => set(() => ({company_info: data})),
        setColorScheme: (data:any) => set(() => ({colorScheme: data})),
        setTz: (data:any) => set(() => ({tz: data})),
        setUserAttrsModalState: (data:any) => set(() => ({user_attrs_modal_opened: data})),
        setCompanyDataLoading: (data:any) => set(() => ({company_data_loading: data})),
        forceCompanyAddScreen: (data:any) => set(() => ({force_company_modal_opened: data})),
        setLang: (data:any) =>
            set(() => ({lang: data})),
        setThemeStore: (data:any) =>
            set(() => ({theme: data})),
    }));
};
