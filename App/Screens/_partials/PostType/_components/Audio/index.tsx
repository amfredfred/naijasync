import { View, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native"
import { IPostItem } from "../../../../../Interfaces"
import { useMediaPlaybackContext } from "../../../../../Contexts/MediaPlaybackContext"
import { Ionicons } from "@expo/vector-icons"
import { SpanText } from "../../../../../Components/Texts"
import { useState } from "react"
import PresentMedia from "../../../../Viewer/Post/PresentMedia"
import useEndpoints from "../../../../../Hooks/useEndpoints"

export default function PostAudioItemList(post: IPostItem) {
    const mP = useMediaPlaybackContext()
    const [isPresentingMedia, setisPresentingMedia] = useState(false)
    const { requestUrl } = useEndpoints()


    const PlayPause = () => {
        // setIsPlaying(!isPlaying);
        if (mP?.fileUrl === post?.fileUrl) {
            if (mP?.states?.playState === 'playing') {
                mP?.pause()
            } else {
                mP?.play()
            }
        } else
            mP?.connect(post)
    };

    return (
        <TouchableOpacity
            onPress={() => setisPresentingMedia(true)}
            style={styles.container}>
            <View
                style={[styles.spaceBetween, { padding: 0, flex: 1 }]} >
                <View style={[styles.spaceBetween, { padding: 0, flex: 1 }]}>
                    <Image
                        style={{ width: 140, aspectRatio: '16/9', borderRadius: 10 }}
                        source={{ uri: requestUrl(post?.thumbnailUrl) }} />
                    <SpanText >{mP?.fileUrl === post?.fileUrl ? Number(mP?.states?.progress > 0 ? mP?.states?.progress : 0) : 0}% / {post?.duration}</SpanText>
                </View>
                <TouchableOpacity style={[styles.playButton]} onPress={PlayPause}>
                    <ImageBackground
                        blurRadius={100}
                        style={{ width: 80, aspectRatio: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        source={{ uri: requestUrl(post?.thumbnailUrl) }}>
                        <Ionicons name={mP?.fileUrl === post?.fileUrl ? (mP.states?.playState === 'playing' ? 'pause-circle' : 'play-circle') : 'play-circle'} size={50} color="white" />
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            {isPresentingMedia && (<PresentMedia onClose={() => setisPresentingMedia(false)}   {...post} />)}
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    playButton: {
        borderRadius: 50,
        overflow: 'hidden'
    }
})