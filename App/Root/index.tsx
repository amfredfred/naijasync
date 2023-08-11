import { Text, Keyboard } from "react-native"
import UserLayout from "../Layouts/User"
import GuestLayout from "../Layouts/Guest"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from "../Screens/Guest/Landing";
import Home from "../Screens/User/Home";
import View from "../Screens/User/View";
import { useCallback, useEffect, useState } from 'react';
import DataContextProvider from "../Contexts/DataContext";
import Downloads from "../Screens/User/Downloads";
import useAppStatus from "../Hooks/useAppStatus";
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';



export default function Root() {
    const [isAuthenticated, setisAuthenticated] = useState(true)
    const { status } = useAppStatus()

    const Stack = createNativeStackNavigator();
    //

    const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

    const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['fashion', 'clothing'],
    });

    useEffect(() => {
        // // Preload an app open ad
        // appOpenAd.load();

        // // Show the app open ad when user brings the app to the foreground.
        // appOpenAd.show();

        console.log(status, TestIds, ":: APP STATUS")
    }, [status])


    const UserRoutes = (
        <UserLayout>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='View' component={View} />
                <Stack.Screen name='Downloads' component={Downloads} />
            </Stack.Navigator>
        </UserLayout>
    )

    const GuestRoutes = (
        <GuestLayout>
            <Text>Guest</Text>
            <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
                <Stack.Screen name='Landing' component={Landing} />
            </Stack.Navigator>
            <Text>Guest</Text>
        </GuestLayout>
    )

    return (
        <SafeAreaProvider>
            <DataContextProvider>
                <NavigationContainer >
                    {isAuthenticated ? UserRoutes : GuestRoutes}
                </NavigationContainer>
            </DataContextProvider>
        </SafeAreaProvider>
    )
}