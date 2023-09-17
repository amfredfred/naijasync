import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { IPostItem } from '../../../Interfaces'
import useThemeColors from '../../../Hooks/useThemeColors'
import { HeadLine, SpanText, TextExpandable } from '../../../Components/Texts'
import { REQUESTS_API } from '@env'
import { getMediaType } from '../../../Helpers'
import { Ionicons, MaterialIcons, } from '@expo/vector-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ShareContent from '../../../Components/ShareFile'
import { IconButton } from '../../../Components/Buttons'
import { ScrollView, } from 'react-native-gesture-handler'
import LikeButton from '../PostComponents/Like'
import { useState } from 'react'
import { useAuthContext } from '../../../Contexts/AuthContext'
import ProfileAvatar from '../../../Components/ProfileAvatar'
import { useNavigation } from '@react-navigation/native'
import PostVideoItemList from '../PostType/_components/Video'
import PostAudioItemList from '../PostType/_components/Audio'
import PostImageItemList from '../PostType/_components/Image'
import PostItemMenu from '../PostMenu'
import PostComments from '../PostComponents/Comments'
import PostAnalytics from '../PostComponents/Analytics/inedx'
dayjs.extend(relativeTime)

const StatusPostListItem = (post: IPostItem) => {
    const themeStyles = useThemeColors()

    return (
        <View style={[styles.postWrapper, { backgroundColor: themeStyles.background2 }]}>
            <SpanText>STATUS {post.puid}</SpanText>
        </View>
    )
}

const UploadPostListItem = (post: IPostItem) => {
    const [isMenuModalVisile, setisMenuModalVisile] = useState(false)
    const { navigate } = useNavigation()
    const themeColors = useThemeColors()

    // 
    const fileType = getMediaType(post?.fileUrl)
    let PostComponent = null;
    if (fileType === 'video')
        PostComponent = <PostVideoItemList {...post} />
    else if (fileType === 'image')
        PostComponent = <PostImageItemList {...post} />
    else if (fileType === 'audio')
        PostComponent = <PostAudioItemList {...post} />


    const UploadPostListItemContentRow = (
        <View
            style={[styles.postContentWrapper]}>
            <View style={{ marginBottom: 0, }}>
                <View style={[styles.spaceBetween, { width: '100%', padding: 0 }]}>
                    <TouchableOpacity>
                        <HeadLine children={post?.owner?.fullName} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setisMenuModalVisile(true)}
                        children={<MaterialIcons
                            size={23}
                            name='more-horiz'
                            color={themeColors.text}
                        />}
                    />
                </View>
                <View style={[styles.spaceBetween, { padding: 0, justifyContent: 'flex-start', gap: 3, top: -4 }]}>
                    <TouchableOpacity>
                        <SpanText style={{ fontSize: 12, opacity: .6 }}>@{post?.owner?.username}</SpanText>
                    </TouchableOpacity>
                    <SpanText>•</SpanText>
                    <TouchableOpacity>
                        <SpanText style={{ fontSize: 12, fontWeight: '800', opacity: .4 }} children={dayjs(post?.createdAt).fromNow()} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginBottom: 6 }}>
                <SpanText hidden={!post?.title} >{post.title}</SpanText>
                <TextExpandable hidden={!post?.description} style={{ fontSize: 14 }} children={post?.description} />
                {
                    post?.tags && (
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 6, gap: 10 }} style={{ paddingVertical: 6 }} horizontal>
                            {
                                post?.tags?.map(tag => (
                                    <IconButton
                                        textStyle={{ color: themeColors.primary }}
                                        containerStyle={{ padding: 0, backgroundColor: 'transparent', paddingHorizontal: 0, minHeight: 2 }}
                                        title={`#${tag}`} />
                                ))
                            }
                        </ScrollView>
                    )
                }
            </View>
            {PostComponent}
            <View style={[styles.spaceBetween, styles.containerProgress, { padding: 0 }]}>
                <View style={[styles.spaceBetween, { flexGrow: 1 }]}>

                    <LikeButton post={post} onLikeToggle={() => { }} />
                    <PostAnalytics {...post} />
                    <PostComments {...post} />

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
            </View>
        </View>
    )

    return (
        <TouchableOpacity
            activeOpacity={.9}
            onPress={() => (navigate as any)?.("ViewPost", { post })} style={{ paddingTop: 10, flexGrow: 1, flex: 1, backgroundColor: themeColors?.background}}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <ProfileAvatar  {...post?.owner} avatarOnly />
                </View>
                {UploadPostListItemContentRow}
            </View>

            {/* POSTS VIEWING */}

            {/* POSTS MENU */}
            <PostItemMenu {...post} visible={isMenuModalVisile} onRequestClose={() => setisMenuModalVisile(false)} />
        </TouchableOpacity>
    )
}

export default function PostItem(post: IPostItem) {
    const RenderPost = () => {
        switch (post.postType) {
            case 'STATUS':
                return <StatusPostListItem {...post} />;
            case "UPLOAD":
                return <UploadPostListItem {...post} />;
            default:
                return null; // Handle other post types as needed
        }
    };

    return RenderPost()
}

const styles = StyleSheet.create({
    postWrapper: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
        flexGrow: 1,
    },
    postContentWrapper: {
        minHeight: 'auto',
        paddingRight: 10,
        flex: 1,
        flexGrow:1
    },
    playPauseiconContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        bottom: 0,
        padding: 10,
        position: 'absolute',
        zIndex: 50
    },
    allIconStyle: {
        borderRadius: 50,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
    mediaDisplayWrapper: {
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 10,
        aspectRatio: 1,
    },
    containerProgress: {
        paddingVertical: 5
        // paddingHorizontal: 10
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    playButton: {
        borderRadius: 50,
        overflow: 'hidden'
    },
    infoContainer: {
        flex: 1,
    }
    // singlePostmenu: {
    //     width,
    //     backgroundColor: 'red',
    //     height: 200,
    //     position: 'absolute',
    //     bottom:0
    // }
})