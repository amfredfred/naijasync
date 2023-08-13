export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(bytes) / Math.log(base));

    return parseFloat((bytes / Math.pow(base, digitGroups)).toFixed(2)) + ' ' + units[digitGroups];
}

export const convertStringToCase = (inputString: string, caseType?: "snake" | "camel") => {
    const cleanedString = inputString.replace(/\s+/g, '').toLowerCase();
    if (caseType === 'snake') {
        return cleanedString.replace(/([a-z])([A-Z])/g, '$1_$2');
    } else if (caseType === 'camel') {
        return cleanedString.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
    } else {
        return cleanedString;
    }
}
// Precise Decimal Places
export const formatDecimal = (value: string | number = 0, decimals: undefined | number = 4): string => {
    const fixedValue = Number(value ?? 0)?.toFixed?.(decimals + 1);
    const decimalPart = String(fixedValue)?.split?.('.')[1];
    return fixedValue?.split?.('.')?.[0]?.concat?.('.')?.concat?.(decimalPart?.slice?.(0, decimals));
};

// To Uppercase
export const upperCase = (value: any) => String(String(value)?.toUpperCase());

// To Lowercase
export const lowerCase = (value: string) => String(value?.toLowerCase());

// Check Equality
export const isEqual = (value1: string | undefined, value2: string | undefined): boolean => upperCase(value1) === upperCase(value2);

// Add
export const add = (value1: number | string, value2: number | string): number => Number(value1) + Number(value2);

// Subtract
export const subtract = (value1: number | string, value2: number | string): number => Number(value1) - Number(value2);

// Multiply
export const multiply = (value1: number | string, value2: number | string): number => Number(value1) * Number(value2);

// Divide
export const divide = (value1: number | string, value2: number | string): number => Number(value1) / Number(value2);

// Truncate
export const truncate = (value: string | number | unknown, position: "middle" | "left" | "right" | undefined = "middle") => {
    const stringValue = String(value);
    switch (position) {
        case "left":
            if (stringValue.length <= 4) return stringValue;
            return '...' + stringValue.slice(-4);
        case "middle":
            return stringValue.slice(0, 3) + '...' + stringValue.slice(-3);
        case "right":
            if (stringValue.length <= 4) return stringValue;
            return stringValue.slice(0, 4) + '...';
    }
};


export function formatDuration(durationInSeconds: number): string {
    const days = Math.floor(durationInSeconds / 86400);
    const hours = Math.floor((durationInSeconds % 86400) / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
    if (hours > 0) parts.push(`${hours} hr${hours === 1 ? '' : 's'}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes === 1 ? '' : 's'}`);
    if (seconds > 0) parts.push(`${seconds} sec${seconds === 1 ? '' : 's'}`);

    return parts.join(', ');
}

export function formatPlaytimeDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(formatDecimal(seconds, 0).padStart(2, '0'));

    return parts.join(':');
}