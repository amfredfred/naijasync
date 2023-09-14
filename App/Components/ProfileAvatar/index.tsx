import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IAuthContextData } from "../../Interfaces/iAuthContext";
import { REQUESTS_API } from "@env";
import { SpanText } from "../Texts";
import useThemeColors from "../../Hooks/useThemeColors";

type IProfileAvatar = IAuthContextData['user']['account'] & {
    avatarOnly?: boolean
}

export default function ProfileAvatar(profile: IProfileAvatar) {

    const themeColors = useThemeColors()

    return (
        <View style={[styles.spaceBetween, styles.avatarContainer, { backgroundColor: themeColors.background2 }]}>
            <TouchableOpacity style={[styles.spaceBetween, { borderRadius: 50 }]}>
                <Image
                    source={{ uri: `${profile?.profilePics?.[0] as any}` }} //${REQUESTS_API}$ ?.uri
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={{ borderRadius: 50, width: 25, aspectRatio: 1 }}
                />
                {!profile?.avatarOnly && <SpanText children={`@${profile?.username}`} style={{ paddingRight: 10, textTransform: 'capitalize' }} />}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        borderRadius: 50,
        backgroundColor: 'green',
        maxHeight: 50
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 2,
        gap: 10
    },
})