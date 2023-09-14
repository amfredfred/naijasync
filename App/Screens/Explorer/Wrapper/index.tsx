import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { HeadLine, SpanText } from "../../../Components/Texts";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import { IPostItem } from "../../../Interfaces";
import { REQUESTS_API } from "@env";
import LikeButton from "../../_partials/PostComponents/Like";
import ShareContent from "../../../Components/ShareFile";
import { formatNumber } from "../../../Helpers";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostExplorerFooting from "./Footing";
dayjs.extend(relativeTime)

export default function ExplorerPostItemWrapper({ post, children }: { post: IPostItem, children: React.ReactNode }) {

    const themeColors = useThemeColors()

    return (
        <View style={[styles.blockContainer, { backgroundColor: themeColors.background2 }]}>
            <View>
                <View style={[styles.spaceBetween, { padding: 5 }]}>
                    <Image
                        resizeMethod="resize"
                        resizeMode="contain"
                        style={{ width: 40, aspectRatio: 1, borderRadius: 50, }}
                        source={{ uri: `${REQUESTS_API}${post.thumbnailUrl}` }}
                    />
                    <View style={[styles.spaceBetween, { flexGrow: 1, height: 40, padding: 0 }]}>
                        <View style={[{ flexGrow: 1, padding: 0 }]}>
                            <TouchableOpacity>
                                <HeadLine children={post?.owner?.fullName} />
                            </TouchableOpacity>
                            <View style={[styles.spaceBetween, { padding: 0, justifyContent: 'flex-start', gap: 3 }]}>
                                <TouchableOpacity>
                                    <SpanText style={{ fontSize: 12, opacity: .6 }}>@{post?.owner?.username}</SpanText>
                                </TouchableOpacity>
                                <SpanText>•</SpanText>
                                <TouchableOpacity>
                                    <SpanText style={{ fontSize: 12, fontWeight: '800', opacity: .4 }} children={dayjs(post?.createdAt).fromNow()} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={null}
                            children={<MaterialIcons
                                size={23}
                                name='more-horiz'
                                color={themeColors.text}
                            />}
                        />
                    </View>
                </View>
            </View>
            <View >
                <SpanText hidden={!post?.title} >{post.title}</SpanText>
                <SpanText hidden={!post?.description} style={{ fontSize: 16, padding: 5 }}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    selectable textBreakStrategy="highQuality">
                    {post?.description}
                </SpanText>
            </View>
            {children}
            <PostExplorerFooting {...post} />
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