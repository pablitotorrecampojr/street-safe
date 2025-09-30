export function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateRandomString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let string = '';
    for (let i = 0; i < 28; i++) {
        string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
}

export function truncate(str, length = 20) {
  return str.length > length ? str.substring(0, length) + "..." : str;
};