export class Helpers {
    protected static formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    };

    protected static slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    protected static validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    protected static formatCurrency(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    protected static truncateText(text: string, length: number): string {
        if (text.length <= length) return text;
        return text.slice(0, length) + '...';
    };

    protected static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    protected static isValidPhoneNumber(phone: string): boolean {
        const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return re.test(phone);
    };
}