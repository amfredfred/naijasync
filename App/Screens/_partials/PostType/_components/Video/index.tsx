import { View, TouchableOpacity, Image, StyleSheet } from "react-native"
import { IPostItem } from "../../../../../Interfaces"
import { useMediaPlaybackContext } from "../../../../../Contexts/MediaPlaybackContext"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import PresentMedia from "../../../../Viewer/Post/PresentMedia"
import { useNavigation } from "@react-navigation/native"
import useEndpoints from "../../../../../Hooks/useEndpoints"

export default function PostVideoItemList(post: IPostItem) {
    const mediaContext = useMediaPlaybackContext()
    const [isPresentingMedia, setisPresentingMedia] = useState(false)
    const { navigate } = useNavigation()
    const { requestUrl } = useEndpoints()

    return (
        <View style={[styles.mediaDisplayWrapper, {}]}>
            <TouchableOpacity
                activeOpacity={.7}
                onPress={() => setisPresentingMedia(true)}
                style={{ position: 'relative', height: '100%', width: '100%' }}>
                <Image
                    style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                    source={{ uri: requestUrl(post?.thumbnailUrl??post?.fileUrl) }}
                    resizeMethod='resize'
                    resizeMode='cover' />
            </TouchableOpacity>
            <View style={[styles.spaceBetween, styles.playPauseiconContainer]}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => (navigate as any)?.('PlayVideo', { post })}
                    style={[styles.allIconStyle]}>
                    <Ionicons
                        name='play-circle'
                        color={'aliceblue'}
                        size={40}
                        style={[{}]} />
                </TouchableOpacity>
            </View>
            {isPresentingMedia && (<PresentMedia onClose={() => setisPresentingMedia(false)}   {...post} />)}
        </View>
    )
}

const styles = StyleSheet.create({
    playPauseiconContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        bottom: 0,
        padding: 10,
        position: 'absolute',
        zIndex: 50
    },
    allIconStyle: {
        borderRadius: 50,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        gap: 10
    },
    mediaDisplayWrapper: {
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 10,
        aspectRatio: 1,
    }
})