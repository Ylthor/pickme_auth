import i18n from 'i18next'

export const ALLOWED_COUNTRIES = ['IDN','THA'];

export const COUNTRY_OPTIONS = [
    {
        key: 'THA',
        label: i18n.t('thailand')
    },
    {
        key: 'IDN',
        label: i18n.t('indonesia')
    }
]

export const getAllowedCountryOptions = () => {
    return COUNTRY_OPTIONS.filter((c) => ALLOWED_COUNTRIES.includes(c.key));
}