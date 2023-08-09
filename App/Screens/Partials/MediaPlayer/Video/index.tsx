import { useEffect, useRef, useState } from "react";
import { Video, ResizeMode } from 'expo-av'
import { IPostItem } from "../../../../Interfaces";
import { ContainerBlock, Overlay, ScrollContainer } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Button } from "../../../../Components/Buttons";
import { useDataContext } from "../../../../Contexts/DataContext";
import { BackHandler } from 'react-native'
import { SpanText } from "../../../../Components/Texts";


export default function VideoPlayer(props: IPostItem) {
    const { background2, text } = useThemeColors()
    const { src, thumb } = props

    //Refs
    const video = useRef<Video>();
    //States
    const [status, setStatus] = useState({});
    const [onVideoBuffer, setonVideoBuffer] = useState(true)
    const [onVideoLoading, setonVideoLoading] = useState(true)
    //
    const [isShwoingControls, setisShwoingControls] = useState<boolean>()
    const { setData, states: NJS } = useDataContext()
    //
    const onVideoError = (e: any) => {
        setData?.('states', 'isHeaderHidden', false)
    }
    //
    const onVideoLoaded = () => {
        setonVideoLoading(false)
        setData?.('states', 'isHeaderHidden', true)
    }
    //
    const onVideoLoadStart = () => {
        setonVideoLoading(true)
        setData?.('states', 'isHeaderHidden', true)
    }
    //Handlers //
    const handleToggleHeader = () => {
        setData('states', 'isHeaderHidden', !NJS?.states?.isHeaderHidden)
    }
    const handleBackPress = () => {
        setData('states', 'isHeaderHidden', false)
        return false
    }

    //Effects
    useEffect(() => {
        video.current?.setState({
            showPoster: true,
        })

        video.current?.loadAsync({
            uri: src,
        })

        const BHND = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        return () => {
            BHND.remove()
        }
    }, [])




    const PlayerControls = (
        <ContainerBlock>

        </ContainerBlock>
    )

    return (
        <ContainerBlock style={{ position: 'relative', padding: 0, zIndex: 1, backgroundColor: background2, elevation: 20, shadowColor: text }}>
            <Overlay
                hidden={!onVideoBuffer || !onVideoLoading}
                imageSource={thumb}
            />
            {!isShwoingControls || PlayerControls}
            <Video
                posterSource={{ uri: thumb }}
                style={{ width: '100%', aspectRatio: '16/9' }}
                // source={{ uri: src, }}
                useNativeControls={!onVideoBuffer || !onVideoLoading}
                resizeMode={ResizeMode.CONTAIN}
                onLoad={onVideoLoaded}
                onLoadStart={onVideoLoadStart}
                onError={onVideoError}
                ref={video}
                onPlaybackStatusUpdate={status => setStatus(() => status)}  // Can be a URL or a local file.
            />
        </ContainerBlock>
    )
}