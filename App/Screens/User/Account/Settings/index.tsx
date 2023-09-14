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
import MenuItem from "../../../../Components/MenuItem";

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
            icon: <Ionicons size={30} name='person' color={themeColors?.text} />,
            description: 'Update  your name, bio, gender, DOB and Etc'
        },
        {
            title: `Notifications`,
            onPress: () => handleNavigateTo("Notificaions Preference"),
            icon: <Ionicons size={30} name='notifications' color={themeColors?.text} />,
            description: 'Update your notification preference'
        },
    ];

    const menuSecurityItems = [
        {
            title: `Account Password`,
            onPress: () => handleNavigateTo("Update Password"),
            icon: <MaterialIcons size={30} name='security' color={themeColors?.text} />,
            description: 'Manage your account password'
        },
        {
            title: "Manage Account Pin`s`",
            onPress: () => handleNavigateTo("Notificaions Preference"),
            icon: <Ionicons size={30} name='lock-closed' color={themeColors?.text} />,
            description: ''
        },
        {
            title: "Use Biometrics",
            onPress: () => handleNavigateTo("Setup Biometrics"),
            icon: <Ionicons size={30} name='finger-print' color={themeColors?.text} />,
            description: 'Use finger print for payment & transfers'
        },
    ];

    const menuPaymentAndTranferItems = [
        {
            title: `Fund Requests`,
            onPress: () => handleNavigateTo("Payment Requests"),
            icon: <Ionicons size={30} name='arrow-down' color={themeColors?.text} />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Funds Transfer`,
            onPress: () => handleNavigateTo("Funds Transfer"),
            icon: <Ionicons size={30} name='arrow-up' color={themeColors?.text} />,
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

                    <View
                        children={menuItems.map((item, index) => <MenuItem {...item} />)}
                        style={{ marginTop: 10 }} />

                    {/* SECURITY */}
                    <View style={{ marginTop: 10 }}>
                        <HeadLine children="Security" />
                        <SpanText
                            style={{ fontSize: 14, opacity: .5, fontWeight: '100', marginTop: 6, lineHeight: 21 }}
                            children={`Use unique, strong passwords for enhanced online security.`}
                        />
                    </View>

                    <View children={menuSecurityItems.map((item, index) => <MenuItem {...item} />)} style={{ marginTop: 10 }} />
                    {/* PAYMENT AND TRANFERS */}
                    <View style={{ marginTop: 10 }}>
                        <HeadLine children="Payment & Transfers" />
                        <SpanText
                            style={{ fontSize: 14, opacity: .5, fontWeight: '100', marginTop: 6, lineHeight: 21 }}
                            children={`Configure payment and tranfers references.`}
                        />
                    </View>
                    <View children={menuPaymentAndTranferItems.map((item, index) => <MenuItem {...item} />)} style={{ marginTop: 10 }} />

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