import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {translationEN} from "../public/locales/en/translation";
import {translationRU} from "../public/locales/ru/translation";
import {translationTH} from "../public/locales/th/translation";
import {translationID} from "../public/locales/id/translation";

const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
    th: {
        translation: translationTH,
    },
    id: {
        translation: translationID,
    }
};

i18n.use(initReactI18next).init({
    resources,
    debug: true,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;