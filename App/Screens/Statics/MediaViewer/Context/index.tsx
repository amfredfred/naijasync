import { } from 'react-native'
import { useReducer, createContext, useContext, useEffect, useRef, useState } from 'react'
import { IMediaViewer, IMediaViewerProvider, IMediaPlayable, IMediaType, } from '../Interface'
import { Audio, Video } from 'expo-av'
import MediaViewer from '..'
import { getMediaType, wait } from '../../../../Helpers'
import { REQUESTS_API } from '@env'
import usePostForm from '../../../../Hooks/usePostForms'

const initialState: IMediaViewer = {
    presenting: false
}
const MediaPlaybackContext = createContext<IMediaViewerProvider | null>(null)
export const useMediaPlaybackContext = () => useContext(MediaPlaybackContext)

export function MediaViewerProvider({ children }) {

    const mediaReducer = (state, { key, payload }: { key?: any, payload }) => {
        const saveable = key ? { [key]: payload } : payload
        const data = ({ ...state, ...(saveable ?? {}) })
        return data
    }

    const [data, dispatch] = useReducer(mediaReducer, initialState)

    const setMedia: IMediaViewerProvider['setMedia'] = (props) => {
        dispatch({ payload: props })
    }

    const mediaRef = useRef<Video>(null)
    const audioObjectRef = useRef<Audio.SoundObject>(null); 

    const [mediaState, setMediaState] = useState<IMediaPlayable['states']>({});
    let mediaType: IMediaType = getMediaType(data.fileUrl);
    const removeMedia: IMediaViewerProvider['removeMedia'] = () => {
        dispatch({ payload: { fileUrl: '' } })
    }

    const handlePlaybackStatusUpdate = (data) => {
        if (data?.isLoaded && !data.isPlaying && data.didJustFinish) {
            console.log('Media playback has ended.');
            setMediaState(s => s = ({ playState: 'ended' }));
        }
        const { positionMillis, playableDurationMillis, durationMillis } = data;
        const calculatedProgress = (positionMillis / playableDurationMillis) * 100;
        setMediaState((prevState) => ({
            ...prevState,
            progress: Number((calculatedProgress ?? 0).toFixed(0)),
            duration: durationMillis / 1000
        }));
    };

    const handleSeek = (percentage) => {
        setMediaState(s => ({ ...s, playState: 'seeking' }));
        const newPosition = (percentage * mediaState?.duration) / 100;
        if (mediaType === 'audio') {
            audioObjectRef.current?.sound?.setPositionAsync(newPosition);
        } else if (mediaType === 'video') {
            console.log("SEEKD", percentage)
            mediaRef.current?.setStatusAsync({ positionMillis: newPosition });
        }
        setMediaState(s => ({ ...s, playState: 'shouldPlay' }));
    };

    const handleLoad = (data) => {
        console.log("LOADED")
        setMediaState((prevState) => ({ ...prevState, duration: data.durationMillis }));
    };

    const clearAllRefs = async () => {
        setMediaState({});
        await mediaRef?.current?.unloadAsync?.()
        await audioObjectRef?.current?.sound?.unloadAsync?.()
    }

    const loadMediaPlayable = async (shouldPlay?: boolean) => {
        try {
            if (mediaType === 'audio') {
                const playbackObject = await Audio.Sound.createAsync?.(
                    { uri: `${REQUESTS_API}${data?.fileUrl}` },
                    { shouldPlay: shouldPlay },
                    handlePlaybackStatusUpdate
                );
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
                    shouldDuckAndroid: true,
                    // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                    staysActiveInBackground: true,
                });
                audioObjectRef.current = playbackObject;
            } else if (mediaType === 'video') {
                await mediaRef?.current?.loadAsync?.({ uri: `${REQUESTS_API}${data?.fileUrl}` }, {
                    'shouldCorrectPitch': true,
                }, true);
            }
            setMediaState(S => ({ ...S, playState: 'canPlay' }))
            await play()
        } catch (error) {
            console.log("ERROR: loadMediaPlayable-> ", error)
            // await clearAllRefs()
            setMediaState(S => ({ ...S, playState: 'errored' }))
        }
    };

    useEffect(() => {

        if (mediaType) {
            loadMediaPlayable();
        }

        console.log('ref chnaged', mediaRef)

        return () => {
            clearAllRefs()
        };
    }, [data?.fileUrl, mediaRef]);


    const play = async () => {
        try {
            if (mediaType === 'audio') {
                await audioObjectRef?.current?.sound?.playAsync();
            } else if (mediaType === 'video') {
                await mediaRef?.current?.playAsync();
            }
            setMediaState((prevState) => ({ ...prevState, playState: 'playing' }));
        } catch (error) {
            console.log("ERROR: play-> ", error)
            setMediaState((prevState) => ({ ...prevState, playState: 'errored' }));
        }
    };

    const pause = async () => {
        try {
            if (mediaType === 'audio') {
                await audioObjectRef?.current?.sound?.pauseAsync();
            } else if (mediaType === 'video') {
                await mediaRef.current.pauseAsync();
            }
            setMediaState((prevState) => ({ ...prevState, playState: 'paused' }));
        } catch (error) {
            console.log("ERROR: pause-> ", error)
            setMediaState((prevState) => ({ ...prevState, playState: 'errored' }));
        }
    };

    const skipNextTo: IMediaPlayable['skipNextTo'] = async (to = 5) => {
        handleSeek(to)
    }
    const skipPrevTo: IMediaPlayable['skipPrevTo'] = async (to = 5) => {
        handleSeek(to)
    }

    const remove: IMediaPlayable['remove'] = async () => {
        try {
            removeMedia()
            clearAllRefs()
            console.log("REMOVE CALLED")
        } catch (error) {
            console.log("ERROR: remove-> ", error)
        }
    }

    const connect: IMediaPlayable['connect'] = async (props) => {
        try {
            setMedia(props)
            await play()
        } catch (error) {
            console.log("ERROR: connect-> ", error)
        }
    }

    const handleLoadStart = () => {
        console.log("VIDEO LOAD START")
        // Handle onLoadStart logic here
    };

    const handleError = (e) => {
        console.log("VIDEO ERROR", e)
        // Handle onError logic here
    };

    const handleDownloadItem = async () => {

    }


    const methodsAndStates = {
        ...data,
        play,
        pause,
        skipNextTo,
        skipPrevTo,
        remove,
        setMediaState,
        handlePlaybackStatusUpdate,
        handleDownloadItem,
        handleSeek,
        handleLoad,
        handleLoadStart,
        handleError,
        connect,
        source: data?.sources?.[0],
        type: mediaType,
        states: mediaState,
        mediaRef: mediaRef,
    };

    return (
        <MediaPlaybackContext.Provider value={{ setMedia, removeMedia, mediaRef, ...methodsAndStates }}  >
            {children}
            <MediaViewer ref={mediaRef} {...methodsAndStates} presenting={data?.presenting} />
        </MediaPlaybackContext.Provider>
    )
}