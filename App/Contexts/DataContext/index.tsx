import React, { useReducer, createContext, useContext } from 'react'
import { IAppDataContext, IAppDataContextMethods } from '../../Interfaces'
import useStorage from '../../Hooks/useStorage'

const initialState: IAppDataContext = {
}

const DataContext = createContext<{
    states: IAppDataContext,
    setData: IAppDataContextMethods['setItem']
}>({ states: initialState, setData: () => "DEFAULT" as any })

export const useDataContext = () => useContext(DataContext)

export default function DataContextProvider({ children }) {
    const { method, NaijaSync } = useStorage("@NaijaSync")
    const dataReducer = (state, { type, key, item, payload }): IAppDataContext => {
        const data = { ...state, [key]: { ...state?.[key], [item]: payload } }
        method.setItem(key, item, payload)
        return data
    }

    const [states, dispatch] = useReducer(dataReducer, { ...initialState, ...NaijaSync })
    const setData: IAppDataContextMethods['setItem'] = async (key, item, payload) => {
        dispatch({ type: '', key, item, payload })
    }

    return (
        <DataContext.Provider value={{ states, setData }}>
            {children}
        </DataContext.Provider>
    )
}