export const getNums = (val: string) => {
    return val.match(/\d/g)?.join('');
}

export const getSplittedString = (v:string) => {
    const parts = v.split('.');
    // @ts-ignore
    const main = parts[0] ? `${getNums(parts[0])}` : '';
    const decPart = parts[1] !== undefined ? parts[1] === '' ? '' : getNums(parts[1]) : null;
    const mainChars = main.split('')
    const mainPart = mainChars.map((c,index) => {
        if ((index % 3) === (mainChars.length % 3) && index !== 0) {
            return ` ${c}`
        }
        return c;
    }).join('');
    return `${mainPart}${decPart !== null ? `.${decPart}` : ''}`
}

export const getEnd = (part:string,addNums:boolean) => {
    const v = getNums(part) ?? '';
    if (v || addNums) {
        if (addNums) {
            return `${v}00`.slice(0,2);
        }
        else if (v.length > 2)
            return v.slice(0,2)
        else return v
    }
    return ''
}

const checkValid = (val) => {
    if (val !== undefined && val !== null)
        return true;

    return false
}

export const checkByMinMax = (p1,p2,min,max,emptyOnFalse = true) => {
    if (!checkValid(min) && !checkValid(max))
        return [p1,p2];

    const p1n = p1 ? parseInt(p1) : 0;
    const p2n = p2 ? parseInt(p2) : 0;
    const sum = p2n ? p1n + 1 : p1n;
    if (checkValid(min) && checkValid(max)) {
        if (sum <= max && sum >= min) {
            return [p1, p2];
        } else if (sum <= min) {
            return emptyOnFalse ? ['',''] : [min.toString(), '00'];
        } else return emptyOnFalse ? ['',''] : [max.toString(),'00'];
    } else if (checkValid(min)) {
        if (sum >= min) {
            return [p1, p2];
        }
        return emptyOnFalse ? ['',''] : [min.toString(),'00']
    } else if (checkValid(max)) {
        if (sum <= max) {
            return [p1, p2];
        }
        return emptyOnFalse ? ['',''] : [max.toString(),'00']
    }
}

export const transformValueToMasked = (value: string,addNums=false,min:number | undefined = undefined,max:number | undefined = undefined,emptyOnMinMax = true) => {
    const parts = value.split('.');
    if (parts.length === 2 && !parts[0] && !parts[1]) {
        return ''
    }

    if (parts.length === 1) {
        const parts2 = parts[0].split(',');
        if (parts2.length === 2 && !parts2[0] && !parts2[1]) {
            return ''
        }
        const p1 = getNums(parts2[0]);
        const p2 = parts.length === 1 ? addNums ? '00' : '' : getEnd(parts2[1],addNums);
        const [p1r,p2r] = checkByMinMax(p1,p2,min,max,emptyOnMinMax);
        if (!p1r && !p2r) {
            return ''
        }
        if (parts2.length === 1) {
            return `${p1r}${addNums ? `.${p2r}` : ''}`
        } else {
            return `${p1r ?? ''}.${p2r}`
        }
    }
    const nums = getEnd(parts[1],addNums);
    const p1 = getNums(parts[0]);
    const p2 = nums;
    const [p1r,p2r] = checkByMinMax(p1,p2,min,max,emptyOnMinMax);
    if (!p1r && !p2r) {
        return ''
    }
    return `${p1r}${nums ? `.${p2r}` : '.'}`
}