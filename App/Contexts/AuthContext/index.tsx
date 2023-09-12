import React, { useReducer, createContext, useContext, useEffect, useState } from 'react'
import useStorage from '../../Hooks/useStorage'
import { IAuthContextData, IAuthContextMethods } from '../../Interfaces/iAuthContext'
import * as Cellular from 'expo-cellular'
import { IStorageMethods } from '../../Interfaces/iUseStorage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { REQUESTS_API } from '@env'
import { useToast } from '../ToastContext'

const initialState: IAuthContextData = {
    user: {
        isAuthenticated: false,
        person: 'isNew',
    },
}

const AuthContext = createContext<(IAuthContextData & IAuthContextMethods)>({
    ...initialState
})

export const useAuthContext = () => useContext(AuthContext)
interface IDispatch {
    type?: any,
    key: any,
    item?: any,
    payload: any
}

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const { method, NaijaSync, isFetching } = useStorage("@NaijaSync")

    const dataReducer = (state: any, { type, key, item, payload }: IDispatch): IAuthContextData => {
        const data = { ...state, [key as string]: { ...state?.[key], ...(payload || {}) } }
        return data
    }

    const [states, dispatch] = useReducer(dataReducer, initialState)
    const [isBusy, setisBusy] = useState(false)

    const setObjectItem: IStorageMethods['setObjectItem'] = async (key, payload) => {
        dispatch({ key, payload })
        method.setObjectItem?.(key, payload)
    }

    const { toast } = useToast()

    const mutation = useMutation((info) => {
        console.log(NaijaSync?.user?.accessToken, ";access token")
        return axios({
            url: `${REQUESTS_API}${(info as any)?.path}`,
            method: 'POST',
            data: info,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${states?.user?.accessToken}`
            }
        })
    })


    const register: IAuthContextMethods['register'] = async (userData) => {
        const formData = new FormData()
        formData['path'] = 'register'
        formData.append('email', userData?.email)
        formData.append('password', userData?.password)
        formData.append('password_confirmation', userData?.confirmPassword)
        formData.append('name', userData?.fullName)
        setisBusy(true)
        let user;
        try {
            const auth = await mutation?.mutateAsync(formData as any)
            user = (auth?.data as any)?.profile as IAuthContextData['user']
            if (auth?.status == 201 || auth?.status == 200) {
                user['accessToken'] = (auth?.data as any)?.accessToken
                user['person'] = 'isAuthenticated'
                user['isAuthenticated'] = true
                setObjectItem('user', user)
            } else {
                toast({
                    message: `Error: }`,
                    severnity: 'error',
                })
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                setObjectItem('user', user)
            }
        }
        setisBusy(false)
    }

    const login: IAuthContextMethods['login'] = async (userData) => {
        const formData = new FormData()
        formData['path'] = 'login'
        formData.append('email', userData?.email)
        formData.append('password', userData?.password)
        setisBusy(true)
        const auth = await mutation?.mutateAsync(formData as any)
        const user = (auth?.data as any)?.profile as IAuthContextData['user']
        if (auth?.status == 201 || auth?.status == 200) {
            user['accessToken'] = (auth?.data as any)?.accessToken
            user['person'] = 'isAuthenticated'
            user['isAuthenticated'] = true
            setObjectItem('user', user)
        } else {
            toast({
                message: `Error: }`,
                severnity: 'error',
            })
        }
        setisBusy(false)
        mutation?.reset()
    }

    const updateAccount: IAuthContextMethods['updateAccount'] = async (newAccountInfo) => {
        try {
            const formData = new FormData()
            formData['path'] = 'account-update'
            if (!states?.user?.isAuthenticated) {
                logout()
                return
            }
            setisBusy(true)
            await Promise.all(Object.keys(newAccountInfo)?.map(d => {
                formData.append(d, typeof newAccountInfo?.[d] === 'object' ? JSON.stringify(newAccountInfo?.[d]) : newAccountInfo?.[d])
            }))
            if (newAccountInfo?.profileCoverPics)
                formData.append('profile-image', newAccountInfo?.profileCoverPics as any);
            if (newAccountInfo?.profilePics)
                formData.append('cover-image', newAccountInfo?.profilePics as any)
            const auth = await mutation?.mutateAsync(formData as any)
            const user = (auth?.data as any)?.profile as IAuthContextData['user']
            if (auth?.status == 201 || auth?.status == 200) {
                user['accessToken'] = (auth?.data as any)?.accessToken
                user['person'] = 'isAuthenticated'
                user['isAuthenticated'] = true
                setObjectItem('user', user)
            } 
            return user
        } catch (error) {
            console.log('ERROR->THE_ERROR->', JSON.stringify(error?.response?.data?.message))
            toast({
                message: `Error: ${error?.response?.data?.message}`,
                severnity: 'error',
            })
        }
        finally {
            setisBusy(false)
            mutation.reset()
        }
    }

    const confirmNumber: IAuthContextMethods['confirmNumber'] = async () => {
        return true
    }

    const logout: IAuthContextMethods['logout'] = async () => {
        method?.setObjectItem?.('user', { 'accessToken': null, person: 'isNew' })
        return true
    }

    const skipAuth: IAuthContextMethods['skipAuth'] = () => {
        setObjectItem('user', { person: 'hasSkippedAuthentication' })
    }

    const skipToOnboard: IAuthContextMethods['skipToOnboard'] = () => {
        setObjectItem('user', { person: 'isNew' })
    }

    const showMiniAuthForm: IAuthContextMethods['showMiniAuthForm'] = (state) => {
        setObjectItem('user', { person: 'isNew' })
    }



    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const netGen = Cellular.CellularGeneration
                if (!netGen.UNKNOWN) {
                    if (NaijaSync?.user?.person === 'isAuthenticated') {
                        setObjectItem('user', { ...NaijaSync?.user, person: 'isAuthenticated', })
                    } else if (NaijaSync?.user?.person === 'hasSkippedAuthentication') {
                        setObjectItem('user', { person: 'hasSkippedAuthentication' })
                    } else if (NaijaSync?.user?.person === 'isNew') {
                        setObjectItem('user', { person: 'isNew' })
                    } else if (NaijaSync?.user?.person === 'isOffline') {
                    }
                } else {
                    setObjectItem('user', NaijaSync?.user)
                }
            } catch (error) {
                console.error('Error while checking authentication status:', error)
            }
        }
        checkAuthStatus()
        return () => { }
    }, [NaijaSync?.user?.person])


    const data: (IAuthContextData & IAuthContextMethods) = {
        login,
        register,
        logout,
        confirmNumber,
        skipAuth,
        skipToOnboard,
        showMiniAuthForm,
        updateAccount,
        isBusy,
        user: states.user,
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
