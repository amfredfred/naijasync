import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SpanText } from "../../../../Components/Texts";
import { formatNumber } from "../../../../Helpers";
import LikeButton from "../../../_partials/PostComponents/Like";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ShareContent from "../../../../Components/ShareFile";
import { REQUESTS_API } from "@env";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { IPostItem } from "../../../../Interfaces";

export default function PostExplorerFooting(post: IPostItem) {

    const themeColors = useThemeColors()

    return (
        <View style={[styles.spaceBetween, { flexGrow: 1, padding: 10 }]}>

            <TouchableOpacity style={[styles.spaceBetween, { width: 150, borderRadius: 50, overflow: 'hidden' }]}>
                <SpanText
                    children={`${formatNumber(0)} Comming soon`}
                    style={{
                        height: 25,
                        paddingHorizontal: 10, width: '100%', fontSize: 11, backgroundColor: themeColors.background, borderRadius: 50
                    }} />
            </TouchableOpacity>

            <LikeButton post={post} onLikeToggle={() => { }} />
            <TouchableOpacity style={[styles.spaceBetween, { padding: 0, gap: 3 }]}>
                <AntDesign size={15} color={themeColors.text} name='barchart' />
                <SpanText style={{ fontSize: 18 }}>{formatNumber(post?.views as number)}</SpanText>
            </TouchableOpacity>



            <TouchableOpacity
                style={{ opacity: .4 }}
                onPress={() => ShareContent({
                    message: `${REQUESTS_API}posts/${post?.puid}`,
                    url: `${REQUESTS_API}posts/${post?.puid}`,
                    title: `Sharing `
                })}
                children={<Ionicons
                    size={23}
                    name='share-social'
                    color={themeColors.text}
                />}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        gap: 10
    }, blockContainer: {
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 5
    },
})