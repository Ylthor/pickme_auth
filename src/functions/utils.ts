export const getNamePreview = (str: string) => {
    const parts = str.split('');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`;
    }
    return `${str[0]}${str[1]}`;
}

export function getNavigatorLang() {
    if (navigator.languages !== undefined)
        return navigator.languages[0];
    return navigator.language;
}

export function getNavigatorLocale() {
    const locale = getNavigatorLang().split('-')[0];
    return locale.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase()
    })
}

export const getCallbackFuncsByKey = (keys:string[],object) => {
    const neededKeys = Object.keys(object).filter((key) => keys.includes(key));
    return neededKeys.reduce((acc,key) => {
        if (object[key] && typeof object[key] === 'function') {
            return {
                ...acc,
                [key]: object[key]
            }
        }
        return acc
    },{})
}