import { Image, StyleSheet, View } from "react-native";
import { IPostItem } from "../../../../../Interfaces";
import { useMediaPlaybackContext } from "../../../../Statics/MediaViewer/Context";
import { ResizeMode, Video } from "expo-av";
import { useEffect } from "react";
import { REQUESTS_API } from "@env";

export default function VideoPresent(post: IPostItem) {

    const mediaContext = useMediaPlaybackContext()

    useEffect(() => {
         
    }, [post?.fileUrl])

    console.log(mediaContext?.states)

    return (
        <View style={[styles.constainer]}>
            <Video
                source={{ uri: `${REQUESTS_API}${post?.fileUrl}` }}
                resizeMode={ResizeMode?.CONTAIN}
                shouldPlay
                useNativeControls
                ref={mediaContext?.mediaRef}
                style={{ width: '100%', flexGrow: 1, flex: 1 , backgroundColor:'green'}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        width: '100%',
        maxHeight: '100%',
        flexGrow: 1,
        backgroundColor:'red'
    }
})