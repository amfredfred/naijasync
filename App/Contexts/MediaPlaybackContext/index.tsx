import { } from 'react-native'
import { createContext, useContext } from 'react'
import MediaViewer from '../../Screens/Statics'
import { useEffect, useReducer, useRef, useState } from "react";
import { useToast } from "../ToastContext";
import { IMediaPlayable, IMediaPlaybackUpdate, IMediaViewer, IMediaViewerProvider } from "../../Screens/Statics/Interface";
import { Audio, Video } from "expo-av";
import { IMediaType } from "../../Interfaces";
import { getMediaType } from "../../Helpers";
import { REQUESTS_API } from "@env";

const initialState: IMediaViewer = {
    presenting: false
}

const MediaPlaybackContext = createContext<IMediaPlayable | null>(null)
export const useMediaPlaybackContext = () => useContext(MediaPlaybackContext)

export function MediaViewerProvider({ children }) {


    const mediaReducer = (state, { key, payload }: { key?: any, payload }) => (key) ? { ...state, [key]: payload } : payload;

    const [data, dispatch] = useReducer(mediaReducer, initialState)
    const { toast } = useToast()

    const setMedia: IMediaViewerProvider['setMedia'] = (props) => {
        dispatch({ payload: props })
    }

    const mediaRef = useRef<Video>()
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

    const handleSeek = (positionSeconds) => {
        setMediaState(s => ({ ...s, playState: 'seeking' }));
        if (mediaType === 'audio') {
            audioObjectRef.current?.sound?.setPositionAsync(positionSeconds);
        } else if (mediaType === 'video') {
            mediaRef.current?.setStatusAsync({ positionMillis: positionSeconds });
        }
        setMediaState(s => ({ ...s, playState: 'shouldPlay' }));
        play()
    };

    const handleLoad = (data) => {
        setMediaState((prevState) => ({ ...prevState, duration: data.durationMillis }));
    };

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
            setMediaState((prevState) => ({ ...prevState, playState: 'errored' }));
        }
    };


    const loadMediaPlayable = async (shouldPlay?: boolean) => {
        try {
            setMediaState(S => ({ ...S, playState: 'loading' }))
            const uri = data?.fileUrl?.split('file:/')?.[1] ? data?.fileUrl : `${REQUESTS_API}${data?.fileUrl}`
            if (mediaType === 'audio') {
                const playbackObject = await Audio.Sound.createAsync?.(
                    { uri },
                    { shouldPlay: shouldPlay },
                    handlePlaybackStatusUpdate as any
                );
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    staysActiveInBackground: true,
                });
                audioObjectRef.current = playbackObject;
            } else if (mediaType === 'video') {
                await mediaRef?.current?.loadAsync?.({ uri }, {}, false);
            }
            setMediaState(S => ({ ...S, isReady: true, playState: 'canPlay' }))
            play()
            mediaRef?.current?.setOnPlaybackStatusUpdate(states => handlePlaybackStatusUpdate(states as any))
        } catch (error) {
            toast({
                message: "error occured while loading media !!",
                timeout: 5000,
                severity: 'error',
                headline: 'Error loading '.concat(mediaType)
            })
            // await clearAllRefs()
            setMediaState(S => ({ ...S, playState: 'errored' }))
        }
    };

    useEffect(() => {
        if (mediaType) {
            loadMediaPlayable();
        }
        return () => {

        };
    }, [data?.fileUrl, mediaType]);


    const skipNextTo: IMediaPlayable['skipNextTo'] = async (to = 5) => {
        const newPosition = (mediaState.position + to) * 1000;
        handleSeek(newPosition)
    }
    const skipPrevTo: IMediaPlayable['skipPrevTo'] = async (to = 5) => {
        const newPosition = (mediaState.position + to) * 1000;
        handleSeek(newPosition)
    }

    const remove: IMediaPlayable['remove'] = async () => {
        removeMedia()
    }

    const connect: IMediaPlayable['connect'] = async (props) => {
        remove()
        dispatch({ 'key': 'presenting', payload: props?.presenting })
        try {
            setMedia(props)
        } catch (error) { 
        }
    }

    const handleLoadStart = () => { 
        // Handle onLoadStart logic here
    };

    const handleError = (e) => {
        
        // Handle onError logic here
    };

    const handleDownloadItem = async () => {

    }


    const mediaPlayback = {
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
        <MediaPlaybackContext.Provider value={mediaPlayback}  >
            {children}
            <MediaViewer {...mediaPlayback} />
        </MediaPlaybackContext.Provider>
    )
}