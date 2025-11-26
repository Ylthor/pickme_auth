// @ts-ignore
import { createStore } from "zustand/vanilla";

export type AuthStateType = {
    access_token: string | null;
    is_checking: boolean;
    pin: string | null;
    refresh_token: string | null;
    isAuth: boolean;
    showLoginWindow?: boolean;
    loginWindowCallback?: () => void;
};

export type AuthUserInfo = {
    user_id?: string | null;
    email?: string | null;
    name?: string | null;
    surname?: string | null;
    number_phone?: string | null;
    is_anonymous?: boolean;
};

interface setAuthTokenData {
    access_token: string;
    refresh_token?: string | null;
}

export type AuthActions = {
    setAuth: (data: AuthState) => void;
    setAuthToken: (data: setAuthTokenData) => void;
    showLoginWindowAction: (data: boolean) => void;
    setUserInfo: (data: AuthUserInfo) => void;
    logOut: () => void;
    setLoginWindowCallback: (data: () => void) => void;
    setPin: (data: string) => void
};

type AuthState = AuthStateType & AuthUserInfo;

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
    access_token: null,
    refresh_token: null,
    pin: null,
    is_checking: true,
    isAuth: false,
    user_id: null,
    email: null,
    showLoginWindow: false,
    is_anonymous: true,
};
export const createAuthStore = (initState: AuthState = defaultInitState) => {
    //@ts-ignore
    return createStore<AuthStore>()((set) => ({
        ...initState,
        logOut: () => set(() => ({...defaultInitState})),
        setAuth: (data:any) =>
            set(() => {
                return { ...data, is_checking: false };
            }),
        setPin: (data:any) => set(() => ({pin: data})),
        setLoginWindowCallback: (data:any) =>
            set(() => ({ loginWindowCallback: data })),
        showLoginWindowAction: (data:any) => set(() => ({ showLoginWindow: data })),
        setUserInfo: (data:any) =>
            set(() => {
                return Object.keys(data).reduce(
                    //@ts-ignore
                    (acc, key) => ({ ...acc, [key]: data[key] }),
                    {},
                );
            }),
        setAuthToken: (data:any) => set(() => ({ ...data, is_checking: false})),
    }));
};
