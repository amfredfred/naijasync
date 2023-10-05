import { FontAwesome5, Ionicons, MaterialIcons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { ContainerBlock, ContainerSpaceBetween } from "../../Components/Containers";
import DigitalClock from "../../Components/DigitalClock";
import { IconButton } from "../../Components/Buttons";
import { ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { SpanText } from "../../Components/Texts";
import { useAuthContext } from "../../Contexts/AuthContext";
import { View, StyleSheet } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { useDataContext } from "../../Contexts/SysContext";
import IMAGS from '../../../assets/adaptive-icon.png'
import useThemeColors from "../../Hooks/useThemeColors";
import UserLayout from "../../Layouts/User";
import { useMemo } from "react";
import { Avatar } from "react-native-paper";
import { formatNumber } from "../../Helpers";


export default function MenuHome() {

    const authContext = useAuthContext()
    const { navigate } = useNavigation()
    const themeColors = useThemeColors()
    const { states: { states, user, storage }, setData } = useDataContext()
    const handleNavigateTo = (to: string, params?: { [key: string]: any }) => {
        (navigate as any)?.(to, params)
    }

    const menuItems = [
        { title: `Downloads ${storage?.myDownloadedAssets.length ?? ''}`, onPress: () => handleNavigateTo("Downloads"), icon: <MaterialIcons size={30} name="file-download-done" /> },
        { title: 'Watch History', onPress: () => console.log('Home pressed'), icon: <Octicons size={30} name="history" /> },
        { title: 'Watch List', onPress: () => console.log('Home pressed'), icon: <Ionicons size={30} name="list" /> },
        { title: 'Trending Now', onPress: () => console.log('Home pressed'), icon: <FontAwesome5 size={30} name="gripfire" /> },
        { title: 'Gifts ~ for youuu🪴🎁', onPress: () => console.log('Settings pressed'), icon: <Octicons size={30} name="gift" /> },
    ];
    console.log(authContext?.user?.account?.profilePics?.[0],)
    const WhenAuthenticated = (
        <TouchableOpacity
            onPress={() => authContext?.user?.person === 'isAuthenticated' ? handleNavigateTo('Account') : authContext.skipToOnboard()}
            style={[styles.accountContainer, { backgroundColor: themeColors.background2, }]}>
            <Avatar.Image
                size={35}
                source={{ uri: authContext?.user?.account?.profilePics?.[0] as any }}
            />
            <View style={styles.accountText}>
                <SpanText children={authContext?.user?.account?.fullName} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons size={16} color={themeColors.text} name='wallet' />
                    <SpanText style={{ fontSize: 13 }} children={'🪙'} />
                    <SpanText style={{ fontSize: 13 }} children={formatNumber(authContext?.user?.account?.points)} />
                </View>
            </View>
        </TouchableOpacity>
    )

    return useMemo(() => (
        <UserLayout>
            <View
                style={{ flex: 1, }}     >
                <View style={[styles.container]}>
                    {authContext?.user?.person === 'isAuthenticated' ? WhenAuthenticated : null}
                </View>
                <ScrollView style={{ padding: 10, backgroundColor: themeColors.background, flex: 1 }}>
                    <ContainerBlock style={{ padding: 0, backgroundColor: 'transparent' }}>
                        {
                            menuItems.map((item, index) => (
                                <ContainerBlock key={index} style={{ backgroundColor: 'transparent', paddingHorizontal: 0 }}>
                                    <TouchableOpacity key={item.title.trim()} onPress={item.onPress}>
                                        <ContainerSpaceBetween style={[styles.menuItem]}>
                                            <ContainerBlock style={{ flexDirection: 'row', gap: 13, paddingLeft: 0, backgroundColor: 'transparent' }}>
                                                <IconButton
                                                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                                                    icon={item.icon}
                                                    style={[styles.menuItemIcon]} />
                                                <SpanText
                                                    children={item.title}
                                                    style={{ fontSize: 17, opacity: .6 }} />
                                            </ContainerBlock>
                                            <IconButton
                                                containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                                                icon={<Ionicons name="chevron-forward" size={30} />}
                                                style={[styles.menuItemIcon]} />
                                        </ContainerSpaceBetween>
                                    </TouchableOpacity>
                                </ContainerBlock>
                            ))
                        }
                    </ContainerBlock>
                </ScrollView>
                <ContainerSpaceBetween style={{}}>
                    <DigitalClock />
                    <IconButton
                        textStyle={{ textTransform: 'uppercase' }}
                        title={`NAIJASYNC • ${new Date().getFullYear()}`}
                    />
                </ContainerSpaceBetween>
            </View>
        </UserLayout>
    ), [])
}


const styles = StyleSheet.create({
    menuItem: {
        height: 45,
        flexDirection: 'row',
        gap: 15
    },
    menuItemIcon: {
        width: 30,
        backgroundColor: 'transparent'
    },
    container: {
        // backgroundColor: '#1976D2',

    },
    accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    accountText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
})