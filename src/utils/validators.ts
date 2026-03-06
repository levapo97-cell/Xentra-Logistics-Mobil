export const isEmailValid = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
};

export const isPhoneValid = (value: string) => {
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(value.trim());
};