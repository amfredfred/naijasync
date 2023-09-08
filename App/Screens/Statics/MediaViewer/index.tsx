import { Video, } from 'expo-av'
import { forwardRef } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import useThemeColors from '../../../Hooks/useThemeColors'
import { IMediaPlayable, IMediaViewer } from './Interface'
import VideoPlayer from './Video'
import AudioPlayer from './Audio'
import useMediaLibrary from '../../../Hooks/useMediaLibrary'


const { width, height } = Dimensions.get('window')

export const MediaViewer = forwardRef<Video, IMediaPlayable>((props, videoRef) => {

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

    let Component = <></>

    if (props?.type === 'video')
        Component = <VideoPlayer
            {...props}
            ref={videoRef}
        />
    else if (props?.type === 'audio')
        Component = <AudioPlayer
            {...props}
        // ref={}
        />

    return (Component)
})


export default MediaViewer

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
