import { ContainerFlex, ContainerBlock, ContainerSpaceBetween, ScrollContainer } from "../../Components/Containers";
import { Keyboard, StatusBar, BackHandler } from "react-native";
import { SpanText } from "../../Components/Texts";
import { useEffect, useState } from 'react'
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import useThemeColors from "../../Hooks/useThemeColors";
import { IconButton } from "../../Components/Buttons";
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { InputText } from "../../Components/Inputs";
import { useDataContext } from "../../Contexts/DataContext";
import { useNavigation } from "@react-navigation/native";
import { HeadLine } from "../../Components/Texts";
import { linkChecker } from "../../Helpers";
import TabSelector from "../../Screens/__/TabSelector";
import IMAGS from '../../../assets/adaptive-icon.png'
import DigitalClock from "../../Screens/__/DigitalClock";
import { usePostFormContext } from "../../Contexts/FormContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {

    const [keyBoardShown, setkeyBoardShown] = useState(false)
    const formContext = usePostFormContext()

    const { background, background2, text } = useThemeColors()
    const { states: { states, user, storage }, setData } = useDataContext()
    const { navigate, goBack, canGoBack } = useNavigation()

    const handleToSearchhandle = () => {
        (navigate as any)?.("Search")
        setData('states', 'isInSearchMode', true)
    }
    const handleCancelSearchSection = () => {
        if (canGoBack()) {
            setData('states', 'isInSearchMode', false)
            goBack()
            return true
        } else {
            setData('states', 'isInSearchMode', false)
        }
        return false
    }

    const onSearchInputTextChange = (text: string) => {
        const isLinkchecked = linkChecker(text)
        console.log(isLinkchecked)
        setData('user', 'searchRequestValue', text)
        console.log(text)
    }

    //Effects 
    useEffect(() => {

        const BHND = BackHandler.addEventListener('hardwareBackPress', handleCancelSearchSection)
        const keyboardshown = Keyboard.addListener('keyboardDidShow', () => setkeyBoardShown(s => true))
        const keyboardhidden = Keyboard.addListener('keyboardDidHide', () => setkeyBoardShown(s => false))

        return () => {
            keyboardshown.remove()
            keyboardhidden.remove()
            BHND.remove()
        }
    }, [])

    const [open, setOpen] = useState(false);

    const Header = (
        <ContainerBlock
            style={{
                paddingTop: StatusBar.currentHeight + (states?.isHeaderHidden ? 0 : 10),
                paddingHorizontal: 10,
                paddingBottom: states?.isHeaderHidden ? 0 : 10,
                backgroundColor: states?.isHeaderHidden ? background : background2
            }}   >
            <ContainerSpaceBetween hidden={states?.isHeaderHidden} style={{ padding: 0, gap: 10 }}>
                <HeadLine hidden={states?.isInSearchMode} style={{ textTransform: 'uppercase' }}>NAIJASYNC</HeadLine>
                <ContainerSpaceBetween style={{ gap: 10, padding: 0 }}>
                    <ContainerSpaceBetween style={{ padding: 0, overflow: 'hidden' }}>
                        <IconButton
                            icon={<Ionicons size={30} name="arrow-back" />}
                            hidden={!states?.isInSearchMode}
                            onPress={handleCancelSearchSection}
                        />
                        <InputText
                            onPressIn={handleToSearchhandle}
                            // onBlur={handleSearchInputBlur}
                            placeholder="Search..."
                            onChangeText={onSearchInputTextChange}
                            variant="search"
                            value={user?.searchRequestValue}
                            containerStyle={{ maxWidth: states?.isInSearchMode ? "91%" : 120, paddingHorizontal: 2, borderColor: text, borderWidth: .1, backgroundColor: background }}
                        />
                    </ContainerSpaceBetween>

                    <IconButton
                        onPress={() => formContext.methods?.showForm('upload', {})}
                        hidden={states?.isInSearchMode}
                        icon={<Ionicons size={30} name="create" />}
                    />
                    <IconButton
                        onPress={() => setOpen((prevOpen) => !prevOpen)}
                        hidden={states?.isInSearchMode}
                        icon={<AntDesign size={35} name={open ? 'menu-fold' : 'menu-unfold'} />}
                    />
                    {/* <Button
                        title={`${open ? 'Close' : 'Open'} drawer`}
                    /> */}
                </ContainerSpaceBetween>

            </ContainerSpaceBetween>
        </ContainerBlock>
    )

    const handleNavigateTo = (to: string) => {
        setOpen(false);
        (navigate as any)?.(to)
    }

    const menuItems = [
        { title: `Downloads ${storage?.myDownloadedAssets.length ?? ''}`, onPress: () => handleNavigateTo("Downloads"), icon: <MaterialIcons size={30} name="file-download-done" /> },
        { title: 'Watch History', onPress: () => console.log('Home pressed'), icon: <Octicons size={30} name="history" /> },
        { title: 'Watch List', onPress: () => console.log('Home pressed'), icon: <Ionicons size={30} name="list" /> },
        { title: 'Trending Now', onPress: () => console.log('Home pressed'), icon: <FontAwesome5 size={30} name="gripfire" /> },
        { title: 'Gifts ~ for youuu🪴🎁', onPress: () => console.log('Settings pressed'), icon: <Octicons size={30} name="gift" /> },
    ];

    return (
        <ContainerFlex>
            <Drawer
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderDrawerContent={() => {
                    return (
                        <ContainerFlex
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <View style={[styles.container, { backgroundColor: background }]}>
                                <TouchableOpacity style={styles.accountContainer}>
                                    <IconButton
                                        // icon={<Feather name="user" size={100} color="#fff" />}
                                        image={{ source: IMAGS, style: { width: 60, height: 60 } }}
                                    />
                                    <Text style={styles.accountText}>LOGIN/REGISTER</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollContainer style={{ marginTop: -15, padding: 10, backgroundColor: background2, borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
                                <ContainerBlock style={{ padding: 0, backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1 }}>
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
                            <ContainerSpaceBetween style={{ paddingVertical: 0 }} justify="flex-start">
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
                            </ContainerSpaceBetween>
                            <ContainerSpaceBetween>
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
            </Drawer>
        </ContainerFlex>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: StatusBar.currentHeight,
    },
    accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    accountText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
})