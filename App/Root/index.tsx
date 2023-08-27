import { Text, Keyboard } from "react-native"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
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
import Search from "../Screens/User/Search";
import { Linking } from 'react-native';
import MediaViewer from "../Screens/Statics/MediaViewer";
import { MediaViewerProvider } from "../Screens/Statics/MediaViewer/Context";
// import { BottomSheetProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from "../Contexts/ToastContext";
import PostFormProvider from "../Contexts/FormContext";

export default function Root() {
    const [isAuthenticated, setisAuthenticated] = useState(true)
    const { status } = useAppStatus()
    const Stack = createNativeStackNavigator();
    const Client = new QueryClient()

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


    const UserRoutes = (
        <UserLayout>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='View' component={View} />
                <Stack.Screen name='Downloads' component={Downloads} />
                <Stack.Screen name="Explorer" component={Explorer} />
                <Stack.Screen name="Search" component={SearchStack} />
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
            <QueryClientProvider client={Client}>
                <ToastProvider>
                    <DataContextProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <NavigationContainer>
                                <MediaViewerProvider>
                                    <PostFormProvider>
                                        {isAuthenticated ? UserRoutes : GuestRoutes}
                                    </PostFormProvider>
                                </MediaViewerProvider>
                            </NavigationContainer>
                        </GestureHandlerRootView>
                    </DataContextProvider>
                </ToastProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    )
}