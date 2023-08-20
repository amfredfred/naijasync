import { Video, } from 'expo-av'
import { useRef, useEffect, useState } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween } from '../../../Components/Containers'
import { HeadLine, SpanText } from '../../../Components/Texts'
import { Button, IconButton } from '../../../Components/Buttons'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import useThemeColors from '../../../Hooks/useThemeColors'
import { IMediaPlayable } from './Interface'
import { useMediaViewer } from './Context'
import VideoPlayer from './Video'
import Animated, { useSharedValue } from 'react-native-reanimated'
import AudioPlayer from './Audio'
import useMediaLibrary from '../../../Hooks/useMediaLibrary'


const { width, height } = Dimensions.get('window')

export default function MediaViewer() {
    const videoRef = useRef<Video>(null);

    const { data, media, } = useMediaViewer({
        mediaRef: videoRef
    })

    const [playerMode, setPlayerMode] = useState<IMediaPlayable['mode']>('collapsed')
    const onVideoLoadStart = () => {

    }

    const handleBackPress = () => {
        return false
    }

    const handlePlayerModeChange = (mode: IMediaPlayable['mode']) => {
        setPlayerMode(mode)
    }

    const handleLoad = () => {
        console.log("VIDEO LAODIED")
        // Handle onLoad logic here
    };

    const handleLoadStart = () => {
        console.log("VIDEO LOAD START")
        // Handle onLoadStart logic here
    };

    const handleError = (e) => {
        console.log("VIDEO ERRORE", e)
        // Handle onError logic here
    };

    const handlePlaybackStatusUpdate = (status) => {
        // Handle onPlaybackStatusUpdate logic here
        media.handlePlaybackStatusUpdate?.(status)
    };

    const colors = useThemeColors()

    const {
        createDownload,
        downloadMessage,
        downloadProgreess,
        downloadStataus,
        hasDownloadedMedias,
        handleAlbumCreationAndAssetAddition,
        handleLibPermisionsRequest,
        libPermision,
        pauseDownload,
        cancelDownload,
        resumeDownload
    } = useMediaLibrary()

    const handleDownloadItem = async (uri: string) => {
        console.log("DONLAOD_LINK: ", uri)
    }


    const UsePlayerProps = {
        ...data,
        ...media,
        handleLoad,
        handleLoadStart,
        handleError,
        handlePlaybackStatusUpdate,
        handleDownloadItem
    }

    let Component = <></>

    if (media.type === 'video')
        Component = <VideoPlayer
            {...UsePlayerProps}
            play={media.play}
            pause={media.pause}
            ref={videoRef}
        />
    else if (media.type === 'audio')
        Component = <AudioPlayer
            {...UsePlayerProps}
            play={media?.play}
            pause={media?.pause}
        // ref={}
        />

    return (Component)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playPauseButton: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1,
    },
    playPauseIcon: {
        width: 60,
        height: 60,
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
