import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { useMemo } from "react";
import { HeadLine, SpanText } from "../../../../Components/Texts";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ContainerSpaceBetween } from "../../../../Components/Containers";
import { IconButton } from "../../../../Components/Buttons";
import { useAuthContext } from "../../../../Contexts/AuthContext";

export default function SettingsHome() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const { navigate } = useNavigation()

    const handleNavigateTo = (to: string, params?: { [key: string]: any }) => {
        (navigate as any)?.(to, params)
    }

    const menuItems = [
        {
            title: `Personal Info`,
            onPress: () => handleNavigateTo("Personal Info"),
            icon: <Ionicons size={30} name='person' />,
            description: 'Update  your name, bio, gender, DOB and Etc'
        },
        {
            title: `Notifications`,
            onPress: () => handleNavigateTo("Notificaions Preference"),
            icon: <Ionicons size={30} name='notifications' />,
            description: 'Update your notification preference'
        },
    ];

    const menuSecurityItems = [
        {
            title: `Account Password`,
            onPress: () => handleNavigateTo("Update Password"),
            icon: <MaterialIcons size={30} name='security' />,
            description: 'Manage your account password'
        },
        {
            title: "Manage Account Pin`s`",
            onPress: () => handleNavigateTo("Notificaions Preference"),
            icon: <Ionicons size={30} name='lock-closed' />,
            description: ''
        },
        {
            title: "Use Biometrics",
            onPress: () => handleNavigateTo("Setup Biometrics"),
            icon: <Ionicons size={30} name='finger-print' />,
            description: 'Use finger print for payment & transfers'
        },
    ];

    const menuPaymentAndTranferItems = [
        {
            title: `Fund Requests`,
            onPress: () => handleNavigateTo("Payment Requests"),
            icon: <Ionicons size={30} name='arrow-down' />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Funds Transfer`,
            onPress: () => handleNavigateTo("Funds Transfer"),
            icon: <Ionicons size={30} name='arrow-up' />,
            description: 'Enable/Diasable funds tranfers in your account'
        }
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

                    {/* SECURITY */}
                    <View style={{ marginTop: 10 }}>
                        <HeadLine children="Security" />
                        <SpanText
                            style={{ fontSize: 14, opacity: .5, fontWeight: '100', marginTop: 6, lineHeight: 21 }}
                            children={`Use unique, strong passwords for enhanced online security.`}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {
                            menuSecurityItems.map((item, index) => (
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
                    {/* PAYMENT AND TRANFERS */}
                    <View style={{ marginTop: 10 }}>
                        <HeadLine children="Payment & Transfers" />
                        <SpanText
                            style={{ fontSize: 14, opacity: .5, fontWeight: '100', marginTop: 6, lineHeight: 21 }}
                            children={`Configure payment and tranfers references.`}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {
                            menuPaymentAndTranferItems.map((item, index) => (
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
                    <SpanText style={{ backgroundColor: 'red', opacity: .09, padding: 10, marginVertical: 20, borderRadius: 5, textAlign: 'center' }} children={'More exciting things is coming soon!!'} />
                    <IconButton
                        onPress={authContext?.logout}
                        containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                        icon={<AntDesign name='logout' size={30} />}
                        // style={[styles.menuItemIcon]}
                        style={[styles.menuItemContainer, { backgroundColor: themeColors.error, padding: 10, width: 50, borderRadius: 50, aspectRatio: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]} />
                </View>
            </ScrollView>
        </View>
    ), [])
}

const styles = StyleSheet.create({
    menuItemContainer: {
        borderRadius: 5,
        marginVertical: 2,
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