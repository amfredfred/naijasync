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
        dispatch({ key: 'data', payload: {} })
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
    const mediaType: IMediaType = getMediaType(data.sources?.[0]);
    const audioObjectRef = useRef<Audio.SoundObject>(null);
    const videoRef = props.mediaRef
    let thumbnailUri = data.thumbnailUri
    const sources = data.sources

    const handlePlaybackStatusUpdate = (data) => {
        const { positionMillis, playableDurationMillis } = data;
        const calculatedProgress = (positionMillis / playableDurationMillis) * 100;
        setMediaState((prevState) => ({ ...prevState, progress: calculatedProgress }));
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

    const loadMediaPlayable = async () => {
        if (mediaType === 'audio') {
            await videoRef?.current?.unloadAsync?.()
            const playbackObject = await Audio.Sound.createAsync(
                { uri: sources?.[0] },
                { shouldPlay: false },
                handlePlaybackStatusUpdate
            );
            audioObjectRef.current = playbackObject;
        } else if (mediaType === 'video') {
            await audioObjectRef.current.sound.unloadAsync()
            await videoRef?.current?.loadAsync({ uri: sources?.[0] }, {}, true);
        }
    };


    useEffect(() => {
        if (mediaType) {
            loadMediaPlayable();
        }
        return () => {
            setMediaState({});
        };
    }, [data.sources?.[0]]);

    const play = async () => {
        if (mediaType === 'audio') {
            await audioObjectRef?.current?.sound?.playAsync();
        } else if (mediaType === 'video') {
            await videoRef?.current?.playAsync();
        }
        setMediaState((prevState) => ({ ...prevState, playState: 'playing' }));
    };

    const pause = async () => {
        if (mediaType === 'audio') {
            await audioObjectRef?.current?.sound?.pauseAsync();
        } else if (mediaType === 'video') {
            await videoRef.current.pauseAsync();
        }
        setMediaState((prevState) => ({ ...prevState, playState: 'paused' }));
    };

    const skipNextTo = async () => {

    }
    const skipPrevTo: IMediaPlayable['skipPrevTo'] = async (to) => {

    }

    const remove: IMediaPlayable['remove'] = async () => {

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
            type: mediaType,
            states: mediaState,
            mediaRef: videoRef
        },
    };
};