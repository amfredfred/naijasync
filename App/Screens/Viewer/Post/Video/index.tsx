import { Overlay } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Video, ResizeMode } from "expo-av";
import { useState, useEffect, useMemo, useRef } from 'react'
import { IconButton } from "../../../../Components/Buttons";
import { View, StyleSheet, Dimensions, StatusBar, Text, BackHandler, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, SlideInDown, SlideOutDown, FadeInDown, withSpring, withDecay } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import useTimeout from "../../../../Hooks/useTimeout";
import { wait } from "../../../../Helpers";
import { useRoute } from "@react-navigation/native";
import ShareContent from "../../../../Components/ShareFile";
import { Videos } from "../../../../dummy-data";
import { ProgressBar } from "../../../../Components/Inputs";
import { HeadLine } from "../../../../Components/Texts";
import usePostForm from "../../../../Hooks/usePostForms";
import { useMediaPlaybackContext } from "../../../../Contexts/MediaPlaybackContext";
import MediaPlayerControls from "../../../_partials/PlayerControls";
import { REQUESTS_API } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import useMediaPlayback from "../../../../Hooks/usemediaPlayback";
const { width, height } = Dimensions.get('window')

const VIDEO_HEIGHT = 230

export default function PlayVideo() {

    const colors = useThemeColors()
    const [isShwoingControls, setisShwoingControls] = useState(true)
    const postForm = usePostForm()
    const { params } = useRoute()
    const { post } = params as any

    const mediaContext = useMediaPlayback()

    //Aniamtion
    const contConH = useSharedValue(VIDEO_HEIGHT)
    const contConDis = useSharedValue('none')
    const contentContainerStyle = useAnimatedStyle(() => ({
        top: contConH.value,
        display: contConDis.value as any
    }))

    //setting video from the route param
    useEffect(() => { mediaContext?.connect({ ...post, presenting: true }) }, [])
    // updating post views
    useEffect(() => { wait(2).then(R => postForm.methods.postView({ 'views': 1, puid: post?.puid })) }, [])


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


    const handleHidePlayerControls = () => {
        setisShwoingControls(false)
    }

    const handleShowPlayControls = () => {
        console.log("PRESSED")
        if (isShwoingControls) {
            setisShwoingControls(false)
        } else {
            setisShwoingControls(true)
        }
    }

    const MediaControls = (
        <Animated.View
            style={[styles.controlsContainer]}  >
            <View />

            <View
                onTouchStart={handleShowPlayControls}
                style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
            {
                !isShwoingControls || (
                    <LinearGradient colors={['transparent', 'transparent', 'transparent', 'rgba(0,0,0,0.4)']} style={{ justifyContent: 'space-between' }}>
                        <Animated.View
                            entering={FadeInDown}
                            exiting={SlideOutDown} style={{ height: 50 }} >
                            <MediaPlayerControls {...mediaContext?.states}
                                Button={
                                    <TouchableOpacity
                                        onPress={mediaContext?.states?.playState === 'playing' ? mediaContext?.pause : mediaContext?.play}
                                        children={<Ionicons
                                            color={'white'}
                                            size={25} name={mediaContext?.states?.playState === 'playing' ? 'pause' : 'play'} />}
                                    />
                                }
                            />
                        </Animated.View>
                    </LinearGradient>
                )}

        </Animated.View>
    )

    const MediaDefinition = (
        <View style={{ width: '100%', flex: 1 }}>
            <TouchableOpacity
                onPress={() => {
                    contConDis.value = 'flex'
                    contConH.value = 0
                }}
                style={{ padding: 10, minHeight: 40 }}>
                <Text
                    numberOfLines={2}
                    style={[{ color: colors.text, maxWidth: '92%', }]}>
                    {mediaContext?.title ?? mediaContext?.caption ?? mediaContext?.description ?? mediaContext?.mimeType}
                </Text>
            </TouchableOpacity>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ maxHeight: 40, }}
                    contentContainerStyle={{ padding: 10, gap: 10, alignItems: 'center' }}
                >
                    <IconButton
                        onPress={null}
                        title={"download"}
                        containerStyle={[styles.iconsButton]}
                        icon={<MaterialCommunityIcons size={25} name="download" />}
                    />
                    <IconButton
                        title="share"
                        onPress={() => ShareContent({
                            title: 'sahre',
                            message: 'message',
                            url: mediaContext?.fileUrl
                        })}
                        containerStyle={styles.iconsButton}
                        icon={<MaterialCommunityIcons size={25} name="share" />}
                    />
                    <IconButton
                        title="report"
                        containerStyle={styles.iconsButton}
                        icon={<MaterialIcons size={25} name="report" />}
                    />
                    <IconButton
                        title="watch later"
                        containerStyle={styles.iconsButton}
                        icon={<MaterialIcons size={25} name="watch-later" />}
                    />
                </ScrollView>
                <ProgressBar
                    // hidden
                    filled={mediaContext?.states?.progress ?? 0}
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
            <FlatList
                style={[{ flex: 1 }]}
                data={Videos}
                renderItem={({ item, index }) => <Text style={{ color: 'white', height: 40, width: '100%', backgroundColor: 'pink', marginBottom: 10 }}>{item.fileUrl}</Text>}
                keyExtractor={(item) => item.id}
            />
        </View>
    )

    return useMemo(() => (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, { backgroundColor: colors.background }]}>
            {/* VIDEO CONTAINER */}
            <Animated.View
                style={[styles.videoContainer]}>

                <Overlay
                    hidden={!Boolean(mediaContext.states?.playState == 'loading')}
                    imageSource={`${REQUESTS_API}${mediaContext?.thumbnailUrl}`}
                />

                <Video
                    style={[styles.video]}
                    resizeMode={ResizeMode.CONTAIN}
                    ref={mediaContext?.mediaRef}
                />

                {MediaControls}
            </Animated.View>
            {/* MORE ____ */}
            {MediaDefinition}
        </Animated.View>
    ), [mediaContext?.states, isShwoingControls])
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
        backgroundColor: 'red',
        position: 'absolute',
        flex: 1,
        height: height,
        marginTop: StatusBar.currentHeight,
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: '100%',
        flex: 1,
        bottom: 0,
        justifyContent: 'space-between',
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
        overflow: 'hidden',
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

    progressBarContainer: {
        width: '100%',
        height: 2,
        backgroundColor: '#ccc',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'red',
    },
    seekContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 20,
    },
    seekBar: {
        height: '100%',
        backgroundColor: 'transparent',
    },
    iconsButton: {
        borderWidth: 0,
        borderRadius: 50,
        gap: 5,
        paddingHorizontal: 10
    },
});