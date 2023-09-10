import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import GuestLayout from "../Layouts/Guest"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Landing from "../Screens/Guest/Landing";
import Home from "../Screens/Home";
import DataContextProvider from "../Contexts/DataContext";
import Downloads from "../Screens/User/Downloads";
import useAppStatus from "../Hooks/useAppStatus";
// import { AppOpenAd, TestIds, useAppOpenAd } from 'react-native-google-mobile-ads';
import "expo-dev-client"
import Explorer from "../Screens/Explorer";
import Search from "../Screens/Search";
import { Linking } from 'react-native';
import { MediaViewerProvider } from "../Screens/Statics/MediaViewer/Context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from "../Contexts/ToastContext";
import { useAuthContext } from '../Contexts/AuthContext';
import RegisterScreen from '../Screens/Guest/Auth/Register/index,';
import LoginScreen from '../Screens/Guest/Auth/Login';
import AccountLayout from '../Layouts/Account';
import Account from '../Screens/User/Account';
import AccountTabBar from '../Layouts/Account/AccountTabBar';
import PostComposer from '../Screens/Forms/Post';
import FinanceHome from '../Screens/User/Account/Finance';
import SettingsHome from '../Screens/User/Account/Settings';
import DashboardHome from '../Screens/User/Account/Dashboard';


const screenOptions = {
    headerShown: false,
    animation: "fade",
    contentStyle: { backgroundColor: 'red' }
} as const

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

    const AccountSettingsRoutes = () => (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
            <Stack.Screen name='Personalization & Security' component={SettingsHome} />
        </Stack.Navigator>
    )

    const AccountRoutes = () => (
        <AccountLayout>
            <Buttom.Navigator tabBar={op => <AccountTabBar {...op} />} screenOptions={screenOptions} >
                <Buttom.Screen name='Profile' options={{ tabBarBadge: 'account' }} component={Account} />
                <Buttom.Screen name='Dashboard' options={{ tabBarBadge: 'dashboard' }} component={DashboardHome} />
                <Buttom.Screen name='Funding' options={{ tabBarBadge: 'wallet' }} component={FinanceHome} />
                <Buttom.Screen name='Settings' options={{ tabBarBadge: 'settings' }} component={AccountSettingsRoutes} />
            </Buttom.Navigator>
        </AccountLayout>
    )

    const PublicRoutes = (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: "slide_from_right" }} >
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Downloads' component={Downloads} />
            <Stack.Screen name="Explorer" component={Explorer} initialParams={{ screen: 'videos' }} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name='PostComposer' component={PostComposer} />
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

    return ((auth?.user?.person === 'hasSkippedAuthentication' || auth?.user?.person === 'isAuthenticated') ? PublicRoutes : GuestRoutes)

}

export default function Root() {

    const Client = new QueryClient()

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <QueryClientProvider client={Client}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <ToastProvider>
                            <MediaViewerProvider>
                                <DataContextProvider>
                                    <Routes />
                                </DataContextProvider>
                            </MediaViewerProvider>
                        </ToastProvider>
                    </GestureHandlerRootView>
                </QueryClientProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}