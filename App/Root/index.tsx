import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import GuestLayout from "../Layouts/Guest"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Landing from "../Screens/Guest/Landing";
import Home from "../Screens/Home";
import DataContextProvider from "../Contexts/SysContext";
import Downloads from "../Screens/User/Downloads";
import { AppOpenAd, TestIds, useAppOpenAd } from 'react-native-google-mobile-ads';
import "expo-dev-client"
import Search from "../Screens/Search";
import { Linking, View } from 'react-native';
import { MediaViewerProvider } from "../Contexts/MediaPlaybackContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from "../Contexts/ToastContext";
import { useAuthContext } from '../Contexts/AuthContext';
import RegisterScreen from '../Screens/Guest/Auth/Register/index,';
import LoginScreen from '../Screens/Guest/Auth/Login';
import AccountLayout from '../Layouts/Account';
import Account from '../Screens/User/Account';
import AccountTabBar from '../Layouts/Account/AccountTabBar'; 
import FinanceHome from '../Screens/User/Account/Finance';
import SettingsHome from '../Screens/User/Account/Settings';
import DashboardHome from '../Screens/User/Account/Dashboard';
import UpdateProfile from '../Screens/User/Account/Settings/Profile';
import UpdateNotification from '../Screens/User/Account/Settings/Notification';
import UpdatePassword from '../Screens/User/Account/Settings/Security/ChangePassword';
import UpdateFundsRequestsSettings from '../Screens/User/Account/Settings/Payment/FundsRequest';
import UpdateFundsTranferSettings from '../Screens/User/Account/Settings/Payment/FundsTransfer';
import UpdateBiometricSettings from '../Screens/User/Account/Settings/Security/SetupBiometrics';
import { useEffect, useLayoutEffect } from 'react';
import PlayVideo from '../Screens/Viewer/Post/Video';
import MarketPlaceHome from '../Screens/MarketPlace';
import StoriesHome from '../Screens/Stories';
import FormsHome from '../Screens/Forms';
import FormStatusHome from '../Screens/Forms/Post/FormStatusHome';
import FormUploadHome from '../Screens/Forms/Post/FormUploadHome';

const Stack = createNativeStackNavigator();
const Buttom = createBottomTabNavigator()

const AccountSettingsRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }} >
        <Stack.Screen name='Personalization & Security' component={SettingsHome} />
        <Stack.Screen name='Personal Info' key={'Public Profile Update'} component={UpdateProfile} />
        <Stack.Screen name='Notificaions Preference' component={UpdateNotification} />
        <Stack.Screen name='Update Password' component={UpdatePassword} />
        <Stack.Screen name='Payment Requests' component={UpdateFundsRequestsSettings} />
        <Stack.Screen name='Funds Transfer' component={UpdateFundsTranferSettings} />
        <Stack.Screen name='Setup Biometrics' component={UpdateBiometricSettings} />
    </Stack.Navigator>
)

const AccountDashboardRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }} >
        <Stack.Screen name='Account overview 🌟' component={DashboardHome} />
    </Stack.Navigator>
)

const AccountFundingRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }} >
        <Stack.Screen name='Payments & Transfers' component={FinanceHome} />
    </Stack.Navigator>
)

const AccountRoutes = () => (
    <AccountLayout>
        <Buttom.Navigator tabBar={op => <AccountTabBar {...op} />} screenOptions={screenOptions} >
            <Buttom.Screen name='Posts' options={{ tabBarBadge: 'posts' }} component={Account} />
            <Buttom.Screen name='Dashboard' options={{ tabBarBadge: 'dashboard' }} component={AccountDashboardRoutes} />
            <Buttom.Screen name='Payments' options={{ tabBarBadge: 'wallet' }} component={AccountFundingRoutes} />
            <Buttom.Screen name='Settings' options={{ tabBarBadge: 'settings' }} component={AccountSettingsRoutes} />
        </Buttom.Navigator>
    </AccountLayout>
)

const PublicRoutes = (
    <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }} >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Downloads' component={Downloads} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Account" component={AccountRoutes} />
        <Stack.Screen name="Market" component={MarketPlaceHome} />
        <Stack.Screen name="Stories" component={StoriesHome} />
        <Stack.Screen name='PlayVideo' component={PlayVideo} />

        <Stack.Screen name='FormsHome' component={FormsHome} />
        <Stack.Screen name='FormStatusHome' component={FormStatusHome} />
        <Stack.Screen name='FormUploadHome' component={FormUploadHome} />
    </Stack.Navigator>
)

const screenOptions = {
    headerShown: false,
    animation: "fade",
    contentStyle: { backgroundColor: 'red' }
} as const

function Routes() {

    const auth = useAuthContext()

    Linking.addEventListener('url', ({ url }) => {
        const route = url.replace(/.*?:\/\//g, '');
        console.log(route, " FROM LINKING")
    });

    const GuestRoutes = (
        <GuestLayout>
            <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }}>
                <Stack.Screen name='Landing' component={Landing} />
                <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} />
            </Stack.Navigator>
        </GuestLayout>
    )

    return (
        <View style={{ flex: 1 }}>
            {((auth?.user?.person === 'hasSkippedAuthentication' || auth?.user?.person === 'isAuthenticated') ? PublicRoutes : GuestRoutes)}
        </View>
    )
}

export default function Root() {

    const Client = new QueryClient()

    const appOpenAd = useAppOpenAd(TestIds.APP_OPEN, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['fashion', 'clothing'],
    })
    useLayoutEffect(() => { appOpenAd?.load() }, [appOpenAd?.load])
    // useEffect(() => { !appOpenAd?.isLoaded || appOpenAd?.show() }, [appOpenAd?.isLoaded])


    return (
        <NavigationContainer>
            <QueryClientProvider client={Client} >
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
    )
}


