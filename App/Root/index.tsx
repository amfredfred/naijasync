import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import UserLayout from "../Layouts/User"
import GuestLayout from "../Layouts/Guest"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Landing from "../Screens/Guest/Landing";
import Home from "../Screens/User/Home";
import { useCallback, useEffect, useState } from 'react';
import DataContextProvider from "../Contexts/DataContext";
import Downloads from "../Screens/User/Downloads";
import useAppStatus from "../Hooks/useAppStatus";
// import { AppOpenAd, TestIds, useAppOpenAd } from 'react-native-google-mobile-ads';
import "expo-dev-client"
import Explorer from "../Screens/User/Explorer";
import Search from "../Screens/User/Search";
import { Linking } from 'react-native';
import { MediaViewerProvider } from "../Screens/Statics/MediaViewer/Context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from "../Contexts/ToastContext";
import PostFormProvider from "../Contexts/FormContext";
import AuthContextProvider, { useAuthContext } from '../Contexts/AuthContext';
import RegisterScreen from '../Screens/Guest/Auth/Register/index,';
import LoginScreen from '../Screens/Guest/Auth/Login';
import AccountLayout from '../Layouts/Account';
import Account from '../Screens/User/Account';

function Routes() {
    // const [isAuthenticated, setisAuthenticated] = useState(true)
    const { status } = useAppStatus()
    const Stack = createNativeStackNavigator();
    const Buttom = createBottomTabNavigator()
    const auth = useAuthContext()

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


    // Listen for deep link events
    Linking.addEventListener('url', ({ url }) => {
        const route = url.replace(/.*?:\/\//g, '');
        console.log(route, " FROM LINKING")
        // Use route to navigate to the appropriate screen
    });


    const SearchStack = () => (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }}>
            <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
    )

    const AccountRoutes = () => (
        <AccountLayout>
            <Buttom.Navigator screenOptions={{ headerShown: false, }}>
                <Buttom.Screen name='Account' component={Account} />
            </Buttom.Navigator>
        </AccountLayout>
    )

    const PublicRoutes = () => (
        <UserLayout>
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Downloads' component={Downloads} />
                <Stack.Screen name="Explorer" component={Explorer} />
                <Stack.Screen name="Search" component={SearchStack} />
            </Stack.Navigator>
        </UserLayout>
    )

    const UserRoutes = (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
            <Stack.Screen name='Home' component={PublicRoutes} />
            <Stack.Screen name="Account" component={AccountRoutes} />
        </Stack.Navigator>
    )


    const GuestRoutes = (
        <GuestLayout>
            <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }}>
                <Stack.Screen name='Landing' component={Landing} />
                <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} />
            </Stack.Navigator>
        </GuestLayout>
    )

    console.log('RERENDERED: ROOOT')

    return (
        <PostFormProvider>
            {(auth?.user?.person === 'hasSkippedAuthentication' || auth?.user?.person === 'isAuthenticated') ? UserRoutes : GuestRoutes}
        </PostFormProvider>
    )
}

export default function Root() {

    const Client = new QueryClient()

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={Client}>
                <DataContextProvider>
                    <ToastProvider>
                        <AuthContextProvider>
                            <GestureHandlerRootView style={{ flex: 1 }}>
                                <NavigationContainer>
                                    <MediaViewerProvider>
                                        <Routes />
                                    </MediaViewerProvider>
                                </NavigationContainer>
                            </GestureHandlerRootView>
                        </AuthContextProvider>
                    </ToastProvider>
                </DataContextProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    )
}