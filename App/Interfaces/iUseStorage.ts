export interface IAuth {
    stage?: "landing" | "register" | "login" | "confirmPhone" | "confirmPassword";
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    referralCode?: string;
}
export interface IAppStates {
    inAuthState?: boolean;
    isHeaderHidden?: boolean
}
export interface IUser {
    isAuthenticated?: boolean;
    accessToken?: string;
}
interface IFileInfo {
    uri: string;
    exists: boolean;
    size: number;
    isDirectory: false;
    modificationTime: number;
    md5?: string; // Optional: MD5 hash of the file's contents
}

interface DirectoryInfo {
    uri: string;
    exists: boolean;
    isDirectory: true;
    modificationTime: number;
}

export type FileSystemInfo = IFileInfo | DirectoryInfo;

export interface IUserDownloads {
    audios: IFileInfo[]
    videos: IFileInfo[]
    noDownloads: boolean
}

export interface IStorageItems {
    user?: IUser;
    states?: IAppStates;
    authing?: IAuth;
    downloads?: IUserDownloads
}
export type IStorageKeys = keyof IStorageItems;
export type IPayloadKeys<T extends IStorageKeys>
    = T extends "authing" ? keyof IAuth
    : T extends "states" ? keyof IAppStates
    : T extends "user" ? keyof IUser
    : T extends "downloads" ? keyof IUserDownloads
    : "INVALID PAYLOAD KEY ✋‼️";

export type IPayloadType<T extends IStorageKeys, P extends IPayloadKeys<T>>
    = P extends keyof IAuth ? IAuth[P]
    : P extends keyof IAppStates ? IAppStates[P]
    : P extends keyof IUser ? IUser[P]
    : P extends keyof IUserDownloads ? IUserDownloads[P]
    : "INVALID PAYLOAD TYPE ✋‼️";

export interface IStorageMethods {
    setItem?<K extends IStorageKeys, P extends IPayloadKeys<K>>(
        key: K,
        item: P,
        payload: IPayloadType<K, P>
    ): Promise<void>;
    delItem?(key: "@NaijaSync"): Promise<void>;
    getItem?(key: "@NaijaSync"): Promise<IStorageItems>;
}