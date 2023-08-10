import { useEffect, useState } from 'react';
import { AppState, DevSettings } from 'react-native';
import {
    useFonts,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_500Medium,
    Montserrat_900Black,
    Montserrat_800ExtraBold
} from '@expo-google-fonts/montserrat'
import * as SplashScreen from 'expo-splash-screen';

export type IAppStatus = {
    status: "active" | "background" | "inactive" | "isLoading" | "isLoaded"
}

SplashScreen.preventAutoHideAsync();

const useAppStatus = (): IAppStatus => {
    const [appStatus, setAppStatus] = useState<IAppStatus['status']>('active');

    const [fontsLoaded, error] = useFonts({
        Montserrat_500Medium_Italic,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_500Medium,
        Montserrat_900Black,
        Montserrat_800ExtraBold
    });

    useEffect(() => {
        ; (async () => {
            if (fontsLoaded) {
                setAppStatus('isLoaded')
                await SplashScreen.hideAsync();
            } else if (error) {
                console.log("Fonts loading failed: ", error?.message)
                DevSettings.reload(error?.message)
            }
        })();

        const handleAppStateChange = (nextAppState: any) => {
            // Determine the app status based on the nextAppState value
            if (!fontsLoaded) return setAppStatus('isLoading')
            !(nextAppState === 'active') || setAppStatus('active')
            !(nextAppState === 'background') || setAppStatus('background')
            !(nextAppState === 'inactive') || setAppStatus('inactive')
        }

        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            appStateSubscription.remove()
        }
    }, [fontsLoaded, error])

    return {
        status: appStatus
    }
}

export default useAppStatus