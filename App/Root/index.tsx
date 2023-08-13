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
// import { AppOpenAd, TestIds, useAppOpenAd } from 'react-native-google-mobile-ads';
import "expo-dev-client"
import Explorer from "../Screens/User/Explorer";


export default function Root() {
    const [isAuthenticated, setisAuthenticated] = useState(true)
    const { status } = useAppStatus()
    const Stack = createNativeStackNavigator();

    // const { load, show, error, isLoaded } = useAppOpenAd(TestIds.APP_OPEN, {
    //     requestNonPersonalizedAdsOnly: true,
    //     keywords: ['fashion', 'clothing'],
    // })


    // useEffect(() => {
    //     load()
    //     if (isLoaded) {
    //         console.log("APP OPEN ADS LOADED")
    //         show()
    //     }
    // }, [isLoaded, load])


    const UserRoutes = (
        <UserLayout>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='View' component={View} />
                <Stack.Screen name='Downloads' component={Downloads} />
                <Stack.Screen name="Explorer" component={Explorer}  />
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