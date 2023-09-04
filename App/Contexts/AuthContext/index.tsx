import React, { useReducer, createContext, useContext, useEffect } from 'react'
import useStorage from '../../Hooks/useStorage'
import { IAuthContextData, IAuthContextMethods } from '../../Interfaces/iAuthContext'
import * as Cellular from 'expo-cellular'
import { IStorageMethods } from '../../Interfaces/iUseStorage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { REQUESTS_API } from '@env'
import { useToast } from '../ToastContext'
import MiniAuhForm from '../../Screens/Guest/Auth/MiniAuthForm'



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

    const setObjectItem: IStorageMethods['setObjectItem'] = async (key, payload) => {
        dispatch({ key, payload })
        method.setObjectItem?.(key, payload)
    }

    const { toast } = useToast()

    const mutation = useMutation((info) => {
        return axios({
            url: `${REQUESTS_API}${(info as any)?.path}`,
            method: 'POST',
            data: info,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    })

    useEffect(() => {
        if (mutation?.status === 'error') {
            return toast({
                message: `Error: ${(mutation?.failureReason as any)?.response?.data?.message}`,
                severnity: 'error',
            })
        }
        else if (mutation?.status === 'success') {
            const user = {} as IAuthContextData['user']
            user['accessToken'] = (mutation?.data?.data as any)?.accessToken
            user['person'] = 'isAuthenticated'
            user['isAuthenticated'] = true
            setObjectItem('user', {
                ...user,
                ...(mutation?.data?.data as any)?.profile?.user,
                ...(mutation?.data?.data as any)?.profile,
                person: 'isAuthenticated',
            })
            return toast({
                message: `Error: ${(mutation?.data as any)?.data?.message}`,
                severnity: 'success',
            })
        }

    }, [mutation?.status])

    const login: IAuthContextMethods['login'] = async (userData) => {
        const formData = new FormData()
        formData['path'] = 'login'
        formData.append('email', userData?.email)
        formData.append('password', userData?.password)

        mutation?.mutate(formData as any)
        return true
    }

    const register: IAuthContextMethods['register'] = async (userData) => {
        const formData = new FormData()
        formData['path'] = 'register'
        formData.append('email', userData?.email)
        formData.append('password', userData?.password)
        formData.append('password_confirmation', userData?.confirmPassword)
        formData.append('name', userData?.fullName)
        const auth = await mutation?.mutateAsync(formData as any)
        if (auth.status === 200)
            return true
        return false
    }

    const confirmNumber: IAuthContextMethods['confirmNumber'] = async () => {
        setObjectItem('user', { isAuthenticated: true, person: 'isAuthenticated' })
        return true
    }

    const logout: IAuthContextMethods['logout'] = async () => {
        method?.delItem?.('@NaijaSync')
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
            console.log(NaijaSync?.user?.person, ":  PERSON OF NAIJASYNC")
            try {
                const netGen = Cellular.CellularGeneration
                if (!netGen.UNKNOWN) {
                    if (NaijaSync?.user?.person === 'isAuthenticated') {
                        setObjectItem('user', { ...NaijaSync?.user, person: 'isAuthenticated', })
                    } else if (NaijaSync?.user?.person === 'hasSkippedAuthentication') {
                        setObjectItem('user', { person: 'hasSkippedAuthentication' })
                    } else if (NaijaSync?.user?.person === 'isNew') {
                        console.log(NaijaSync?.user?.person, ":  PERSON OF NAIJASYNC HRE HERER HRE RNEW")

                        setObjectItem('user', { person: 'isNew' })
                    } else if (NaijaSync?.user?.person === 'isOffline') {
                        console.log("User is offline")
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
        user: states.user,
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
