import { Asset } from "expo-media-library";

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
    isInSearchMode?: boolean
}
export interface IUser {
    isAuthenticated?: boolean;
    accessToken?: string;
    searchRequestValue?: string
}

export interface IUserDownloads {
    audio: string[]
    video: string[]
    noDownloads: boolean
}

export interface IStorageFolder {
    storageFolderDirectoryUri: string,
    downloadsStorageAlbumName: string,
    myDownloadedAssets: Asset[],
    hasDownloadedMedias: boolean
}

export interface IStorageItems {
    user?: IUser;
    states?: IAppStates;
    authing?: IAuth;
    storage?: IStorageFolder
}

export type IStorageKeys = keyof IStorageItems;
export type IPayloadKeys<T extends IStorageKeys> = T extends IStorageKeys ? keyof IStorageItems[T] : never
export type IPayloadType<T extends IStorageKeys, P extends IPayloadKeys<T>> = P extends keyof IStorageItems[T] ? IStorageItems[T][P] : never

export interface IStorageMethods {
    setItem?<K extends IStorageKeys, P extends IPayloadKeys<K>>(
        key: K,
        item: P,
        payload: IPayloadType<K, P>
    ): Promise<void>;
    delItem?(key: "@NaijaSync"): Promise<void>;
    getItem?(key: "@NaijaSync"): Promise<IStorageItems>;
}