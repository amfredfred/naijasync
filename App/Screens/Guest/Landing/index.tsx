import { HeadLine, SpanText } from "../../../Components/Texts";
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native'

import useThemeColors from "../../../Hooks/useThemeColors";
import { APP_NAME } from "@env";
import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";
import { Button, IconButton } from "../../../Components/Buttons";
import { useAuthContext } from "../../../Contexts/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import { useDataContext } from "../../../Contexts/DataContext";
import { isValidEmail } from "../../../Helpers";
import { useToast } from "../../../Contexts/ToastContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window')

export default function Landing() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const dataContext = useDataContext()
    const toastContext = useToast()

    const { navigate } = useNavigation()

    const handleFoward = (goTo: string) => {
        if (!dataContext?.states?.authing?.email.length) {
            return toastContext.toast({
                message: "The email address filed is required 😢",
                severnity: 'error',
                timeout: 5000
            })
        }
        if (!isValidEmail(dataContext?.states?.authing?.email)) {
            return toastContext.toast({
                message: "You've entered an invalid email address 😢",
                severnity: 'warning',
                timeout: 5000
            })
        }
        (navigate as any)?.(goTo)
    }

    return (
        <ScrollView
            contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
            style={{ height, width }} >
            <View
                style={{ width, padding: 20, alignSelf: 'center' }} >
                <HeadLine
                    style={{ fontSize: 31, fontWeight: '400', marginBottom: 20 }}
                    children={`${APP_NAME} – Your Ultimate Entertainment Destination!`} />
                <SpanText

                    style={{ fontSize: 12, opacity: .6 }}>
                    {`We're thrilled to have you on board. Get ready to embark on a journey filled with exciting entertainment, captivating content, and endless fun. Discover, explore, and personalize your entertainment experience like never before.
                     \nLet's dive in and unleash the world of entertainment at your fingertips!`}
                </SpanText>

                <ContainerBlock style={{ padding: 0 }}>
                    <View style={[styles.textinputContainer, { backgroundColor: themeColors.background2, marginTop: 20 }]}>
                        <TextInput
                            onChangeText={(text) => dataContext?.setData('authing', 'email', text)}
                            value={dataContext?.states?.authing?.email}
                            placeholderTextColor={themeColors.text}
                            placeholder="Plase Enter Your Email"
                            keyboardType='email-address'
                            style={{ color: isValidEmail(dataContext?.states?.authing?.email) ? themeColors.success : themeColors.text, flex: 1 }}
                        />
                    </View>
                    <ContainerSpaceBetween style={{ padding: 0, marginTop: 20, gap: 20 }}>
                        <Button
                            onPress={() => handleFoward('RegisterScreen')}
                            textStyle={{ textTransform: 'capitalize' }}
                            style={{ alignItems: 'center' }}
                            containerStyle={[styles.roundButton, { backgroundColor: themeColors.accent }]}
                            variant='contained'
                            title={"Sign up"} />
                        <Button
                            onPress={() => handleFoward('LoginScreen')}
                            textStyle={{ textTransform: 'capitalize' }}
                            style={{ alignItems: 'center' }}
                            containerStyle={[styles.roundButton, { backgroundColor: themeColors.background2 }]}
                            variant='contained'
                            title={"Sign In"} />
                    </ContainerSpaceBetween>
                    <Button
                        onPress={() => authContext?.skipAuth?.()}
                        textStyle={{ textTransform: 'capitalize' }}
                        style={{ alignItems: 'center' }}
                        containerStyle={[styles.roundButton, { backgroundColor: themeColors.background2, marginTop: 20 }]}
                        variant='contained'
                        title={"Skip Authentication"} />
                </ContainerBlock>
            </View>
        </ScrollView>
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
        height: 40, width: '100%',
        paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row'
    }
})