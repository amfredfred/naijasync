import { SpanText } from "../../../../Components/Texts";
import { formatNumber } from "../../../../Helpers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { IPostItem } from "../../../../Interfaces";
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'

export default function PostComments(post: IPostItem) {

    const themeColors = useThemeColors()

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: themeColors.background2 }]}>
            <SpanText
                children={`${formatNumber(0)} ~ Coming soon`}
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
    }
})