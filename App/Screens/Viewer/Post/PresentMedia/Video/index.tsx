import { StyleSheet, View } from "react-native";
import { IPostItem } from "../../../../../Interfaces";
import { ResizeMode, Video } from "expo-av";
import { useEffect, } from "react";
import { Overlay } from "../../../../../Components/Containers";
import MediaPlayerControls from "../../../../_partials/MediaProgressBar";
import PlayButton from "../../../../_partials/PlayButton";
import { useMediaPlaybackContext } from "../../../../../Contexts/MediaPlaybackContext";
import useEndpoints from "../../../../../Hooks/useEndpoints";


export default function VideoPresent(post: IPostItem) {

    const mediaContext = useMediaPlaybackContext()
    const { requestUrl } = useEndpoints()
    useEffect(() => { mediaContext?.connect({ ...post, presenting: true }) }, [post?.fileUrl])
    return (
        <View style={[styles.constainer]}>
            <View style={{ position: 'relative', flex: 1 }}>
                <Overlay
                    hidden={mediaContext.states?.playState !== 'loading'}
                    imageProps={{
                        resizeMethod: 'resize',
                        resizeMode: 'contain',
                        source: { uri: requestUrl(post?.thumbnailUrl) }
                    }}
                />
                <Video
                    resizeMode={ResizeMode?.CONTAIN}
                    ref={mediaContext?.mediaRef}
                    style={{ width: '100%', flexGrow: 1, flex: 1 }}
                />
            </View>
            <View style={{ height: 35, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15 }}>
                <View style={{ flex: 1 }}>
                    <MediaPlayerControls hidden={!mediaContext?.mediaRef?.current}  {...mediaContext} />
                </View>
                <PlayButton  {...mediaContext} />
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