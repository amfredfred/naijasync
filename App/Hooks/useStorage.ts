import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
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
export interface IStorageItems {
    user?: IUser;
    states?: IAppStates;
    authing?: IAuth;
}
export type IStorageKeys = keyof IStorageItems;
export type IPayloadKeys<T extends IStorageKeys>
    = T extends "authing" ? keyof IAuth
    : T extends "states" ? keyof IAppStates
    : T extends "user" ? keyof IUser
    : "INVALID PAYLOAD KEY ✋‼️";

export type IPayloadType<T extends IStorageKeys, P extends IPayloadKeys<T>>
    = P extends keyof IAuth ? IAuth[P]
    : P extends keyof IAppStates ? IAppStates[P]
    : P extends keyof IUser ? IUser[P]
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

export type IUseStorage = {
    method: IStorageMethods,
    NaijaSync: IStorageItems | null
    isFetching: boolean
}

export default function useStorage(watch?: "@NaijaSync", deps?: any): IUseStorage {

    const [NaijaSync, setItems] = useState<IStorageItems | null>(null)
    const [isFetching, setIsFteching] = useState<boolean>(false)

    const delItem: IStorageMethods['delItem'] = async (key) => {
        await AsyncStorage.removeItem(key)
        await fetchStorage('@NaijaSync')
    }
    const getItem: IStorageMethods['getItem'] = async (key) => {
        const item = await AsyncStorage.getItem(key)
        return JSON.parse(item || 'null') as IStorageItems
    }

    const fetchStorage = async (key: "@NaijaSync") => {
        setIsFteching(true)
        const items = await getItem(key)
        setItems(items)
        setIsFteching(false)
    }

    const setItem: IStorageMethods['setItem'] = async (key, item, payload) => {
        const data = { ...NaijaSync, [key]: { ...NaijaSync?.[key], [item]: payload } }
        await AsyncStorage.setItem("@NaijaSync", JSON.stringify(data))
        await fetchStorage('@NaijaSync')
    }

    useEffect(() => {
        if (watch)
            fetchStorage('@NaijaSync')

        return () => {
            setIsFteching(true)
        }
    }, [deps])

    return {
        method: {
            getItem,
            setItem,
            delItem
        },
        NaijaSync,
        isFetching
    }
}