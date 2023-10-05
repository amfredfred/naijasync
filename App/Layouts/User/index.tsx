import { ContainerFlex, ContainerBlock, ContainerSpaceBetween, ScrollContainer } from "../../Components/Containers";
import { StatusBar } from "react-native";
import { SpanText } from "../../Components/Texts";
import { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import useThemeColors from "../../Hooks/useThemeColors";
import { IconButton } from "../../Components/Buttons";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { useDataContext } from "../../Contexts/SysContext";
import { useNavigation } from "@react-navigation/native";
import { HeadLine } from "../../Components/Texts";

export default function UserLayout({ children }: { children: React.ReactNode }) {

    const { states: { states, user, storage }, setData } = useDataContext()
    const { navigate, goBack, canGoBack } = useNavigation()
    const [open, setOpen] = useState(false);
    const themeColors = useThemeColors()


    const handleNavigateTo = (to: string, params?: { [key: string]: any }) => {
        setOpen(false);
        (navigate as any)?.(to, params)
    }

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
                        onPress={() => (navigate as any)?.('FormsHome')}
                        hidden={states?.isInSearchMode}
                        icon={<Ionicons color={themeColors.text} size={25} name="add" />}
                    />
                    <IconButton
                        onPress={() => {
                            handleNavigateTo('MenuHome')
                            setOpen((prevOpen) => !prevOpen)
                        }}
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




    return (
        <ContainerFlex>
            {Header}
            {children}
        </ContainerFlex >
    )
}
