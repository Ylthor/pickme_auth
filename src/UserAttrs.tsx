import React from 'react';
import {useTranslation} from "react-i18next";
import {useAuthStore} from "./providers/auth-store-provider";
import {useSiteAttributeStore} from "./providers/site-attribute-store-provider";
import EditIcon from "./components/icons/EditIcon";
import ThemeSelector from "./components/ui/ThemeSelector";
import LanguageSelector from "./components/ui/LanguageSelector";
import TimezoneSelector from "./components/ui/TimezoneSelector";
import CompanySelector from "./components/ui/CompanySelector";
import GoogleAuth from "./components/GoogleAuth";
import SiteButton from "./components/ui/SiteButton";
import {Provider} from "./Provider";

export function UserAttrs() {
    const { email,name, number_phone,surname, logOut} =
        useAuthStore((state) => state);
    const {setUserAttrsModalState} = useSiteAttributeStore((store) => store);
    const {t} = useTranslation();
    const onClick = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem('pin');
        localStorage.removeItem('theme');
        localStorage.removeItem('language');
        void logOut();
    }

    const onEditClick = () => {
        setUserAttrsModalState(true)
    }

    return (
        <Provider>
            <div className={'flex flex-col gap-4'}>
                <h1>{t('authIsSuccessful')}</h1>
                <div className={'flex flex-col w-full p-4 gap-4 relative'}>
                    <div className={'absolute top-4 right-4 text-lg cursor-pointer'} onClick={onEditClick}>
                        <EditIcon/>
                    </div>
                    <div className={'flex gap-3 text-2xl'}>
                        <span>{name} {surname}</span>
                    </div>
                    <div className={'flex gap-3 text-md'}>
                        <span>{email}</span>
                    </div>
                    {
                        number_phone ? <div className={'flex gap-3 text-md'}>
                            <span>+{number_phone}</span>
                        </div> : null
                    }
                </div>
                <div className={'my-4 py-4 flex flex-col'}>
                    <div className={'mb-8 px-4 text-lg'}>{t('settings')}:</div>
                    <div className={'flex gap-2 flex-col'}>
                        <ThemeSelector/>
                        <LanguageSelector/>
                        <TimezoneSelector/>
                        <CompanySelector/>
                    </div>
                    <GoogleAuth/>
                </div>
                <SiteButton id={'logout_btn'} onClick={onClick}
                            className={'mt-auto'}>{t('logOut')}</SiteButton>
            </div>
        </Provider>
    );
}