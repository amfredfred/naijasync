import { } from 'react-native'
import { useReducer, createContext, useContext, useEffect, useRef, useState } from 'react'
import { IMediaViewer, IMediaViewerProvider, IMediaPlayable, IMediaType, IMediaPlaybackUpdate, } from '../Interface'
import { Audio, Video } from 'expo-av'
import MediaViewer from '..'
import { getMediaType, wait } from '../../../../Helpers'
import { REQUESTS_API } from '@env'
import { useToast } from '../../../../Contexts/ToastContext'

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

    const { toast } = useToast()

    const setMedia: IMediaViewerProvider['setMedia'] = (props) => {
        dispatch({ payload: props })
    }

    const mediaRef = useRef<Video>(null)
    const audioObjectRef = useRef<Audio.SoundObject>(null);

    const [mediaState, setMediaState] = useState<IMediaPlayable['states']>({
        duration: 0,
        position: 0,
        progress: 0,
        bufferProgress: 0
    });
    let mediaType: IMediaType = getMediaType(data.fileUrl);

    const clearAllRefs = async () => {
        mediaType = null
        await mediaRef?.current?.unloadAsync?.()
        await audioObjectRef?.current?.sound?.unloadAsync?.()
        setMediaState({});
    }

    const removeMedia: IMediaViewerProvider['removeMedia'] = () => {
        clearAllRefs()
        setMedia({ fileUrl: null, presenting: false })
    }

    const handlePlaybackStatusUpdate = (data: IMediaPlaybackUpdate) => {
        if (data?.isLoaded && !data.isPlaying && data.didJustFinish) {
            return setMediaState(s => s = ({ ...s, playState: 'ended' }));
        }
        const { positionMillis, playableDurationMillis, durationMillis } = data;
        setMediaState((prevState) => ({
            ...prevState,
            progress: Number(positionMillis / durationMillis),
            position: positionMillis / 1000,
            duration: durationMillis / 1000,
            bufferProgress: Number(positionMillis / playableDurationMillis),
            isBufering: data.isBuffering
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


    const loadMediaPlayable = async (shouldPlay?: boolean) => {
        try {
            if (mediaType === 'audio') {
                const playbackObject = await Audio.Sound.createAsync?.(
                    { uri: `${REQUESTS_API}${data?.fileUrl}` },
                    { shouldPlay: shouldPlay },
                    handlePlaybackStatusUpdate as any
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

                mediaRef?.current?.setOnPlaybackStatusUpdate(states => handlePlaybackStatusUpdate(states as any))
            }
            setMediaState(S => ({ ...S, playState: 'canPlay' }))
            play()
        } catch (error) {
            console.log("ERROR: loadMediaPlayable-> ", error)
            toast({
                message: "error occured while loading media !!",
                timeout: 5000,
                severnity: 'error',
                headline: 'Error loading '.concat(mediaType)
            })
            // await clearAllRefs()
            setMediaState(S => ({ ...S, playState: 'errored' }))
        }
    };

    useEffect(() => {

        if (mediaType) {
            setMediaState(S => ({ ...S, playState: 'loading' }))
            loadMediaPlayable();
        }

        return () => {
            clearAllRefs()
        };
    }, [data?.fileUrl, mediaRef]);


    const play = async () => {
        try {
            if (mediaType === 'audio') {
                if (mediaState?.playState === 'ended')
                    await audioObjectRef?.current?.sound?.replayAsync();
                else
                    await audioObjectRef?.current?.sound?.playAsync();
            } else if (mediaType === 'video') {
                if (mediaState?.playState === 'ended')
                    await mediaRef?.current?.replayAsync();
                else
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
        removeMedia()
    }

    const connect: IMediaPlayable['connect'] = async (props) => {
        dispatch({ 'key': 'presenting', payload: props?.presenting })
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