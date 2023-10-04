import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { IPostItem } from "../../../../../Interfaces";
import { REQUESTS_API } from "@env";
import { useState } from "react";
import PresentMedia from "../../../../Viewer/Post/PresentMedia";
import useEndpoints from "../../../../../Hooks/useEndpoints";

export default function PostImageItemList(post: IPostItem) {

    const [isPresentingMedia, setisPresentingMedia] = useState(false)
    const { requestUrl } = useEndpoints()

    return (
        <TouchableOpacity
            onPress={() => setisPresentingMedia(true)}
            style={[styles.mediaDisplayWrapper, {}]}>
            <Image
                source={{ uri: requestUrl(post?.thumbnailUrl ?? post?.fileUrl) }}
                resizeMethod='auto'
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
            />
            {isPresentingMedia && (<PresentMedia onClose={() => setisPresentingMedia(false)}   {...post} />)}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mediaDisplayWrapper: {
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 10,
        aspectRatio: 1,
    }
})