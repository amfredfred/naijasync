import { View, StatusBar } from "react-native";
import { HeadLine, SpanText } from "../../../Components/Texts";
import { IconButton } from "../../../Components/Buttons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useThemeColors from "../../../Hooks/useThemeColors";
import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export default function AccountHeading() {

    const { navigate, goBack } = useNavigation()
    const route = useRoute()
    const themeColors = useThemeColors()

    const handleGoBack = () => {
        // (navigate as any)?.("Home")
        goBack()
    }

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{ padding: 0, height: 45, backgroundColor: themeColors.background, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
            <IconButton
                icon={<Ionicons onPress={handleGoBack} name="arrow-back" size={35} />}
                containerStyle={{ backgroundColor: 'transparent', gap: 10 }}
                textStyle={{ fontSize: 20 }}
            />
            <View style={{ flexGrow: 1, alignItems: 'center' }}>
                <SpanText style={{ textTransform: 'uppercase' }}>
                    {route?.name}
                </SpanText>
            </View>
            <IconButton
                icon={<Octicons onPress={null} name='dot' size={35} />}
                containerStyle={{ backgroundColor: 'transparent', gap: 10 }}
                textStyle={{ fontSize: 20 }}
            />
        </Animated.View>
    )
}