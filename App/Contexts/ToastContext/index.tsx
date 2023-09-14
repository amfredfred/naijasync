import React, { createContext, useContext, useState } from 'react'
import useThemeColors from '../../Hooks/useThemeColors'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import useTimeout from '../../Hooks/useTimeout'
import { HeadLine, SpanText } from '../../Components/Texts'
import { StatusBar, View, StyleSheet, Image } from 'react-native'
import { IconButton } from '../../Components/Buttons'
import { Ionicons } from '@expo/vector-icons'

// import ErrorIcon from

interface IToastProps {
    message?: string
    severnity?: 'error' | 'success' | "warning" | "notify"
    timeout?: number
    headline?: string,
    autoHide?: boolean
}
interface IToast {
    toast(props: IToastProps): void
}

const ToastContext = createContext<IToast>(null)

export const useToast = () => useContext(ToastContext)

export default function ToastProvider({ children }) {



    const themeColors = useThemeColors()

    const [toastInfo, setToastInfo] = useState<IToastProps>({ timeout: 3000, autoHide: true })

    const icons = {
        warning: require('../../../assets/icons/icon-warning.gif'),
        error: require('../../../assets/icons/icon-error.png'),
        success: require('../../../assets/icons/icon-success.png'),
        notify: require('../../../assets/icons/info-icon.png'),
    }
    
    const backgrounds = {
        error: 'red',
        warning: '',
        success: '',
        notify: '',
    }

    const toast: IToast['toast'] = ({ message, severnity, timeout, autoHide, headline }) => {
        setToastInfo({ message, severnity, timeout, autoHide, headline })
    }

    useTimeout({
        onTimeout: () => setToastInfo({ timeout: 3000 }),
        onClearTimeout: () => { },
        seconds: toastInfo?.timeout,
        deps: [toastInfo?.message]
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
                            top: StatusBar.currentHeight,
                            backgroundColor: themeColors.background2,
                            width: '90%',
                            padding: 10,
                            justifyContent: 'center',
                            left: '5%',
                            borderRadius: 10,
                            borderLeftColor: backgrounds[toastInfo?.severnity],
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderRightColor: backgrounds[toastInfo?.severnity],
                            borderBottomWidth: .1,
                            borderBottomColor: backgrounds[toastInfo?.severnity],
                            borderTopWidth: .1,
                            borderTopColor: backgrounds[toastInfo?.severnity],
                        }}>
                        <View style={[styles?.spaceBeteen,]}>
                            <View style={[styles?.spaceBeteen, { justifyContent: 'flex-start' }]}>
                                <Image
                                    resizeMethod='resize'
                                    resizeMode="contain"
                                    style={{ width: 30, aspectRatio: 1 }} source={icons[toastInfo.severnity]} />
                                <HeadLine children={toastInfo?.headline ?? toastInfo?.severnity} />
                            </View>
                            <IconButton
                                onPress={() => setToastInfo({ timeout: 3000 })}
                                icon={<Ionicons name='close' size={20} />}
                            />
                        </View>
                        <SpanText style={{ fontSize: 16 }} children={toastInfo?.message} />
                    </Animated.View>
                )
            }
        </ToastContext.Provider>
    )
}

const styles = StyleSheet.create({
    spaceBeteen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
})