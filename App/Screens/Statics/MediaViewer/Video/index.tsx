import { Overlay, ScrollContainer } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Video, ResizeMode } from "expo-av";
import { IThemedComponent } from "../../../../Interfaces";
import { useState, forwardRef, useEffect, useRef } from 'react'
import { IconButton } from "../../../../Components/Buttons";
import { IMediaPlayable, IMediaViewer } from "../Interface";
import { View, StyleSheet, Dimensions, StatusBar, PanResponder, Text, BackHandler, Keyboard, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, SlideInDown, SlideOutDown, FadeInDown, withSpring, withDecay } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import useTimeout from "../../../../Hooks/useTimeout";
import { formatDuration, formatPlaytimeDuration } from "../../../../Helpers";
import { useNavigation } from "@react-navigation/native";
import ShareContent from "../../../Partials/ShareFile";
import { Videos } from "../../../../dummy-data";


export type IVideoPlayer = IThemedComponent & IMediaPlayable & {
    ref: React.RefObject<Video>
    thumbnailUri?: string
}

const { width, height } = Dimensions.get('window')

const VIDEO_HEIGHT = 230

const VideoPlayer = forwardRef<Video, IVideoPlayer>((props, ref) => {

    const colors = useThemeColors()
    const [isShwoingControls, setisShwoingControls] = useState(false)
    const [isVideoLoading, setisVideoLoading] = useState(false)
    const [keyBoardShown, setkeyBoardShown] = useState(false)
    const progressRef = useRef(null);
    const viewMode = useSharedValue<IVideoPlayer['mode']>('fullscreen')
    const { canGoBack } = useNavigation()

    const { hidden, ...VP } = props

    const conH = useSharedValue(0);
    const draggingVideo = useSharedValue(false)
    const lastDragPosition = useSharedValue(34);
    const contConH = useSharedValue(VIDEO_HEIGHT)
    const contConDis = useSharedValue('none')
    const listConOpacity = useSharedValue(1)

    const conAnimatedStyle = useAnimatedStyle(() => {
        return {
            top: conH.value,
        };
    });

    const contentContainerStyle = useAnimatedStyle(() => {
        return {
            top: contConH.value,
            display: contConDis.value as any
        };
    });

    const listReanimated = useAnimatedStyle(() => ({
        opacity: listConOpacity.value
    }))

    const gesture = Gesture.Pan()
        .onStart(e => {
            contConH.value = withSpring(100)
            contConDis.value = 'none'
        })
        .onBegin(e => {
        })
        .onUpdate(e => {
            listConOpacity.value = Math.abs(height / Math.max(0, Math.min(lastDragPosition.value + e.translationY / 1, height - VIDEO_HEIGHT)) / 100)
            conH.value = Math.max(0, Math.min(lastDragPosition.value + e.translationY / 1, height - VIDEO_HEIGHT));
        })
        .onEnd(e => {
            if (e.translationY <= height / 2) {
                conH.value = 0
                viewMode.value = "fullscreen"
                listConOpacity.value = 1
            } else if (e.translationY >= height / 2) {
                conH.value = height - VIDEO_HEIGHT
                viewMode.value = "collapsed"
                listConOpacity.value = 0
            }
            lastDragPosition.value = e.translationY
            draggingVideo.value = false;
        });

    const contenGetsture = Gesture.Pan()
        .onUpdate(e => {
            contConH.value = Math.max(0, Math.min(e.translationY / 1, height - VIDEO_HEIGHT));
        })
        .onEnd(e => {
            if (e.translationY <= height / 2) {
                contConH.value = withDecay({
                    velocity: 2,
                    deceleration: 0.997, // Adjust the deceleration factor as needed
                    clamp: [0, 0], // Set the upper and lower clamp values
                });
                contConDis.value = 'flex'
            } else if (e.translationY >= height / 3) {
                contConH.value = withSpring(100)
                contConDis.value = 'none'
            }
        })

    useEffect(() => {
        if (viewMode.value === 'hidden') {
            console.log("RERENDERED 💫")
        }
    }, [viewMode.value])

    const handleOnLoad = (e) => {
        setisVideoLoading(false)
        VP?.handleLoad(e)
    }

    const handleOnStartLoad = () => {
        setisVideoLoading(true)
        VP?.handleLoadStart()
    }


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            if (VP.mediaRef?.current) {
                const width = progressRef.current.offsetWidth;
                const position = gestureState.moveX;
                const seekTime = (position / width) * VP.states.duration;
                VP.handleSeek(seekTime);
            }
        },
    });

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

    useTimeout({
        'onTimeout': handleHidePlayerControls,
        'onClearTimeout': () => console.log("TIMEOUT CLEARED"),
        seconds: 3000,
        'deps': [isShwoingControls]
    })

    const hanleBackPress = () => {
        if (viewMode.value === 'fullscreen') {
            conH.value = height - VIDEO_HEIGHT
            viewMode.value = 'collapsed'
            return true
        }
        else if (viewMode.value === 'collapsed') {
            console.log("COLLAPASED")
            if (canGoBack()) {
                return false
            }
            VP.remove()
            return true
        }
        else {
            console.log("HE FRED")
        }
    }

    //Effects 
    useEffect(() => {

        const BHND = BackHandler.addEventListener('hardwareBackPress', hanleBackPress)
        const keyboardshown = Keyboard.addListener('keyboardDidShow', () => {
            setkeyBoardShown(s => true)
            VP?.pause()
        })
        const keyboardhidden = Keyboard.addListener('keyboardDidHide', () => {
            setkeyBoardShown(s => false)
            VP?.play()
        })

        return () => {
            keyboardshown.remove()
            keyboardhidden.remove()
            BHND.remove()
        }
    }, [])

    const MediaControls = (
        <Animated.View style={[styles.controlsContainer]}  >
            <View
                onTouchStart={handleShowPlayControls}
                style={{ flex: 1, width: '100%' }}>

            </View>
            <View
                ref={progressRef}
                {...panResponder.panHandlers}
                style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${VP?.states?.progress ?? 0}%` }]} />
            </View>
            {
                !isShwoingControls || (
                    <Animated.View
                        entering={FadeInDown}
                        exiting={SlideOutDown}
                        style={[styles.spaceBetween, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                        <Text style={[styles.text, { color: colors.text }]}>
                            {formatPlaytimeDuration(VP?.states?.duration)}/{VP?.states?.progress}%
                        </Text>
                        <View style={[styles.spaceBetween, { justifyContent: 'flex-end' }]}>

                            <IconButton
                                onPress={VP.states.playState === 'playing' ? VP?.pause : VP.play}
                                style={{ width: 35, backgroundColor: 'transparent' }}
                                icon={<MaterialIcons
                                    name={'more-horiz'}
                                    color={colors.text}
                                    size={35}
                                />}
                            />
                            <IconButton
                                onPress={VP.states.playState === 'playing' ? VP?.pause : VP.play}
                                style={{ width: 35, backgroundColor: 'transparent' }}
                                icon={<MaterialIcons
                                    name={'more-horiz'}
                                    color={colors.text}
                                    size={35}
                                />}
                            />
                            <IconButton
                                onPress={VP.states.playState === 'playing' ? VP?.pause : VP.play}
                                containerStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                                style={{ width: 35, backgroundColor: 'transparent' }}
                                icon={<Ionicons
                                    name={VP?.states?.playState === 'playing' ? 'pause' : 'play'}
                                    color={'red'}
                                    size={35}
                                />}
                            />
                        </View>
                    </Animated.View>
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
                    Ronaldo Goal - Al Nassr vs Al Shorta 1-0 Highlights & All Goals - 20
                    Ronaldo Goal - Al Nassr vs Al Shorta 1-0 Highlights & All Goals - 2023
                </Text>
            </TouchableOpacity>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ maxHeight: 40, backgroundColor: 'orangered' }}
                    contentContainerStyle={{ paddingHorizontal: 10, gap: 10, alignItems: 'center' }}
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
                            url: VP?.source?.[0]
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
                <View style={{backgroundColor:'green', height:50, width:'100%'}}>

                </View>
           </View>
            <GestureDetector gesture={contenGetsture}>
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    style={[styles.contentDescriptionContainer, contentContainerStyle, { backgroundColor: colors.background2 }]}>
                    <View style={[styles.spaceBetween, { height: 20, justifyContent: 'center' }]}>
                        <View style={[styles.contentDescriptionContainerBar, { backgroundColor: colors.text }]} />
                    </View>

                </Animated.View>
            </GestureDetector>
            <Animated.FlatList
                style={[{ flex: 1 }, listReanimated]}
                data={Videos}
                renderItem={({ item, index }) => {
                    return <Text style={{ color: 'white', height: 40, width: '100%', backgroundColor: 'pink', marginBottom: 10 }}>{item.src}</Text>
                }}
                keyExtractor={(item) => item.id}
            />
        </View>
    )

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, conAnimatedStyle, { borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: colors.background }]}>
            {/* VIDEO CONTAINER */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[styles.videoContainer]}>
                    <Overlay
                        hidden={(!isVideoLoading)}
                        imageSource={VP?.thumbnailUri}
                    />
                    <Video
                        posterSource={{ uri: VP?.thumbnailUri }}
                        style={[styles.video]}
                        resizeMode={ResizeMode.CONTAIN}
                        onLoad={handleOnLoad}
                        onLoadStart={handleOnStartLoad}
                        onError={VP?.handleError}
                        ref={ref}
                        onPlaybackStatusUpdate={VP.handlePlaybackStatusUpdate}  // Can be a URL or a local file.
                    />
                    {MediaControls}
                </Animated.View>
            </GestureDetector>
            {MediaDefinition}
        </Animated.View>
    )
});

const styles = StyleSheet.create({
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
        backgroundColor: 'pink',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1
    },

    contentDescriptionContainerBar: {
        width: 100,
        height: 5,
        borderRadius: 50,
        backgroundColor: 'red'
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

export default VideoPlayer