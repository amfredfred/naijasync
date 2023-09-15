import { AntDesign } from "@expo/vector-icons";
import { SpanText } from "../../../../Components/Texts";
import { formatNumber } from "../../../../Helpers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { IPostItem } from "../../../../Interfaces";
import { StyleSheet, TouchableOpacity } from 'react-native'

export default function PostAnalytics(post: IPostItem) {

    const themeColors = useThemeColors()

    return (
        <TouchableOpacity style={[styles.container, { gap: 3,    }]}>
            <AntDesign size={13} color={themeColors.text} name='barchart' />
            <SpanText style={{ fontSize: 15}}>{formatNumber(post?.views as number)}</SpanText>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})