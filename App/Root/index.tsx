import { useEffect, useState } from "react"
import { Text, Keyboard } from "react-native"
import UserLayout from "../Layouts/User"
import GuestLayout from "../Layouts/Guest"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from "../Screens/Guest/Landing";
import Home from "../Screens/User/Home";


export default function Root() {
    const [isAuthenticated, setisAuthenticated] = useState(true)

    const Stack = createNativeStackNavigator();

    return (
        <SafeAreaProvider>
            <NavigationContainer >
                {isAuthenticated ?
                    <UserLayout>
                        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} >
                            <Stack.Screen name='Home' component={Home} options={{ title: 'Home' }} />
                        </Stack.Navigator>
                    </UserLayout>
                    :
                    <GuestLayout>
                        <Text>Guest</Text>
                        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
                            <Stack.Screen name='Landing' component={Landing} />
                        </Stack.Navigator>
                        <Text>Guest</Text>
                    </GuestLayout>
                }
            </NavigationContainer>
        </SafeAreaProvider>
    )
}