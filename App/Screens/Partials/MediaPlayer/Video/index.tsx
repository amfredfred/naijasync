import { useEffect, useRef, useState } from "react";
import { Video, ResizeMode } from 'expo-av'
import { IPostItem } from "../../../../Interfaces";
import { ContainerBlock, Overlay } from "../../../../Components/Containers";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { Image } from "react-native";
import { Button } from "../../../../Components/Buttons";
import { SpanText } from "../../../../Components/Texts";


export default function VideoPlayer(props: IPostItem) {
    const { background2 } = useThemeColors()
    const { src, thumb } = props
    const video = useRef<Video>();
    const [status, setStatus] = useState({});
    const [onVideoBuffer, setonVideoBuffer] = useState(true)
    const [onVideoLoading, setonVideoLoading] = useState(true)
    //
    const [isShwoingControls, setisShwoingControls] = useState<boolean>()

    useEffect(() => {
        video.current?.setState({
            showPoster: true,
        })
    }, [])


    const PlayerControls = (
        <ContainerBlock>

        </ContainerBlock>
    )

    return (
        <ContainerBlock style={{ position: 'relative', padding: 0, backgroundColor: background2 }}>
            <Overlay
                hidden={!onVideoBuffer || !onVideoLoading}
                imageSource={thumb}
            />
            {!isShwoingControls || PlayerControls}
            <Button title="HEY" children={<SpanText>Hidee</SpanText>} onPress={() => { }} />
            <Video
                posterSource={{ uri: thumb }}
                style={{ width: '100%', aspectRatio: '16/9' }}
                source={{ uri: src, }}
                useNativeControls={!onVideoBuffer || !onVideoLoading}
                resizeMode={ResizeMode.CONTAIN}
                onLoad={() => setonVideoLoading(false)}
                onLoadStart={() => setonVideoLoading(true)}
                onPlaybackStatusUpdate={status => setStatus(() => status)}  // Can be a URL or a local file.
            />
        </ContainerBlock>
    )
}