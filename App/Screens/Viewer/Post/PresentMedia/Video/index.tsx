import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IPostItem } from "../../../../../Interfaces";
import { useMediaPlaybackContext } from "../../../../Statics/MediaViewer/Context";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useState } from "react";
import { IconButton } from "../../../../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "../../../../../Components/Inputs";
import { REQUESTS_API } from "@env";
import { Overlay } from "../../../../../Components/Containers";
import { SpanText } from "../../../../../Components/Texts";
import { formatDuration, formatPlaytimeDuration } from "../../../../../Helpers";


export default function VideoPresent(post: IPostItem) {

    const mediaContext = useMediaPlaybackContext()



    useEffect(() => {

        mediaContext?.connect({ ...post, presenting: true })

        return () => {
            mediaContext?.remove()
        }

    }, [post?.fileUrl])


 


    return (
        <View
            style={[styles.constainer]}>

            <View style={{ position: 'relative', flex: 1 }}>
                <Overlay
                    hidden={mediaContext.states?.playState !== 'loading'}
                    imageProps={{
                        resizeMethod: 'resize',
                        resizeMode: 'contain',
                        source: { uri: `${REQUESTS_API}${post?.thumbnailUrl}` }
                    }}
                />
                <Video
                    resizeMode={ResizeMode?.CONTAIN}
                    ref={mediaContext?.mediaRef}
                    shouldPlay
                    style={{ width: '100%', flexGrow: 1, flex: 1 }}
                    onPlaybackStatusUpdate={mediaContext?.handlePlaybackStatusUpdate}
                />
            </View>
            <View style={[styles.playControlsContainer]}>
                <View style={{ flex: 1 }}>
                    <View
                        style={[styles.mediaProgressContainer]}>
                        <View style={[styles.mediaProgressBar, { width: `${mediaContext?.states?.progress * 100}%` }]}>
                            <View style={[styles.mediaProgressarPointer]} />
                        </View>
                        <View style={[styles.mediaBufferBar, { width: `${mediaContext?.states?.bufferProgress * 100}%` }]} />
                    </View>
                    <SpanText
                        style={{ fontSize: 12, padding: 0, margin: 0, width: '100%', textAlign: 'right' }}  >
                        {formatPlaytimeDuration(mediaContext?.states?.position)}/{formatPlaytimeDuration(mediaContext?.states?.duration)}
                    </SpanText>
                </View>
                <IconButton
                    onPress={mediaContext.states.playState === 'playing' ? mediaContext?.pause : mediaContext.play}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    style={{ width: 35, backgroundColor: 'transparent' }}
                    icon={<Ionicons
                        name={mediaContext?.states?.playState === 'playing' ? 'pause' : 'play'}
                        color={'white'}
                        size={35}
                    />}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        position: 'relative'
    },
    playControlsContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        position: 'absolute',
        bottom: 0,
        paddingLeft: 25,
    },


    // 
    mediaProgressContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 3,
        position: 'relative',
        borderRadius: 50,
    },
    mediaBufferBar: {
        backgroundColor: 'green',
        width: 80,
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '100%',
        borderRadius: 50,
        opacity: .2
    },
    mediaProgressBar: {
        backgroundColor: 'red',
        width: 40,
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '100%',
        zIndex: 2,
        borderRadius: 50,
    },
    mediaProgressarPointer: {
        borderRadius: 50,
        width: 10,
        aspectRatio: 1,
        backgroundColor: 'red',
        position: 'absolute',
        right: -5,
        bottom: -3.4
    }
})