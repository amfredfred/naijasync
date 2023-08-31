import { HeadLine, SpanText } from "../../../Components/Texts";
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native'

import useThemeColors from "../../../Hooks/useThemeColors";
import { APP_NAME } from "@env";
import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";
import { Button, IconButton } from "../../../Components/Buttons";
import { useAuthContext } from "../../../Contexts/AuthContext";

const { width, height } = Dimensions.get('window')

export default function Landing() {

    const themeColors = useThemeColors()

    const authContext = useAuthContext()

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

                <ContainerBlock style={{ padding: 0, marginTop: 20, }}>
                    <ContainerSpaceBetween style={{ padding: 0, marginTop: 20, gap: 20 }}>
                        <Button
                            textStyle={{ textTransform: 'capitalize' }}
                            style={{ alignItems: 'center' }}
                            containerStyle={[styles.roundButton, { backgroundColor: themeColors.accent }]}
                            variant='contained'
                            title={"Sign up"} />
                        <Button
                            textStyle={{ textTransform: 'capitalize' }}
                            style={{ alignItems: 'center' }}
                            containerStyle={[styles.roundButton, { backgroundColor: themeColors.background2 }]}
                            variant='contained'
                            title={"Sign In"} />
                    </ContainerSpaceBetween>
                    <Button
                        onPress={() => authContext?.skipAuth?.()}
                        textStyle={{textTransform:'capitalize'}}
                        style={{ alignItems: 'center' }}
                        containerStyle={[styles.roundButton, { backgroundColor: themeColors.background2, marginTop:20 }]}
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
    }
})