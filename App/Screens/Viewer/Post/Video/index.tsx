import { Overlay } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Video, ResizeMode } from "expo-av";
import { useState, useEffect, useMemo, useRef } from 'react'
import { FancyButton, IconButton } from "../../../../Components/Buttons";
import { View, StyleSheet, Dimensions, StatusBar, Text, RefreshControl, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, BackHandler } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, SlideInDown, SlideOutDown, FadeInDown, withSpring, withDecay, FadeIn, FadeOut } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getRandomBoolean, wait } from "../../../../Helpers";
import { useRoute } from "@react-navigation/native";
import { HeadLine, SpanText, TextExpandable } from "../../../../Components/Texts";
import usePostForm from "../../../../Hooks/usePostForms";
import MediaProgressBar from "../../../_partials/MediaProgressBar";
import { LinearGradient } from "expo-linear-gradient";
import PostItemMenu from "../../../_partials/PostMenu";
import { useQuery } from "@tanstack/react-query";
import { IPostItem } from "../../../../Interfaces";
import axios from "axios";
import { useAuthContext } from "../../../../Contexts/AuthContext";
import MediaPlayDuration from "../../../_partials/MediaPlayDuration";
import { TestIds, useInterstitialAd, useRewardedInterstitialAd } from "react-native-google-mobile-ads";
import PlayButton from "../../../_partials/PlayButton";
import { useMediaPlaybackContext } from "../../../../Contexts/MediaPlaybackContext";
import useEndpoints from "../../../../Hooks/useEndpoints";
import LikeButton from "../../../_partials/PostComponents/Like";
import PostAnalytics from "../../../_partials/PostComponents/Analytics/inedx";
const { width, height } = Dimensions.get('window')

const VIDEO_HEIGHT = 230

