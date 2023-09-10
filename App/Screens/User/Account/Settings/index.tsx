import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { useMemo } from "react";
import { HeadLine, SpanText } from "../../../../Components/Texts";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ContainerSpaceBetween } from "../../../../Components/Containers";
import { IconButton } from "../../../../Components/Buttons";

export default function SettingsHome() {

    const themeColors = useThemeColors()

    const { navigate } = useNavigation()

    const handleNavigateTo = (to: string, params?: { [key: string]: any }) => {
        (navigate as any)?.(to, params)
    }

    const menuItems = [
        {
            title: `Personal Info`, onPress: () => handleNavigateTo("Personal Info"), icon: <Ionicons size={30} name='person' />,
            description: 'Update  your name, bio, gender, DOB and Etc'
        },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
        { title: `Profile`, onPress: () => handleNavigateTo("Downloads"), icon: <Ionicons size={30} name='person' /> },
    ];

    return useMemo(() => (
        <View style={{ backgroundColor: themeColors.background, flex: 1 }}>
            <AccountHeading />

            <ScrollView style={{ flex: 1 }}>
                <View style={{ height: 2000, borderBottomWidth: 50, padding: 10 }}>
                    <View>
                        <HeadLine children="Profile & Preferences" />
                        <SpanText
                            style={{ fontSize: 14, opacity: .5, fontWeight: '100', marginTop: 6, lineHeight: 21 }}
                            children={`Settings to manage online profile and content visibility.`}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {
                            menuItems.map((item, index) => (
                                <View key={index} style={[styles.menuItemContainer, { backgroundColor: themeColors.background2 }]}>
                                    <TouchableOpacity key={item.title.trim()} onPress={item.onPress}>
                                        <ContainerSpaceBetween style={[styles.menuItem]}>
                                            <View style={{ flexDirection: 'row', gap: 13, paddingLeft: 0, backgroundColor: 'transparent' }}>
                                                <IconButton
                                                    containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                                                    icon={item.icon}
                                                    style={[styles.menuItemIcon]} />
                                                <View style={{ justifyContent: 'center' }}>
                                                    <SpanText
                                                        children={item.title}
                                                        style={{ fontSize: 17, opacity: .6 }} />
                                                    {item.description && (<SpanText
                                                        children={item.description}
                                                        style={{ fontSize: 12, opacity: .4 }} />
                                                    )}
                                                </View>
                                            </View>
                                            <IconButton
                                                containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                                                icon={<Ionicons name="chevron-forward" size={30} />}
                                                style={[styles.menuItemIcon]} />
                                        </ContainerSpaceBetween>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    ), [])
}

const styles = StyleSheet.create({
    menuItemContainer: {
        borderRadius: 4,
        marginVertical: 2,
        opacity: .4
    },
    menuItem: {
        height: 45,
        flexDirection: 'row',
        gap: 15
    },
    menuItemIcon: {
        width: 30,
        backgroundColor: 'transparent'
    }
})