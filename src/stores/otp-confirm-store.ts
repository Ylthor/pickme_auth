// @ts-ignore
import { createStore } from "zustand/vanilla";

export type OtpConfirmState = {
    needConfirm: boolean;
    urlDataToReuseOnConfirm?: any
    email: string;
    onConfirm?: (res?: any) => void;
    onError?: (res?: any) => void;
    onFill?: (otp: string, otpType: string) => void;
    onFinally?: (res?: any) => void;
};

export type OtpConfirmActions = {
    setOpen: (data: OtpConfirmState) => void,
    setClose: () => void,
    setUrlDataToReuseOnConfirm: (data: any) => void
};

export type OtpConfirmStore = OtpConfirmState & OtpConfirmActions;

export const defaultInitState: OtpConfirmState = {
    needConfirm: false,
    urlDataToReuseOnConfirm: {},
    email: '',
    onFill: () => {},
    onConfirm: () => {},
    onError: () => {},
    onFinally: () => {},
};
export const createOtpConfirmStore = (initState: OtpConfirmState = defaultInitState) => {
    //@ts-ignore
    return createStore<OtpConfirmStore>()((set) => ({
        ...initState,
        setClose: () => set(() => ({...defaultInitState})),
        setOpen: (data:any) => set(() => ({...data})),
        setUrlDataToReuseOnConfirm: (data: any) => set(() => ({urlDataToReuseOnConfirm: data}))
    }));
};
