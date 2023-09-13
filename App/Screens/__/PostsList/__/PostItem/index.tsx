import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Modal } from 'react-native'
import { IPostItem } from '../../../../../Interfaces'
import useThemeColors from '../../../../../Hooks/useThemeColors'
import { HeadLine, SpanText } from '../../../../../Components/Texts'
import { REQUESTS_API } from '@env'
import { formatNumber, getMediaType } from '../../../../../Helpers'
import { AntDesign, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ShareContent from '../../../../../Components/ShareFile'
import { Button, IconButton } from '../../../../../Components/Buttons'
import { ScrollView, } from 'react-native-gesture-handler'
import { useMediaPlaybackContext } from '../../../../Statics/MediaViewer/Context'
import LikeButton from './Like'
import ThemedModal from '../../../../../Components/Modals'
import { useState } from 'react'
import MenuItem from '../../../../../Components/MenuItem'
import { useAuthContext } from '../../../../../Contexts/AuthContext'
import { ContainerSpaceBetween } from '../../../../../Components/Containers'
import ProfileAvatar from '../../../../../Components/ProfileAvatar'
import PostViewer from '../../../../Viewer/Post'
dayjs.extend(relativeTime)

const StatusPostListItem = (post: IPostItem) => {
    const themeStyles = useThemeColors()

    return (
        <View style={[styles.postWrapper, { backgroundColor: themeStyles.background2 }]}>
            <SpanText>STATUS {post.puid}</SpanText>
        </View>
    )
}

const VideoDisplay = (prop: IPostItem) => {
    const mediaContext = useMediaPlaybackContext()
    return (
        <View style={[styles.mediaDisplayWrapper, {}]}>
            <View style={{ position: 'relative', height: '100%', width: '100%' }}>
                <Image
                    style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                    source={{ uri: `${REQUESTS_API}${prop?.thumbnailUrl}` }}
                    resizeMethod='resize'
                    resizeMode='repeat'
                />
            </View>
            <View style={[styles.spaceBetween, styles.playPauseiconContainer]}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => mediaContext?.setMedia(prop)}
                    style={[styles.allIconStyle]}>
                    <Ionicons
                        name='play-circle'
                        color={'aliceblue'}
                        size={40}
                        style={[{}]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const AudioDisplay = (prop: IPostItem) => {
    const mP = useMediaPlaybackContext()

    const togglePlayback = () => {
        // setIsPlaying(!isPlaying);
        if (mP?.fileUrl === prop?.fileUrl) {
            if (mP?.states?.playState === 'playing') {
                mP?.pause()
            } else {
                mP?.play()
            }
        } else
            mP.setMedia(prop)
    };

    return (
        <View style={styles.container}>
            <View
                style={[styles.spaceBetween, { padding: 0, flex: 1 }]} >
                <View style={[styles.spaceBetween, { padding: 0, flex: 1 }]}>
                    <Image
                        style={{ width: 140, aspectRatio: '16/9', borderRadius: 10 }}
                        source={{ uri: prop?.thumbnailUrl }} />
                    <SpanText >{mP?.fileUrl === prop?.fileUrl ? Number(mP?.states?.progress > 0 ? mP?.states?.progress : 0) : 0}% / {prop?.duration}</SpanText>
                </View>
                <TouchableOpacity style={[styles.playButton]} onPress={togglePlayback}>
                    <ImageBackground
                        blurRadius={100}
                        style={{ width: 80, aspectRatio: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        source={{ uri: prop?.thumbnailUrl }}>
                        <Ionicons name={mP?.fileUrl === prop?.fileUrl ? (mP.states?.playState === 'playing' ? 'pause-circle' : 'play-circle') : 'play-circle'} size={50} color="white" />
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const ImageDisplay = (prop: { uri: string }) => {
    return (
        <View style={[styles.mediaDisplayWrapper, {}]}>
            <Image
                source={{ uri: prop.uri }}
                resizeMethod='auto'
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
            />
        </View>
    )
}

const UploadPostListItem = (post: IPostItem) => {
    const themeColors = useThemeColors()
    const [isMenuModalVisile, setisMenuModalVisile] = useState(false)
    const [isVeiwingPost, setisVeiwingPost] = useState(false)
    const [postOnView, setPostOnView] = useState<IPostItem>()
    const authContext = useAuthContext()

    const DisplayMediaType = () => {
        const fileType = getMediaType(post?.fileUrl)
        switch (fileType) {
            case 'video':
                return <VideoDisplay {...post} />
            case 'image':
                return <ImageDisplay uri={`${REQUESTS_API}${post.fileUrl}`} />
            case 'audio':
                return <AudioDisplay {...post} />
            default:
                break;
        }
    }

    const postPrivateMenuItem = [
        {
            title: `Edits`,
            onPress: () => null,
            icon: <AntDesign size={30} name='edit' color={themeColors?.text} />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Delete`,
            onPress: () => null,
            icon: <AntDesign size={30} name='delete' color={themeColors?.error} />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Share`,
            onPress: () => { },
            icon: <AntDesign size={30} name='sharealt' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];

    const postPublicMenuItem = [
        {
            title: `Copy Link`,
            hideIconRight: true,
            onPress: () => null,
            icon: <Ionicons size={30} name='copy' color={themeColors?.text} />,
            description: ''
        },
        {
            title: `Report post`,
            onPress: () => { },
            icon: <Octicons size={30} name='report' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];

    const postWhenNotownerMenuItem = [
        {
            title: `Gifting (Comign soon)`,
            hideIconRight: true,
            onPress: () => null,
            icon: <Ionicons size={30} name='gift' color={themeColors?.text} />,
            description: `Points empower better content sharing!!`
        },
        {
            title: `Share`,
            hideIconRight: true,
            onPress: () => { },
            icon: <AntDesign size={30} name='sharealt' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];


    const UploadPostListItemContentRow = (
        <View style={[styles.postContentWrapper]}>
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
                <SpanText hidden={!post?.description} style={{ fontSize: 16 }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    selectable textBreakStrategy="highQuality">
                    {post?.description}
                </SpanText>
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
            <TouchableOpacity
                onPress={() => setisVeiwingPost(true)}
                style={{ overflow: 'hidden' }}>
                {DisplayMediaType()}

            </TouchableOpacity>
            <View style={[styles.spaceBetween, styles.containerProgress, { padding: 0 }]}>
                <View style={[styles.spaceBetween, { flexGrow: 1 }]}>

                    <LikeButton post={post} onLikeToggle={() => { }} />

                    <TouchableOpacity style={[styles.spaceBetween, { padding: 0, gap: 3 }]}>
                        <AntDesign size={15} color={themeColors.text} name='barchart' />
                        <SpanText style={{ fontSize: 18 }}>{formatNumber(post?.views as number)}</SpanText>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.spaceBetween, { width: 100, borderRadius: 50, overflow: 'hidden' }]}>
                        <SpanText
                            children={`${formatNumber(1021)} Comment`}
                            style={{
                                height: 20,
                                paddingHorizontal: 10, width: '100%', fontSize: 11, backgroundColor: themeColors.background2, borderRadius: 50
                            }} />
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
            </View>


        </View>
    )

    return (
        <View style={{ paddingTop: 10, flexGrow: 1, flex: 1, backgroundColor: themeColors?.background, marginBottom: 6 }}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <ProfileAvatar  {...post?.owner} avatarOnly />
                </View>
                {UploadPostListItemContentRow}
            </View>

            {/* POSTS VIEWING */}
            {isVeiwingPost && (<PostViewer onClose={() => setisVeiwingPost(false)}   {...post} />)}

            {/* POSTS MENU */}
            <ThemedModal
                onRequestClose={() => setisMenuModalVisile(false)}
                visible={isMenuModalVisile}>
                <View style={[styles.spaceBetween,]}>
                    <View />
                    <ProfileAvatar {...post?.owner} />
                </View>
                <View
                    children={postPublicMenuItem.map((item, index) => <MenuItem {...item} />)}
                    style={{ padding: 5, backgroundColor: themeColors.background2, margin: 10, borderRadius: 10 }} />
                {post?.owner?.userId !== authContext?.user?.account?.userId && <View
                    children={postWhenNotownerMenuItem.map((item, index) => <MenuItem {...item} />)}
                    style={{ padding: 5, backgroundColor: themeColors.background2, margin: 10, borderRadius: 10 }} />}
                {
                    post?.owner?.userId === authContext?.user?.account?.userId && <ContainerSpaceBetween
                        children={postPrivateMenuItem.map((item, index) => (<IconButton key={index} onPress={() => null} containerStyle={{ padding: 10 }} icon={item.icon} />))}
                        style={{ margin: 10, borderRadius: 10 }}
                    />
                }
            </ThemedModal>
        </View>
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
        flex: 1,
        minHeight: 'auto',
        paddingRight: 10,
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