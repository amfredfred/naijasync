import React, { useReducer, createContext, useContext, useEffect } from 'react'
import { IAppDataContext, IAppDataContextMethods } from '../../Interfaces'
import useStorage from '../../Hooks/useStorage'

const initialState: IAppDataContext = {
}

const DataContext = createContext<{
    states: IAppDataContext,
    setData: IAppDataContextMethods['setItem']
    setObjectItem?: IAppDataContextMethods['setObjectItem']
}>({ states: initialState, setData: () => "DEFAULT" as any })

export const useDataContext = () => useContext(DataContext)

export default function DataContextProvider({ children }) {
    const { method, NaijaSync } = useStorage("@NaijaSync")

    const dataReducer = (state, { key, item, payload }: { key: string, item?: any, payload: any }): IAppDataContext => {
        let data = null;
        if (item) {
            data = { ...state, [key]: { ...state?.[key], [item]: payload } }
        } else {
            data = { ...state, [key]: { ...state?.[key], ...(payload ?? []) } }
        }
        return data
    }

    const [states, dispatch] = useReducer(dataReducer, { ...initialState })

    const setData: IAppDataContextMethods['setItem'] = async (key, item, payload) => {
        method.setItem(key, item, payload)
        dispatch({ key, item, payload })
    }

    const setObjectItem: IAppDataContextMethods['setObjectItem'] = async (key, payload) => {
        method?.setObjectItem?.(key, payload)
    }

    return (
        <DataContext.Provider value={{ states, setData, setObjectItem }}>
            {children}
        </DataContext.Provider>
    )
}
