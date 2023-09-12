import { Video, } from 'expo-av'
import { forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import { IMediaPlayable } from './Interface'
import VideoPlayer from './Video'
import AudioPlayer from './Audio'
import useTimeout from '../../../Hooks/useTimeout'
import usePostForm from '../../../Hooks/usePostForms'
import { wait } from '../../../Helpers'

export const MediaViewer = forwardRef<Video, IMediaPlayable>((props, videoRef) => {

    let Component = <></>

    const postsForm =  usePostForm()
    

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
