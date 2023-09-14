import { KeyboardAvoidingView, View, Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { RadioButton, TextInput, } from 'react-native-paper'
import AccountHeading from "../../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../../Hooks/useThemeColors";
import { useAuthContext } from "../../../../../Contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { IAuthContextData } from "../../../../../Interfaces/iAuthContext";
import { SpanText } from "../../../../../Components/Texts";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { REQUESTS_API } from "@env";
import useTimeout from "../../../../../Hooks/useTimeout";
import { areNotEqual } from "../../../../../Helpers";

export default function UpdateProfile() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()

    const [PersonalInfo, setPersonalInfo] = useState<IAuthContextData['user']['account']>()
    const [shouldCheckUsernameAvialability, setshouldCheckUsernameAvialability] = useState(false)
    const [canUpdate, setcanUpdate] = useState(false)

    const $userAccount = useQuery(
        ['username-availability'],
        async () => await axios.get<IAuthContextData['user']['account'] & { exists: boolean }>(`${REQUESTS_API}account-exists?username=${PersonalInfo?.username}`,),
        { enabled: shouldCheckUsernameAvialability }
    )

    useTimeout({
        onTimeout() {
            setshouldCheckUsernameAvialability(areNotEqual(PersonalInfo?.username?.trim?.(), authContext?.user?.account?.username?.trim?.()))
        },
        onClearTimeout() {
            $userAccount?.remove()
            setshouldCheckUsernameAvialability(false)
        },
        seconds: 1000,
        deps: [PersonalInfo?.username]
    })

    useEffect(() => {

        setPersonalInfo(authContext?.user?.account)

        return () => {
            setPersonalInfo(null)
        }
    }, [])

    useEffect(() => {
        setcanUpdate(
            areNotEqual(PersonalInfo?.username?.trim?.(), authContext?.user?.account?.username?.trim?.()) ||
            areNotEqual(PersonalInfo?.fullName?.trim?.(), authContext.user?.account?.fullName?.trim?.()) ||
            areNotEqual(PersonalInfo?.bio?.trim?.(), authContext.user?.account?.bio?.trim?.()) ||
            areNotEqual(PersonalInfo?.gender?.trim?.(), authContext.user?.account?.gender?.trim?.())
        )
        return () => { }
    }, [PersonalInfo])

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
                    onChangeText={(text) => handleOnFormInput('fullName', text)}
                    value={PersonalInfo?.fullName}
                    label={'Full Name'}
                    contentStyle={{ minWidth: '100%' }}
                    textColor={themeColors.text}
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />

                <SpanText
                    style={[styles.textMessage, { color: $userAccount?.data?.data?.exists ? themeColors?.error : themeColors?.success, }]}
                    children={null}
                />

                <TextInput
                    underlineStyle={{ display: 'none' }}
                    onChangeText={(text) => handleOnFormInput('username', text)}
                    value={PersonalInfo?.username}
                    placeholder={authContext?.user?.account?.username}
                    label={`Username`}
                    contentStyle={{ minWidth: '100%' }}
                    textColor={themeColors.text}
                    error={$userAccount?.data?.data?.exists && shouldCheckUsernameAvialability}
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />

                <SpanText style={[styles.textMessage, { color: $userAccount?.data?.data?.exists ? themeColors?.error : themeColors?.success, }]}
                    children={!areNotEqual(PersonalInfo?.username?.trim?.(), authContext?.user?.account?.username?.trim?.()) ? '' : ($userAccount?.data?.data?.exists ? 'username already taken' : 'nice, username is available')}
                />

                <TextInput
                    underlineStyle={{ display: 'none' }}
                    onChangeText={(text) => handleOnFormInput('bio', text)}
                    value={PersonalInfo?.bio}
                    placeholder={authContext?.user?.account?.bio}
                    label={`Bio`}
                    multiline
                    contentStyle={{ minWidth: '100%', paddingBottom: 10 }}
                    textColor={themeColors.text}
                    maxLength={80}
                    style={[styles.textinput, { backgroundColor: themeColors.background2 }]}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                    <RadioButton.Item
                        labelStyle={{ color: themeColors?.text }}
                        color={themeColors.text}
                        style={[styles.radioButton, { backgroundColor: themeColors.background2 }]}
                        status={PersonalInfo?.gender === 'MALE' ? 'checked' : 'unchecked'}
                        label="MALE" value="MALE" onPress={() => handleOnFormInput('gender', 'MALE')} />
                    <RadioButton.Item
                        labelStyle={{ color: themeColors?.text }}
                        color={themeColors.text}
                        style={[styles.radioButton, { backgroundColor: themeColors.background2 }]}
                        status={PersonalInfo?.gender === 'FEMALE' ? 'checked' : 'unchecked'}
                        label="FEMALE" value="FEMALE" onPress={() => handleOnFormInput('gender', 'FEMALE')} />
                    <RadioButton.Item
                        labelStyle={{ color: themeColors?.text }}
                        color={themeColors.text}
                        style={[styles.radioButton, { backgroundColor: themeColors.background2 }]}
                        status={PersonalInfo?.gender === "UNKNOWN" || PersonalInfo?.gender === null ? 'checked' : 'unchecked'}
                        label="NONE" value="UNKNOWN" onPress={() => handleOnFormInput('gender', 'UNKNOWN')} />
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={handleUpdateAccount}
                disabled={!canUpdate || authContext?.isBusy}
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