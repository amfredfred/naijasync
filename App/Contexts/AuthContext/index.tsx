import React, { useReducer, createContext, useContext, useEffect } from 'react'
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
        hasSkippedAuthentication: false
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

    console.log((mutation?.data as any)?.data)

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
            setObjectItem('user', user)
            return toast({
                message: `Error: ${(mutation?.data as any)?.data?.message}`,
                severnity: 'success',
            })
        }

    }, [mutation?.status])



    const login: IAuthContextMethods['login'] = async () => {
        setObjectItem('user', { isAuthenticated: true, person: 'isAuthenticated' })
        return true
    }

    const register: IAuthContextMethods['register'] = async (userData) => {
        const formData = new FormData()
        formData['path'] = 'register'
        formData.append('email', userData?.email)
        formData.append('password', userData?.password)
        formData.append('password_confirmation', userData?.confirmPassword)
        formData.append('name', userData?.fullName)

        const user = mutation?.mutate(formData as any)
        console.log("regiter CALLED", user)
        return true
    }

    const confirmNumber: IAuthContextMethods['confirmNumber'] = async () => {
        console.log("confirmNumber")
        setObjectItem('user', { isAuthenticated: true, person: 'isAuthenticated' })
        return true
    }

    const logout: IAuthContextMethods['logout'] = async () => {
        console.log("logout CALLED")
        method?.delItem?.('@NaijaSync')
        return true
    }

    const skipAuth: IAuthContextMethods['skipAuth'] = () => {
        setObjectItem('user', { hasSkippedAuthentication: true, person: 'hasSkippedAuthentication' })
    }

    const skipToOnboard: IAuthContextMethods['skipToOnboard'] = () => {
        setObjectItem('user', { hasSkippedAuthentication: false, person: 'isNew' })
    }


    useEffect(() => {

        const checkAuthStatus = async () => {
            try {
                // More logic goes here or there 🚀💫
                const netGen = Cellular.CellularGeneration

                if (!netGen.UNKNOWN) {
                    if (NaijaSync?.user) {
                        console.log("HAS USER OBJECT")
                        setObjectItem('user', NaijaSync?.user)
                    }
                    else {
                        // the person may be new 
                        setObjectItem('user', { isAuthenticated: false, person: 'isNew', hasSkippedAuthentication: false })
                    }
                } else {
                    // else this means the person is offliine or so...
                    setObjectItem('user', { ...NaijaSync?.user, person: 'isNew', hasSkippedAuthentication: false })
                }

            } catch (error) {
                console.error('Error while checking authentication status:', error)
            }
        }

        checkAuthStatus()

        console.log(isFetching, NaijaSync?.user)

        return () => {
            // logout()
        }

    }, [NaijaSync?.user?.person])


    const data: (IAuthContextData & IAuthContextMethods) = {
        login, register, logout, confirmNumber, skipAuth, skipToOnboard,
        user: states.user,
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
