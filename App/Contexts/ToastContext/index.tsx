import React, { useReducer, createContext, useContext, useState } from 'react'
import { IAppDataContext, IAppDataContextMethods } from '../../Interfaces'
import useThemeColors from '../../Hooks/useThemeColors'
import Animated, { } from 'react-native-reanimated'
import useTimeout from '../../Hooks/useTimeout'
import { SpanText } from '../../Components/Texts'
import { ContainerBlock } from '../../Components/Containers'

const initialState = {
}

interface IToast {
    toast(props: {
        message?: string
        severnity?: 'error' | 'success' | "warning"
        timeout?: number
    }): void
}

const ToastContext = createContext<IToast>(null)

export const useToast = () => useContext(ToastContext)

export default function ToastProvider() {

    const themeColors = useThemeColors()

    const [toastInfo, setToastInfo] = useState<{
        message?: string
        severnity?: 'error' | 'success' | "warning"
        timeout?: number
    }>({
        timeout: 3000
    })

    const toast: IToast['toast'] = ({ message, severnity, timeout }) => {
        setToastInfo({ message, severnity, timeout })
    }

    useTimeout({
        onTimeout: () => setToastInfo({ timeout: 3000 }),
        onClearTimeout: () => { },
        seconds: toastInfo?.timeout,
        deps: [toast]
    })

    return (
        <ToastContext.Provider value={{ toast }} >
            <ContainerBlock
                hidden={!toastInfo.message}
                style={{ position: 'absolute', top: 0, backgroundColor: 'red' }}>
                <SpanText>
                    {toastInfo?.message}
                </SpanText>
            </ContainerBlock>
        </ToastContext.Provider>
    )
}
