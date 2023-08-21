'use strict'

import { useState, useEffect } from 'react'
import * as Cellular from 'expo-cellular'
import useStorage from './useStorage'
import { IAuth } from '../Interfaces'
import { useDataContext } from '../Contexts/DataContext'

export type IAuthStatus = {
    person: "isAuthenticated" | "isOffline" | "isNew",
    privillege: "isAdmin" | "isPublisher" | "isModerator" | "isSuperAdmin"
    register(props: IAuth): void,
    login(props: IAuth): void
    logout(): void
    confirmNumber(): void
}

const useAuthStatus = (props?: { permanent?: IAuthStatus['person'] }): IAuthStatus => {
    const [authStatus, setAuthStatus] = useState<IAuthStatus['person']>('isNew')
    const [privillege, setPrivillege] = useState()
    const { states: MN, setData } = useDataContext()
 

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const netGen = Cellular.CellularGeneration

                if (!netGen.UNKNOWN) {
                    if (MN?.user?.isAuthenticated)
                        return setAuthStatus('isAuthenticated')
                    setAuthStatus('isNew')
                } else setAuthStatus('isOffline')

            } catch (error) {
                console.error('Error while checking authentication status:', error)
            }
        }

        if (props?.permanent) return setAuthStatus(props?.permanent)
        checkAuthStatus()
    }, [MN?.states, MN.user])

    const register: IAuthStatus['register'] = async (props) => {
        setData?.("user", 'isAuthenticated', true)
        setData?.("states", 'inAuthState', false)
    }

    const logout = () => {
        setData?.("user", 'isAuthenticated', false)
        setData?.("states", 'inAuthState', true)
    }

    const login: IAuthStatus['login'] = () => {
        setData?.("user", 'isAuthenticated', true)
        setData?.("states", 'inAuthState', false)
    }


    const confirmNumber: IAuthStatus['confirmNumber'] = () => {
        setData?.("user", 'isAuthenticated', true)
        setData?.("states", 'inAuthState', false)
    }

    return {
        person: authStatus,
        privillege,
        register,
        login,
        logout,
        confirmNumber
    }
}

export default useAuthStatus