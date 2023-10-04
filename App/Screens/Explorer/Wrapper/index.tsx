import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { HeadLine, SpanText, TextExpandable } from "../../../Components/Texts";
import {  MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import { IPostItem } from "../../../Interfaces"; 
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostExplorerFooting from "./Footing";
import PostItemMenu from "../../_partials/PostMenu";
import { useState } from "react";
import useEndpoints from "../../../Hooks/useEndpoints";
dayjs.extend(relativeTime)

export default function ExplorerPostItemWrapper({ post, children }: { post: IPostItem, children: React.ReactNode }) {
    const [isMenuModalVisile, setisMenuModalVisile] = useState(false)
    const themeColors = useThemeColors()
    const { requestUrl } = useEndpoints()


    return (
        <View style={[styles.blockContainer, { backgroundColor: themeColors.background2 }]}>
            <View>
                <View style={[styles.spaceBetween, { padding: 5 }]}>
                    <Image
                        resizeMethod="resize"
                        resizeMode="contain"
                        style={{ width: 40, aspectRatio: 1, borderRadius: 50, }}
                        source={{ uri: requestUrl(post.thumbnailUrl)  }}
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
                            onPressIn={() => setisMenuModalVisile(true)}
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
                <TextExpandable  style={{   padding: 5 }}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    selectable textBreakStrategy="highQuality">
                    {post?.description}
                </TextExpandable>
            </View>
            {children}
            <PostExplorerFooting {...post} />
            <PostItemMenu {...post} visible={isMenuModalVisile} onRequestClose={() => setisMenuModalVisile(false)} />
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