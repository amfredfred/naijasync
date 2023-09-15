import { StyleSheet,View } from "react-native";
import { IPostItem } from "../../../../../Interfaces";
import { useMediaPlaybackContext } from "../../../../Statics/MediaViewer/Context";
import { ResizeMode, Video } from "expo-av";
import { useEffect } from "react";
import { REQUESTS_API } from "@env";
import { Overlay } from "../../../../../Components/Containers";


export default function VideoPresent(post: IPostItem) {

    const mediaContext = useMediaPlaybackContext()

    useEffect(() => {

        mediaContext?.connect({ ...post, presenting: true })

        return () => {
            mediaContext?.remove()
        }

    }, [post?.fileUrl])

    return (
        <View  style={[styles.constainer]}>

            <View style={{ position: 'relative', flex: 1 }}>
                <Overlay
                    hidden={mediaContext.states?.playState !== 'loading'}
                    imageProps={{
                        resizeMethod: 'resize',
                        resizeMode: 'contain',
                        source: { uri: `${REQUESTS_API}${post?.thumbnailUrl}` }
                    }}
                />
                <Video
                    resizeMode={ResizeMode?.CONTAIN}
                    ref={mediaContext?.mediaRef}
                    shouldPlay
                    style={{ width: '100%', flexGrow: 1, flex: 1 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        position: 'relative'
    }
})