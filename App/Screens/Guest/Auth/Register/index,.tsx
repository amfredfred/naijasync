import { Ionicons } from "@expo/vector-icons";
import { ContainerBlock, ContainerSpaceBetween } from "../../../../Components/Containers";
import { HeadLine, SpanText } from "../../../../Components/Texts";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { View, TextInput, StyleSheet } from 'react-native'
import { useAuthContext } from "../../../../Contexts/AuthContext";
import { useToast } from "../../../../Contexts/ToastContext";
import { useDataContext } from "../../../../Contexts/SysContext";
import { Button } from "../../../../Components/Buttons";
import { truncate } from "../../../../Helpers";

export default function RegisterScreen() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const dataContext = useDataContext()
    const toastContext = useToast()

    return (
        <ContainerBlock>
            <ContainerSpaceBetween style={{ padding: 0, marginBottom: 10 }}>
                <Ionicons name="arrow-back" size={35} color={themeColors.text} />
            </ContainerSpaceBetween>
            <HeadLine children={'Finish Creating Your Account'} />
            <SpanText children={`email -> ${truncate(dataContext?.states?.authing?.email)}`} style={{ marginVertical: 15, opacity: .6, fontSize: 14 }} />
            <View style={[styles.textinputContainer, { backgroundColor: themeColors.background2, marginTop: 0 }]}>
                <TextInput
                    onChangeText={(text) => dataContext?.setData('authing', 'fullName', text)}
                    value={dataContext?.states?.authing?.fullName}
                    placeholderTextColor={themeColors.text}
                    placeholder="What is your name?"
                    keyboardType='numbers-and-punctuation'
                    style={{ color: themeColors.text, flex: 1 }}
                />
            </View>
            <SpanText children={'Mix characters, length; avoid common words, personalize, stay unique'} style={{ marginVertical: 15, opacity: .6, fontSize: 14 }} />
            <View style={[styles.textinputContainer, { backgroundColor: themeColors.background2 }]}>
                <TextInput
                    onChangeText={(text) => dataContext?.setData('authing', 'password', text)}
                    value={dataContext?.states?.authing?.password}
                    placeholderTextColor={themeColors.text}
                    placeholder="Choose Password"
                    keyboardType='numbers-and-punctuation'
                    style={{ color: themeColors.text, flex: 1 }}
                />
            </View>
            <View style={[styles.textinputContainer, { backgroundColor: themeColors.background2, marginTop: 20 }]}>
                <TextInput
                    onChangeText={(text) => dataContext?.setData('authing', 'confirmPassword', text)}
                    value={dataContext?.states?.authing?.confirmPassword}
                    placeholderTextColor={themeColors.text}
                    placeholder="Password Confirmation"
                    keyboardType='email-address'
                    style={{ color: themeColors.text, flex: 1 }}
                />
            </View>

            <Button
                onPress={() => authContext?.register(dataContext?.states?.authing)}
                textStyle={{ textTransform: 'capitalize' }}
                style={{ alignItems: 'center' }}
                containerStyle={[styles.roundButton, { backgroundColor: themeColors.background2, marginTop: 30 }]}
                title={"Create Account"} />
        </ContainerBlock>
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