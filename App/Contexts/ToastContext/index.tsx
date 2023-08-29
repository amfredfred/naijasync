import React, { createContext, useContext, useState } from 'react'
import useThemeColors from '../../Hooks/useThemeColors'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import useTimeout from '../../Hooks/useTimeout'
import { SpanText } from '../../Components/Texts'
import { StatusBar } from 'react-native'

interface IToast {
    toast(props: {
        message?: string
        severnity?: 'error' | 'success' | "warning"
        timeout?: number
    }): void
}

const ToastContext = createContext<IToast>(null)

export const useToast = () => useContext(ToastContext)

export default function ToastProvider({ children }) {

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
            {children}
            {
                toastInfo.message && (
                    <Animated.View
                        entering={SlideInUp}
                        exiting={SlideOutUp}
                        style={{
                            position: 'absolute',
                            top: 0,
                            paddingTop: StatusBar.currentHeight,
                            backgroundColor:
                                toastInfo.severnity === 'error' ? themeColors.error : toastInfo.severnity === 'success' ? themeColors.success : toastInfo.severnity === 'warning' ? themeColors.warning : themeColors.background,
                            width: '100%',
                            padding: 10,
                            minHeight: 80,
                            justifyContent: 'center'
                        }}>
                        <SpanText>
                            {toastInfo?.message}
                        </SpanText>
                    </Animated.View>
                )
            }
        </ToastContext.Provider>
    )
}
