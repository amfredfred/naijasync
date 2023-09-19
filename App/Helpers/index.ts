import { Linking } from 'react-native'
import { IMediaType } from '../Interfaces';
import { Notifications } from 'react-native-notifications';

export const wait = /*@devfred*/ async (seconds?: number) => new Promise((resolved) => setTimeout(() => resolved('continue'), Number(seconds) * 1000 || 1000))

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(bytes) / Math.log(base));

    return parseFloat((bytes / Math.pow(base, digitGroups)).toFixed(2)) + ' ' + units[digitGroups];
}

export const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
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

export const formatNumber = (num: number): string => {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num?.toString();
}


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

export function areNotEqual(value1: string | number, value2: string | number) {
    return value1 !== value2;
}

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
    const seconds = Math.floor(durationInSeconds % 60);
    const parts = [];
    if (hours > 0) {
        parts.push(hours.toString().padStart(2, '0'));
    }
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(seconds.toString().padStart(2, '0'));
    return parts.join(':');
}


export function linkChecker({ link }) {
    const patterns = [
        { platform: 'facebook', pattern: /^(https?:\/\/)?(www\.)?(fb\.com|facebook\.com)\/?/i },
        { platform: 'youtube', pattern: /^(https?:\/\/)?(www\.)?youtube\.com\//i },
        { platform: 'thread', pattern: /^(https?:\/\/)?(www\.)?example\.com\/thread\//i },
    ];

    const matchedPlatform = patterns.find(({ pattern }) => pattern.test(link));

    return matchedPlatform
}


export async function openURi(uri: string, onCannotOpenUri?: () => void, onError?: () => void) {
    try {
        const supported = await Linking.canOpenURL(uri);
        if (supported) {
            await Linking.openURL(uri);
        } else {
            console.error('Cannot open URL:', uri);
            onCannotOpenUri?.()
        }
    } catch (error) {
        onError?.()
        console.error('Error opening URL:', error);
    }
}


export function getMediaType(link: string): IMediaType {
    if (!link) {
        return undefined
    }
    const mediaExtensions: { [key: string]: IMediaType } = {
        // Video Extensions
        '.mp4': IMediaType.Video,
        '.avi': IMediaType.Video,
        '.mkv': IMediaType.Video,
        '.mov': IMediaType.Video,
        '.wmv': IMediaType.Video,
        '.flv': IMediaType.Video,
        '.webm': IMediaType.Video,
        // Audio Extensions
        '.mp3': IMediaType.Audio,
        '.wav': IMediaType.Audio,
        '.ogg': IMediaType.Audio,
        '.flac': IMediaType.Audio,
        '.aac': IMediaType.Audio,
        '.wma': IMediaType.Audio,
        // Image Extensions
        '.jpg': IMediaType.Image,
        '.jpeg': IMediaType.Image,
        '.png': IMediaType.Image,
        '.gif': IMediaType.Image,
        '.bmp': IMediaType.Image,
        '.webp': IMediaType.Image,
        // Document Extensions
        '.pdf': IMediaType.Document,
        '.doc': IMediaType.Document,
        '.docx': IMediaType.Document,
        '.ppt': IMediaType.Document,
        '.pptx': IMediaType.Document,
        '.xls': IMediaType.Document,
        '.xlsx': IMediaType.Document,
        '.txt': IMediaType.Document,
        // Archive Extensions
        '.zip': IMediaType.Archive,
        '.rar': IMediaType.Archive,
        '.7z': IMediaType.Archive,
    };

    const fileExtension = link.substring(link.lastIndexOf('.'));
    return mediaExtensions[fileExtension] || IMediaType.Other;
};


export const getTags = (inputString: string): string[] => {
    const hashtagRegex = /#(\w+)/g;

    const matches = inputString.match(hashtagRegex);

    if (matches) {
        return [...new Set(matches.map(match => match.slice(1)))];
    } else {
        return []
    }
}

export const getRandomBoolean = () => {
    const probability = Math.random()
    return probability <= 0.51;  
}


export const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(ftp:\/\/[^\s]+)|(\b[\w-]+(\.[a-z]{2,})+\S*)/gi;
    const urls = text.match(urlRegex);

    if (urls) {
         
    } else {
        
    }

}
