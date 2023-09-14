import { KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import AccountHeading from "../../../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../../../Hooks/useThemeColors";
import ComingSoonComponent from "../../../../../../Components/__coming__soon";
import { TextInput } from "react-native-paper";
import { SpanText } from "../../../../../../Components/Texts";
import { useAuthContext } from "../../../../../../Contexts/AuthContext";
import { IAuthContextData } from "../../../../../../Interfaces/iAuthContext";
import { useState } from "react";

interface IPasswordUpdate {
    current_password: string
    new_password: string
    password_confirmation: string
}

export default function UpdatePassword() {

    const themeColors = useThemeColors()

    const authContext = useAuthContext()

    const [PersonalInfo, setPersonalInfo] = useState<IAuthContextData['user']['account']>()
    const [canUpdate, setcanUpdate] = useState(false)


    const handleOnFormInput = (key: keyof IAuthContextData['user']['account'], payload: any) => {
        setPersonalInfo(info => ({ ...info, [key]: payload }))
    }

    const handleUpdateAccount = async () => {
        authContext?.updateAccount?.(PersonalInfo)
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: themeColors.background, padding: 10 }}>
            <AccountHeading />
            <ScrollView
                style={{ paddingTop: 10 }}
                contentContainerStyle={{ gap: 10 }}>
                <TextInput
                    underlineStyle={{ display: 'none' }}
                    onChangeText={(text) => handleOnFormInput('current_password', text)}
                    value={PersonalInfo?.current_password}
                    label={'Current password'}
                    contentStyle={{ minWidth: '100%' }}
                    secureTextEntry
                    textColor={themeColors.text}
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />
                <TextInput
                    underlineStyle={{ display: 'none' }}
                    onChangeText={(text) => handleOnFormInput('new_password', text)}
                    value={PersonalInfo?.new_password}
                    label={'New password'}
                    contentStyle={{ minWidth: '100%' }}
                    textColor={themeColors.text}
                    secureTextEntry
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />
                <TextInput
                    underlineStyle={{ display: 'none' }}
                    onChangeText={(text) => handleOnFormInput('password_confirmation', text)}
                    value={PersonalInfo?.password_confirmation}
                    label={'Confirm new password'}
                    contentStyle={{ minWidth: '100%' }}
                    secureTextEntry
                    textColor={themeColors.text}
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />
                <TouchableOpacity
                    onPress={handleUpdateAccount}
                    // disabled={!canUpdate || authContext?.isBusy}
                    children={<SpanText children={`Sav${authContext?.isBusy ? 'ing' : 'e'}`} />}
                    style={{
                        gap: 3,
                        borderRadius: 5,
                        height: 50,
                        marginTop: 10,
                        backgroundColor: themeColors.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: canUpdate ? 1 : .4
                    }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    textinput: {
        width: '100%',
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    textMessage: {
        fontSize: 11,
        paddingHorizontal: 10,
        marginTop: -7
    },
    radioButton: {
        borderRadius: 10,
        paddingRight: 5
    }
})