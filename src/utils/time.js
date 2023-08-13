// разделяет секунды на часы, минуты и секунды
export const getTime = (value) => {
    // секунды
    if (value < 60) {
        return `${value}с.`;
    }

    // минуты, секунды
    if (value > 59 && value < 3600) {
        const minuts = Math.floor(value / 60);

        const seconds = value - minuts * 60;

        return `${minuts}м. ${seconds}с.`;
    }

    // часы, минуты, секунды
    if (value > 3599) {
        const hours = Math.floor(value / 3600);

        const minuts = Math.floor((value - 3600 * hours) / 60);

        const seconds = value - (minuts * 60 + hours * 3600);

        return `${hours}ч. ${minuts}м. ${seconds}с.`;
    }
};
