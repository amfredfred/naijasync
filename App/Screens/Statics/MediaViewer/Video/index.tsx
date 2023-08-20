import { Overlay, ScrollContainer } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Video, ResizeMode } from "expo-av";
import { IThemedComponent } from "../../../../Interfaces";
import { useState, forwardRef, useEffect, useRef } from 'react'
import { IconButton } from "../../../../Components/Buttons";
import { IMediaPlayable, IMediaViewer } from "../Interface";
import { View, StyleSheet, Dimensions, StatusBar, PanResponder } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, SlideInDown, SlideOutUp, SlideOutDown } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


export type IVideoPlayer = IThemedComponent & IMediaPlayable & {
    ref: React.RefObject<Video>
    thumbnailUri?: string
}

const { width, height } = Dimensions.get('window')

const VIDEO_HEIGHT = 230

const VideoPlayer = forwardRef<Video, IVideoPlayer>((props, ref) => {
    const colors = useThemeColors()
    const [isVideoBuffering, setisVideoBuffering] = useState(false)
    const [isVideoLoading, setisVideoLoading] = useState(false)
    const progressRef = useRef(null);
    const viewMode = useSharedValue<IVideoPlayer['mode']>('fullscreen')

    const { hidden, ...VP } = props

    const conH = useSharedValue(200);
    const vidConH = useSharedValue(200)
    const draggingVideo = useSharedValue(false)
    const lastDragPosition = useSharedValue(0);

    const conAnimatedStyle = useAnimatedStyle(() => {
        return {
            top: conH.value,
        };
    });

    const vidConstyle = useAnimatedStyle(() => {
        return {
            // height: vidConH.value,
        };
    });

    const gesture = Gesture.Pan()
        .onStart(e => {
        })
        .onBegin(e => {
        })
        .onUpdate(e => {
            // draggingVideo.value = true;
            // conH.value = Math.max(0, Math.min(e.translationY / 1, height-250));

            conH.value = Math.max(0, Math.min(lastDragPosition.value + e.translationY / 1, height - VIDEO_HEIGHT));
        })
        .onEnd(e => {
            if (e.translationY <= height / 2) {
                conH.value = 0
                viewMode.value = "fullscreen"
            } else if (e.translationY >= height / 2) {
                conH.value = height - VIDEO_HEIGHT
                viewMode.value = "collapsed"
            }
            lastDragPosition.value = e.translationY
            draggingVideo.value = false;
        });


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
                // const width = progressRef.current.offsetWidth;
                // const position = gestureState.moveX;
                // const seekTime = (position / width) * VP.mediaRef?.current.;
                // VP.handleSeek(seekTime);
            }
        },
    });

    // , mds?.container
    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, conAnimatedStyle, { borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor:colors.background}]}>
            {/* VIDEO CONTAINER */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[styles.videoContainer, vidConstyle]}>
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

                    <View
                        style={{ position: 'absolute', width: '100%', padding: 0, backgroundColor: 'transparent', height: '100%', display: draggingVideo.value ? 'none' : 'flex' }}>
                        <ScrollContainer
                            contentContainerStyle={{ gap: 10 }}
                            horizontal
                            style={{ padding: 10, position: 'absolute', bottom: 0 }}>
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
                        </ScrollContainer>

                    </View>
                    <View
                        ref={progressRef}
                        {...panResponder.panHandlers}
                        style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${VP?.states?.progress ?? 0}%` }]} />
                    </View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'absolute',
        flex: 1,
        minHeight: height,
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
        width:'100%',
        maxHeight: VIDEO_HEIGHT, 
    },

    video: {
        width: '100%',
        height: '100%',
    },

    progressBarContainer: {
        width: '100%',
        height: 3,
        backgroundColor: '#ccc',
        marginBottom: 10,
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
    controlsContainer: {
        // Additional styling for controls container
    },
});

export default VideoPlayer