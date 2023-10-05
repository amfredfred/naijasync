import { Ionicons } from "@expo/vector-icons";
import { SpanText } from "../../../../Components/Texts";
import { formatNumber } from "../../../../Helpers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { IPostItem } from "../../../../Interfaces";
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'

export default function PostShare(post: IPostItem) {

    const themeColors = useThemeColors()

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: themeColors.background2 }]}>
            <Ionicons
                name='share-social'
                size={17}
                color={themeColors.text}
            />
            <SpanText
                children={`${formatNumber(31245)} `}
                style={{ flexGrow: 1, fontSize: 11, }} />
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    container: {
        height: 25,
        borderRadius: 50,
        overflow: 'hidden',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6
    }
})