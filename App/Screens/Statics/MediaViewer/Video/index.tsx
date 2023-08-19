import { ContainerBlock, Overlay, ScrollContainer } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Video, ResizeMode } from "expo-av";
import { IThemedComponent } from "../../../../Interfaces";
import { useState, forwardRef, useEffect } from 'react'
import { IconButton } from "../../../../Components/Buttons";
import { IMediaPlayable } from "../Interface";
import { View, StyleSheet } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export type IVideoPlayer = IThemedComponent & IMediaPlayable & {
    ref: React.RefObject<Video>
    thumbnailUri?: string
}

const VideoPlayer = forwardRef<Video, IVideoPlayer>((props, ref) => {
    const colors = useThemeColors()
    const [isVideoBuffering, setisVideoBuffering] = useState(false)
    const [isVideoLoading, setisVideoLoading] = useState(false)
    const { hidden, ...VP } = props

    console.log("THIS COMPOENENT", VP.thumbnailUri)

    const handleOnLoad = (e) => {
        setisVideoLoading(false)
        VP?.handleLoad(e)
    }

    const handleOnStartLoad = () => {
        setisVideoLoading(true)
        VP?.handleLoadStart()
    }

    console.log(isVideoLoading, " LOADING")


    return (
        <ContainerBlock style={[styles.container]}>

            {/* VIDEO CONTAINER */}
            <ContainerBlock style={[styles.videoContainer]}>
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
            </ContainerBlock>


            <ContainerBlock style={{ position: 'absolute', width: '100%', padding: 0, backgroundColor: 'transparent', height: '100%' }}>
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
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${VP?.states?.progress ?? 0}%` }]} />
                </View>
            </ContainerBlock>
        </ContainerBlock>
    )
});

const styles = StyleSheet.create({
    container: {
        width: '95%',
        overflow: 'hidden',
        elevation: 40,
        shadowColor: 'red',
        position: 'absolute',
        left: '2.5%',
        top: 80,
        padding: 0,
        borderRadius: 10
    },

    videoContainer: {
        position: 'relative',
        padding: 0,
        height: 200,
        aspectRatio: '16/9'
    },

    video: {
        width: '100%',
        height: '100%'
    },

    progressBarContainer: {
        width: '100%',
        flex: 1,
        height: 3,
        backgroundColor: '#ccc',
        marginBottom: 10,
        position: 'absolute',
        top: .2,
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