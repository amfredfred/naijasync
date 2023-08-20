import { } from 'react-native'
import { useReducer, createContext, useContext, useEffect, useRef, useState } from 'react'
import { IMediaViewer, IMediaViewerProvider, IMediaPlayableProps, IMediaPlayable, IMediaType, } from '../Interface'
import { Audio, Video } from 'expo-av'
import MediaViewer from '..'
import { getMediaType } from '../../../../Helpers'

const initialState: IMediaViewer = {}
const MediaPlaybackContext = createContext<IMediaViewerProvider | null>(null)
export const useMediaPlaybackContext = () => useContext(MediaPlaybackContext)
export function MediaViewerProvider({ children }) {

    const mediaReducer = (state, { key, payload }: { key?: any, payload }) => {
        const saveable = key ? { [key]: payload } : payload
        const data = ({ ...state, ...(saveable ?? {}) })
        return data
    }

    const [data, dispatch] = useReducer(mediaReducer, { ...initialState })
    const setMedia: IMediaViewerProvider['setMedia'] = ({ sources, thumbnailUri }) => {
        dispatch({ payload: { sources, thumbnailUri } })
    }

    const removeMedia: IMediaViewerProvider['removeMedia'] = () => {
        dispatch({ payload: { sources: [], thumbnailUri: '' } })
    }

    return (
        <MediaPlaybackContext.Provider value={{ setMedia, removeMedia, data }}>
            {children}
            <MediaViewer />
        </MediaPlaybackContext.Provider>
    )
}

export const useMediaViewer = (props: IMediaPlayableProps): IMediaViewer => {
    const [mediaState, setMediaState] = useState<IMediaPlayable['states']>({});
    const { data, setMedia, removeMedia } = useMediaPlaybackContext()
    let mediaType: IMediaType = getMediaType(data.sources?.[0]);
    const audioObjectRef = useRef<Audio.SoundObject>(null);
    const videoRef = props.mediaRef
    let thumbnailUri = data.thumbnailUri
    const sources = data.sources

    const handlePlaybackStatusUpdate = (data) => {
        const { positionMillis, playableDurationMillis } = data;
        const calculatedProgress = (positionMillis / playableDurationMillis) * 100;
        setMediaState((prevState) => ({
            ...prevState,
            progress: Number((calculatedProgress ?? 0).toFixed(0)),
            duration: playableDurationMillis / 1000
        }));
    };

    const handleSeek = (percentage) => {
        const newPosition = (percentage * mediaState?.duration) / 100;
        if (mediaType === 'audio') {
            audioObjectRef.current?.sound?.setPositionAsync(newPosition);
        } else if (mediaType === 'video') {
            console.log("SEEKD", percentage)
            videoRef.current?.setStatusAsync({ positionMillis: newPosition });
        }
    };

    const handleLoad = (data) => {
        console.log("LOADED")
        setMediaState((prevState) => ({ ...prevState, duration: data.durationMillis }));
    };

    const clearAllRefs = async () => {
        setMediaState({});
        await videoRef?.current?.unloadAsync?.()
        await audioObjectRef?.current?.sound?.unloadAsync?.()
    }

    const loadMediaPlayable = async (shouldPlay?: boolean) => {
        try {
            if (mediaType === 'audio') {
                const playbackObject = await Audio.Sound.createAsync?.(
                    { uri: sources?.[0] },
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
                await videoRef?.current?.loadAsync?.({ uri: sources?.[0] }, {
                    'shouldCorrectPitch': true,
                }, true);
            }
            setMediaState(S => ({ ...S, playState: 'canPlay' }))
            await play()
        } catch (error) {
            console.log("ERROR: loadMediaPlayable-> ", error)
            await clearAllRefs()
            setMediaState(S => ({ ...S, playState: 'errored' }))
        }
    };



    useEffect(() => {

        if (mediaType) {
            loadMediaPlayable();
        }

        return () => {
            clearAllRefs()
        };
    }, [data.sources?.[0]]);

    const play = async () => {
        try {
            if (mediaType === 'audio') {
                await audioObjectRef?.current?.sound?.playAsync();
            } else if (mediaType === 'video') {
                await videoRef?.current?.playAsync();
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
                await videoRef.current.pauseAsync();
            }
            setMediaState((prevState) => ({ ...prevState, playState: 'paused' }));
        } catch (error) {
            console.log("ERROR: pause-> ", error)
            setMediaState((prevState) => ({ ...prevState, playState: 'errored' }));
        }
    };

    const skipNextTo: IMediaPlayable['skipNextTo'] = async (to) => {

    }
    const skipPrevTo: IMediaPlayable['skipPrevTo'] = async (to) => {

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

    const connect: IMediaPlayable['connect'] = async (mediaLink, thumbnailUri, shouldPlayNow) => {
        try {
            setMedia({
                sources: [mediaLink],
                thumbnailUri,
            })
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


    return {
        data: {
            thumbnailUri,
            sources
        },
        media: {
            play,
            pause,
            skipNextTo,
            skipPrevTo,
            remove,
            setMediaState,
            handlePlaybackStatusUpdate,
            handleSeek,
            handleLoad,
            handleLoadStart,
            handleError,
            connect,
            source: sources?.[0],
            type: mediaType,
            states: mediaState,
            mediaRef: videoRef
        },
    };
};