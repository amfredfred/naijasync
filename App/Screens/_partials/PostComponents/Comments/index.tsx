import { Ionicons } from "@expo/vector-icons";
import { SpanText } from "../../../../Components/Texts";
import { formatNumber } from "../../../../Helpers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { IPostItem } from "../../../../Interfaces";
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'

export default function PostComments(post: IPostItem) {

    const themeColors = useThemeColors()

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: themeColors.background2 }]}>
            <Ionicons name='chatbubbles-outline' size={16} color={themeColors.text} />
            <SpanText
                children={`${formatNumber(0)} Coming soon`}
                style={{ flex: 1, fontSize: 11, }} />
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    container: {
        width: 130,
        height: 25,
        borderRadius: 50,
        overflow: 'hidden',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap:6
    }
})