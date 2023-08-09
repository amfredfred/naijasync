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

export default function Root() {
    const [isAuthenticated, setisAuthenticated] = useState(true)

    const Stack = createNativeStackNavigator();

    const UserRoutes = (
        <UserLayout>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='View' component={View} />
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