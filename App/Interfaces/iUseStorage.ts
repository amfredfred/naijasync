import { Asset } from "expo-media-library";
import { IAuthContextData } from "./iAuthContext";

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
    pendingDownloads: Record<string, [Object]>[]
}

export interface IStorageItems {
    user?: IAuthContextData['user'];
    states?: IAppStates;
    authing?: IAuth;
    storage?: IStorageFolder
}

export type IStorageKeys = keyof IStorageItems
export type IPayloadKeys<T extends IStorageKeys> = T extends IStorageKeys ? keyof IStorageItems[T] : never
export type IPayloadType<T extends IStorageKeys, P extends IPayloadKeys<T>> = P extends keyof IStorageItems[T] ? IStorageItems[T][P] : never

export interface IStorageMethods {
    setItem?<K extends IStorageKeys, P extends IPayloadKeys<K>>(
        key: K,
        item: P,
        payload: IPayloadType<K, P>
    ): Promise<void>
    setObjectItem?<K extends IStorageKeys>(
        key: K,
        objectPayload: IStorageItems[K]
    ): void
    delItem?(key: "@NaijaSync"): Promise<void>;
    getItem?(key: "@NaijaSync"): Promise<IStorageItems>;
}