import { Video, Audio, ResizeMode } from 'expo-av'
import { useRef, useMemo, useEffect, useState } from 'react'
import { View, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween, Overlay, ScrollContainer } from '../../../Components/Containers'
import { HeadLine, SpanText } from '../../../Components/Texts'
import { Button, IconButton } from '../../../Components/Buttons'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import useThemeColors from '../../../Hooks/useThemeColors'
import { getMediaType } from '../../../Helpers'
import { IMediaType, IMediaPlayable } from './Interface'
import { useDataContext } from '../../../Contexts/DataContext'
import { useMediaPlaybackContext, useMediaViewer } from './Context'
import VideoPlayer from './Video'

export interface IMediaPlayableProps {
    mediaRef: IMediaViewer['media']['mediaRef'],
    sources: string[]
}

export type IImageMedia = {
    image: boolean
}

type IExploreableMediaType = IMediaType

export type IMediaViewer = {
    data: {
        sources: string[]
        thumbnailUri?: string
    }
    mediaType: IExploreableMediaType
    media: (IMediaPlayable)
}

export interface IMediaViewerOptions {
    mode: "fullscreen" | "collapsed" | "floating" | "hidden"
}

const { width, height } = Dimensions.get('window')

export default function MediaViewer() {
    const videoRef = useRef<Video>(null);

    const { data, media, } = useMediaViewer({
        mediaRef: videoRef
    })

    const [playerMode, setPlayerMode] = useState<IMediaViewerOptions['mode']>('collapsed')

    useEffect(() => {
        setonVideoLoading(true)
        return () => {
            setonVideoLoading(false)
        }
    }, [data, media])

    const [onVideoBuffer, setonVideoBuffer] = useState(true)
    const [onVideoLoading, setonVideoLoading] = useState(true)
    //
    const [isShwoingControls, setisShwoingControls] = useState<boolean>()
    //
    const onVideoLoadStart = () => {

    }

    const handleBackPress = () => {
        return false
    }

    const handlePlayerModeChange = (mode: IMediaViewerOptions['mode']) => {
        setPlayerMode(mode)
    }

    const handleLoad = () => {
        console.log("VIDEO LAODIED")
        setonVideoLoading(false)
        // Handle onLoad logic here
    };

    const handleLoadStart = () => {
        console.log("VIDEO LOAD START")
        setonVideoLoading(true)
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

    const AudioPlayer = (
        <ContainerBlock
            style={{
                backgroundColor: colors.background, padding: 0, position: 'relative',
                height: playerMode === 'collapsed' ? 60 : playerMode === 'fullscreen' ? height - 60 : 60
            }}>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${media?.states?.progress ?? 0}%` }]} />
            </View>
            <ContainerSpaceBetween style={{ backgroundColor: 'transparent', gap: 10 }}>
                <Image
                    source={{ uri: data?.thumbnailUri }}
                    style={{ width: 40, borderRadius: 50, aspectRatio: 1 }}
                    resizeMethod='resize'
                    resizeMode='contain'
                />

                <ContainerSpaceBetween
                    style={{ padding: 0, flex: 1 }} >
                    <Button
                        onPress={() => handlePlayerModeChange(playerMode === 'collapsed' ? 'fullscreen' : 'collapsed')}
                        title={undefined} style={{ backgroundColor: 'transparent' }}>
                        <HeadLine children="Kene Lu Ya" style={{ padding: 0 }} />
                        <SpanText children="ADA Ehi" style={{ fontSize: 11, fontWeight: '300' }} />
                    </Button>
                </ContainerSpaceBetween>

                <IconButton
                    onPress={media.states.playState === 'playing' ? media?.pause : media.play}
                    containerStyle={{}}
                    icon={<MaterialIcons
                        name={'unfold-more'}
                        color={colors.text}
                        size={40}
                    />}
                />
                <IconButton
                    onPress={media.states.playState === 'playing' ? media?.pause : media.play}
                    containerStyle={{}}
                    icon={<MaterialIcons
                        name={'more-horiz'}
                        color={colors.text}
                        size={40}
                    />}
                />
                <IconButton
                    onPress={media.states.playState === 'playing' ? media?.pause : media.play}
                    containerStyle={{}}
                    icon={<Ionicons
                        name={media.states.playState === 'playing' ? 'pause' : 'play'}
                        color={colors.text}
                        size={40}
                    />}
                />
            </ContainerSpaceBetween>
        </ContainerBlock>
    )


    const UsePlayerProps = {
        ...data,
        ...media,
        handleLoad,
        handleLoadStart,
        handleError,
        handlePlaybackStatusUpdate
    }

    let Compoenet = <></>

    if (media.type === 'video')
        Compoenet = <VideoPlayer
            {...UsePlayerProps}
            play={media.play}
            pause={media.pause}
            ref={videoRef}
        />

    return (Compoenet)
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
