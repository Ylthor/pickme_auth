import dayjs from 'dayjs'
export const setNewTimeout = (interval:number, onTick: () => void,onIntervalTick: (secondsLeft: number) => void = () => {},timerTick = 1000) => {
    const checkedTime = dayjs().unix() + interval/1000;
    const checkInterval = setInterval(() => {
        const now = dayjs().unix();
        onIntervalTick(now >= checkedTime ? 0 : checkedTime - now);
        if (now > checkedTime) {
            clearInterval(checkInterval);
            onTick();
        }
    },timerTick);
    return checkInterval;
}

export const setNewInterval = (interval:number, onTick: (secondsLeft: number) => void,timerTick = 1000) => {
    const checkedTime = dayjs().unix() + interval/1000;
    const checkInterval = setInterval(() => {
        const now = dayjs().unix();
        onTick(now >= checkedTime ? 0 : checkedTime - now);
        if (now >= checkedTime) {
            clearInterval(checkInterval);
        }
    },timerTick);
    return checkInterval;
}