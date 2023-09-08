import { ContainerFlex, ContainerBlock, ContainerSpaceBetween, ScrollContainer } from "../../Components/Containers";
import { Keyboard, StatusBar, BackHandler } from "react-native";
import { SpanText } from "../../Components/Texts";
import { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import useThemeColors from "../../Hooks/useThemeColors";
import { ButtonGradient, IconButton } from "../../Components/Buttons";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { useDataContext } from "../../Contexts/DataContext";
import { useNavigation } from "@react-navigation/native";
import { HeadLine } from "../../Components/Texts";
import { linkChecker } from "../../Helpers";
import IMAGS from '../../../assets/adaptive-icon.png'
import DigitalClock from "../../Components/DigitalClock";
import { useAuthContext } from "../../Contexts/AuthContext";
import useKeyboardEvent from "../../Hooks/useKeyboardEvent";

import PlayIcon from '../../../assets/icons/play-icon.png'

export default function UserLayout({ children }: { children: React.ReactNode }) {

    const [keyBoardShown, setkeyBoardShown] = useState(false)
    const authContext = useAuthContext()

    const { background, background2, text } = useThemeColors()
    const { states: { states, user, storage }, setData } = useDataContext()
    const { navigate, goBack, canGoBack } = useNavigation()
    const [open, setOpen] = useState(false);
    const themeColors = useThemeColors()

    useKeyboardEvent({
        onHide: () => setkeyBoardShown(s => false),
        onShow: () => setkeyBoardShown(s => true),
    })


    const Header = (
        <ContainerBlock
            style={{
                paddingTop: StatusBar.currentHeight + (states?.isHeaderHidden ? 0 : 10),
                paddingHorizontal: 10,
                borderBottomColor: themeColors?.background2,
                borderBottomWidth: 1,
            }}   >
            <ContainerSpaceBetween hidden={states?.isHeaderHidden} style={{ padding: 0, gap: 10 }}>
                <HeadLine
                    onPress={() => (navigate as any)?.("Home")}
                    hidden={states?.isInSearchMode} style={{ textTransform: 'uppercase' }}>NAIJASYNC</HeadLine>
                <ContainerSpaceBetween style={{ gap: 10, padding: 0 }}>

                    <IconButton
                        onPressIn={() => (navigate as any)?.("Search")}
                        hidden={states?.isInSearchMode}
                        icon={<AntDesign color={themeColors.text} size={25} name={'search1'} />}
                    />

                    <IconButton
                        onPress={() => (navigate as any)?.("PostComposer")}
                        hidden={states?.isInSearchMode}
                        icon={<Ionicons color={themeColors.text} size={25} name="add" />}
                    />
                    <IconButton
                        onPress={() => setOpen((prevOpen) => !prevOpen)}
                        hidden={states?.isInSearchMode}
                        icon={<AntDesign color={themeColors.text} size={25} name={open ? 'menu-fold' : 'menu-unfold'} />}
                    />
                    {/* <Button
                        title={`${open ? 'Close' : 'Open'} drawer`}
                    /> */}
                </ContainerSpaceBetween>

            </ContainerSpaceBetween>
        </ContainerBlock>
    )

    const handleNavigateTo = (to: string, params?: { [key: string]: any }) => {
        setOpen(false);
        (navigate as any)?.(to, params)
    }

    const menuItems = [
        { title: `Downloads ${storage?.myDownloadedAssets.length ?? ''}`, onPress: () => handleNavigateTo("Downloads"), icon: <MaterialIcons size={30} name="file-download-done" /> },
        { title: 'Watch History', onPress: () => console.log('Home pressed'), icon: <Octicons size={30} name="history" /> },
        { title: 'Watch List', onPress: () => console.log('Home pressed'), icon: <Ionicons size={30} name="list" /> },
        { title: 'Trending Now', onPress: () => console.log('Home pressed'), icon: <FontAwesome5 size={30} name="gripfire" /> },
        { title: 'Gifts ~ for youuu🪴🎁', onPress: () => console.log('Settings pressed'), icon: <Octicons size={30} name="gift" /> },
    ];

    const meniItemBlock = [
        { title: `Video`, onPress: () => handleNavigateTo("Explorer", { screen: 'video' }), icon: <MaterialIcons size={30} name="ondemand-video" /> },
        { title: 'Audio', onPress: () => handleNavigateTo("Explorer", { screen: 'audio' }), icon: <MaterialIcons size={30} name="music-note" /> },
        { title: 'Tools', onPress: () => console.log('Home pressed'), icon: <Octicons size={30} name='tools' /> },
        { title: 'Earn 🔥', onPress: () => console.log('Home pressed'), icon: <Ionicons size={30} name="wallet-outline" /> },
        { title: 'Create new Post', onPress: () => console.log('Settings pressed'), icon: <SimpleLineIcons size={30} name="pencil" /> },
    ]

    return (
        <ContainerFlex>
            <Drawer
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderDrawerContent={() => {
                    return (
                        <ContainerFlex
                            style={{}}     >
                            <View style={[styles.container, { borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: themeColors.background2 }]}>
                                <TouchableOpacity
                                    onPress={() => authContext?.user?.person === 'isAuthenticated' ? handleNavigateTo('Account') : authContext.skipToOnboard()}
                                    style={[styles.accountContainer, { backgroundColor: background2, }]}>
                                    <IconButton
                                        image={{ source: IMAGS, style: { width: 40, height: 40 } }} />
                                    <SpanText style={styles.accountText}>
                                        {authContext?.user?.account?.username ?? "Login • Registe"}
                                    </SpanText>
                                </TouchableOpacity>
                            </View>
                            <ScrollContainer style={{ padding: 10, backgroundColor: background }}>
                                <ContainerBlock style={{ padding: 0, backgroundColor: 'transparent', flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {
                                        meniItemBlock.map((item, index) => (
                                            <IconButton
                                                onPress={item.onPress}
                                                style={{ flexGrow: 1, borderRadius: 7, width: '45%' }}
                                                containerStyle={{ justifyContent: 'space-between', paddingVertical: 10 }}
                                                title={item.title}
                                                icon={item.icon}
                                            />
                                        ))
                                    }
                                </ContainerBlock>

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
                            </ScrollContainer>
                            {/* <ContainerSpaceBetween style={{ paddingVertical: 0 }} justify="flex-start">
                                <IconButton
                                    textStyle={{ textTransform: 'uppercase' }}
                                    title={`PPolicy • Terms`}
                                    icon={<Ionicons name='exit' />}
                                />
                                <IconButton
                                    textStyle={{ textTransform: 'uppercase' }}
                                    title="report • support"
                                    icon={<Ionicons name='exit' />}
                                />
                            </ContainerSpaceBetween> */}
                            <ContainerSpaceBetween style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: themeColors.background2 }}>
                                <DigitalClock />
                                <IconButton
                                    textStyle={{ textTransform: 'uppercase' }}
                                    title={`NAIJASYNC • ${new Date().getFullYear()}`}
                                />
                            </ContainerSpaceBetween>
                        </ContainerFlex>
                    )
                }}
                drawerStyle={{
                    backgroundColor: background2
                }}
            >
                {Header}
                {children}
            </Drawer >
        </ContainerFlex >
    )
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
        padding: 10,
        paddingTop: StatusBar.currentHeight,
    },
    accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10
    },
    accountText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
})