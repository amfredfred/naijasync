import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
import { IStorageItems, IStorageMethods } from '../Interfaces/iStorage'
export type IUseStorage = {
    method: IStorageMethods,
    NaijaSync: IStorageItems
    isFetching: boolean
}

export default function useStorage(watch?: "@NaijaSync", deps?: any): IUseStorage {

    const [NaijaSync, setItems] = useState<IStorageItems>({})
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