export default function PlayVideo() {

    const colors = useThemeColors()
    const [isShwoingControls, setisShwoingControls] = useState(true)
    const [isMenuModalVisile, setisMenuModalVisile] = useState(false)
    const [playerMode, setPlayerMode] = useState<"fullscreen" | "default">('default')
    const { requestUrl } = useEndpoints()


    const postForm = usePostForm()
    const { params } = useRoute()
    const { post } = params as any

    const authContext = useAuthContext()
    const mediaContext = useMediaPlaybackContext()
    //Aniamtion
    const contConH = useSharedValue(VIDEO_HEIGHT)
    const contConDis = useSharedValue('none')
    const contentContainerStyle = useAnimatedStyle(() => ({
        top: contConH.value,
        display: contConDis.value as any
    }))
    //setting media
    useEffect(() => { mediaContext?.connect({ ...post, presenting: true }) }, [])
    useEffect(() => { wait(5).then(R => postForm.methods.postView(post?.puid)) }, [])
    const contenGetsture = Gesture.Pan()
        .onUpdate(e => {
            contConH.value = Math.max(0, Math.min(e.translationY / 1, height - VIDEO_HEIGHT));
        })
        .onEnd(e => {
            if (e.translationY <= height / 2) {
                contConH.value = withDecay({
                    velocity: 2,
                    deceleration: 0.997,
                    clamp: [0, 0],
                });
                contConDis.value = 'flex'
            } else if (e.translationY >= height / 3) {
                contConH.value = withSpring(100)
                contConDis.value = 'none'
            }
        })

    const handleShowPlayControls = () => {
        console.log("PRESSED")
        if (isShwoingControls) {
            setisShwoingControls(false)
        } else {
            setisShwoingControls(true)
        }
    }

    //fetching more videos
    const [Videos, setVideos] = useState<IPostItem[]>([])
    const $videos = useQuery(
        ['videos'],
        async () => await axios.get<IPostItem[]>(requestUrl(`posts?type=video&username=${authContext?.user?.account?.username}`)),
        { enabled: mediaContext?.states.isReady, getNextPageParam: () => { } }
    )
    const onRefresh = () => $videos?.refetch()
    useEffect(() => {
        console.log("VIDEP LOADED")
        if ($videos?.status === 'success') {
            setVideos(($videos?.data?.data as any)?.data)
        } else if ($videos?.status === 'error') {
            console.log("ERERO ", ($videos?.failureReason as any)?.response?.data)
        }
    }, [$videos.status])

    //initializing ads
    const interstitialAd = useInterstitialAd(TestIds.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        if (interstitialAd?.isClosed) {
            console.log(" navigation.navigate('NextScreen');")
        }
    }, [interstitialAd?.isClosed,]);
    //reloading ads
    useEffect(() => {
        interstitialAd?.load()
        return () => {

        }
    }, [mediaContext?.fileUrl])
    //video rewarded ads
    const rewardedInterstitialAd = useRewardedInterstitialAd(TestIds.REWARDED_INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true
    })

    //handlebackpress
    useEffect(() => {
        if (mediaContext?.states.isReady)
            rewardedInterstitialAd.load()
    }, [mediaContext?.fileUrl, mediaContext?.states.isReady])

    //sharing rewards from ads
    useEffect(() => {
        if (rewardedInterstitialAd?.reward?.amount) {
            postForm?.methods?.postReward(rewardedInterstitialAd?.reward?.amount, mediaContext?.puid)
        }
    }, [rewardedInterstitialAd?.isClosed])

    const handleBackPress = (canShowAd) => {
        if (canShowAd)
            rewardedInterstitialAd?.show()
        return false
    }

    //Effects
    useEffect(() => {
        const BHND = BackHandler.addEventListener('hardwareBackPress', () => handleBackPress(rewardedInterstitialAd?.isLoaded))
        return () => {
            BHND.remove()
        }
    }, [rewardedInterstitialAd?.isLoaded])


    const MediaControls = (
        <Animated.View
            style={[styles.controlsContainer]}  >
            <View />
            <View
                onTouchStart={handleShowPlayControls}
                style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center' }}>
                {mediaContext?.states?.playState == 'ended' && <TouchableOpacity onPress={mediaContext?.play} children={<Ionicons color={'white'} size={40} name={'play'} />} />}
            </View>
            {
                !(isShwoingControls || mediaContext?.states?.playState == 'ended') || (
                    <LinearGradient colors={['transparent', 'transparent', 'transparent', 'rgba(0,0,0,0.4)']} style={{ justifyContent: 'space-between' }}>
                        <Animated.View
                            entering={FadeInDown}
                            exiting={SlideOutDown}  >
                            <View style={[styles.spaceBetween]}>
                                <View style={[styles.spaceBetween]}>
                                    <MediaPlayDuration {...mediaContext} />
                                </View>
                                <View style={[styles.spaceBetween]}>
                                    <TouchableOpacity
                                        onPress={async () => mediaContext?.skipPrevTo(-5)}
                                        children={<MaterialIcons
                                            color={'white'}
                                            size={25} name='replay-5' />}
                                    />
                                    <TouchableOpacity
                                        onPress={async () => mediaContext?.skipNextTo(5)}
                                        children={<MaterialIcons
                                            color={'white'}
                                            size={25} name='forward-5' />}
                                    />
                                    <TouchableOpacity
                                        onPress={async () => await mediaContext?.mediaRef?.current?._setFullscreen(true)}
                                        children={<MaterialIcons
                                            color={'white'}
                                            size={25} name={'fullscreen'} />}
                                    />
                                    <PlayButton {...mediaContext} />
                                </View>
                            </View>
                        </Animated.View>
                    </LinearGradient>
                )}
            <MediaProgressBar {...mediaContext} />
        </Animated.View>
    )

    const MediaDefinition = (
        <View style={[{ width: '100%', }]}>
            <View style={[styles.spaceBetween, {
                padding: 0,
                borderBottomWidth: 1,
                backgroundColor: colors.background,
                borderBottomColor: colors.background2,
                marginBottom: 10,
            }]}>
                <TouchableOpacity
                    onPress={() => {
                        contConDis.value = 'flex'
                        contConH.value = 0
                    }}
                    style={{ minHeight: 40, flexGrow: 1, width: '80%', padding: 10 }}>
                    <SpanText
                        numberOfLines={2}
                        style={[{ color: colors.text, fontSize: 14 }]}>
                        {mediaContext?.title ?? mediaContext?.caption ?? mediaContext?.description ?? mediaContext?.mimeType}
                    </SpanText>
                </TouchableOpacity>
                <MaterialIcons
                    onPress={() => setisMenuModalVisile(true)}
                    size={23}
                    name='more-horiz'
                    color={colors.text}
                />
            </View>

            <GestureDetector gesture={contenGetsture}>
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={[styles.contentDescriptionContainer, contentContainerStyle, { backgroundColor: colors.background2 }]}>
                    <View style={[styles.spaceBetween, { height: 20, justifyContent: 'center' }]}>
                        <View style={[styles.contentDescriptionContainerBar, { backgroundColor: colors.text }]} />
                    </View>
                    <View style={[styles.spaceBetween, { borderBottomColor: 'darkgrey', borderBottomWidth: 1, paddingHorizontal: 10 }]}>
                        <HeadLine children={'ABOUT INFO'} />
                        <IconButton
                            onPress={() => {
                                contConDis.value = 'none'
                            }}
                            style={{ width: 35, backgroundColor: 'transparent' }}
                            icon={<MaterialIcons
                                name={'close'}
                                color={colors.text}
                                size={35}
                            />}
                        />
                    </View>
                    <ScrollView style={[styles.contentDescriptionContainerInner]}>
                        <Text
                            style={[{ color: colors.text, maxWidth: '100%', lineHeight: 27, fontSize: 18 }]}>
                            {mediaContext?.title ?? mediaContext?.caption ?? mediaContext?.description}
                        </Text>
                    </ScrollView>
                </Animated.View>
            </GestureDetector>
        </View>
    )


    const MoreVideos = (
        <FlatList
            stickyHeaderHiddenOnScroll
            stickyHeaderIndices={[0]}
            ListHeaderComponent={MediaDefinition}
            data={[...Videos]}
            // numColumns={4}
            maxToRenderPerBatch={10}
            ListEmptyComponent={() => Array.from({ length: 3 }, (_) => <View style={{ height: 170, borderRadius: 5, backgroundColor: colors.background2 }} />)}
            // columnWrapperStyle={{ gap: 5 }}
            contentContainerStyle={{ gap: 5, padding: 5 }}
            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={$videos?.isRefetching} />}
            renderItem={({ item, index }: { item: IPostItem, index: number }) => (
                <TouchableOpacity
                    style={[styles.spaceBetween, {
                        flexGrow: 1,
                        padding: 0,
                        height: 140,
                        overflow: 'hidden',
                    }]}   >
                    <Image
                        resizeMethod="resize"
                        resizeMode='cover'
                        style={{ width: 100, height: '100%', borderRadius: 5 }}
                        source={{ uri: requestUrl(item?.thumbnailUrl) }}
                    />
                    <View style={{ height: '100%', paddingVertical: 10, flex: 1 }}>
                        <HeadLine children={item.title} />
                        <View style={{ width: '100%', flex: 1 }}>
                            <SpanText style={{fontSize:13, fontWeight:'500'}} numberOfLines={3} children={item.description ?? item?.caption} />
                        </View>
                        <View style={[styles.spaceBetween, { padding: 0 }]}>
                            <View style={[styles.spaceBetween, {padding:0}]}>
                                <LikeButton post={item} onLikeToggle={null} />
                                <PostAnalytics {...item}  />
                            </View>
                            <TouchableOpacity
                                disabled={Boolean(mediaContext?.fileUrl == item.fileUrl)}
                                onPress={() => {
                                    mediaContext?.connect(item)
                                    if (rewardedInterstitialAd?.isLoaded)
                                        if (getRandomBoolean())
                                            rewardedInterstitialAd?.show()
                                }}
                                style={{ backgroundColor: colors.background2, padding: 3, paddingHorizontal: 15, borderRadius: 50 }}>
                                <SpanText style={{ fontSize: 12 }}>
                                    {Boolean(mediaContext?.fileUrl == item.fileUrl) ? 'Watching...' : 'Play'}
                                </SpanText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )}  
        /> 
    )

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, { backgroundColor: colors.background }]}>
            {/* VIDEO CONTAINER */}
            <ImageBackground
                resizeMethod='resize'
                resizeMode='cover'
                blurRadius={170}
                style={{ paddingTop: StatusBar.currentHeight }}
                source={{ uri: requestUrl(mediaContext?.thumbnailUrl) }}>
                <Animated.View style={[styles.videoContainer, { backgroundColor: 'black' }]}>
                    <Video
                        style={[styles.video]}
                        resizeMode={ResizeMode.CONTAIN}
                        ref={mediaContext?.mediaRef} />
                    <Overlay
                        hidden={!Boolean(mediaContext.states?.playState == 'loading')}
                        imageSource={requestUrl(mediaContext?.thumbnailUrl)} />

                    {mediaContext?.states?.playState === 'ended' && (
                        <Animated.Image
                            entering={FadeIn}
                            exiting={FadeOut}
                            source={{ uri: requestUrl(mediaContext?.thumbnailUrl) }}
                            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, zIndex: 1, top: 0 }}
                        />
                    )}
                    {MediaControls}
                </Animated.View>
            </ImageBackground>

            {/* MORE ____ */}
            {playerMode == 'default' && MoreVideos}
            {/* MENU */}
            <PostItemMenu {...post} visible={isMenuModalVisile} onRequestClose={() => setisMenuModalVisile(false)} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        padding: 2,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 10,
        borderBottomRightRadius: 20
    },
    container: {
        // overflow: 'hidden',
        flex: 1,
        height: height,
        zIndex: 10,
        width,
    },
    containerInner: {
        backgroundColor: 'green',
    },
    videoContainer: {
        position: 'relative',
        padding: 0,
        aspectRatio: '16/9',
        width: '100%',
        maxHeight: VIDEO_HEIGHT,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controlsContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        bottom: 0,
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
    text: {
        fontSize: 18,
        fontWeight: '700'
    },
    contentDescriptionContainer: {
        width: '100%',
        top: 0,
        height: height - VIDEO_HEIGHT,
        position: 'absolute',
        zIndex: 12
    },

    contentDescriptionContainerBar: {
        width: 60,
        height: 5,
        borderRadius: 50,
        backgroundColor: 'red'
    },
    contentDescriptionContainerInner: {
        flex: 1,
        padding: 10
    },
    iconsButton: {
        borderWidth: 0,
        borderRadius: 50,
        gap: 5,
        paddingHorizontal: 10
    },
});