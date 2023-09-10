import { KeyboardAvoidingView, View, Platform, ScrollView, TextInput, StyleSheet } from "react-native";
import AccountHeading from "../../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../../Hooks/useThemeColors";
import { useAuthContext } from "../../../../../Contexts/AuthContext";
import { useEffect, useState } from "react";
import { IAuthContextData } from "../../../../../Interfaces/iAuthContext";

export default function UpdateProfile() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()

    const [PersonalInfo, setPersonalInfo] = useState<IAuthContextData['user']['account']>()

    useEffect(() => {

        setPersonalInfo(authContext?.user?.account)

        return () => {
            setPersonalInfo(null)
        }
    }, [])

    const handleOnFormInput = (key: string, payload: any) => {
        setPersonalInfo(info => ({ ...info, [key]: payload }))
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
            style={{ flex: 1, backgroundColor: themeColors.background }}
        >
            <AccountHeading />
            <ScrollView style={{ padding:10 }}>
                <View style={[styles.textinputContainer, { backgroundColor: themeColors.background2, marginTop: 20,}]}>
                    <TextInput
                        onChangeText={(text) => handleOnFormInput('fullName', text)}
                        value={PersonalInfo?.fullName}
                        placeholderTextColor={themeColors.text}
                        placeholder={authContext?.user?.account?.fullName}
                        style={{ color: themeColors.text, flex: 1 }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    roundButton: {
        borderRadius: 4,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textinputContainer: {
        height: 46, width: '100%',
        paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row'
    }
})