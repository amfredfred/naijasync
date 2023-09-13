import { Image, StyleSheet, View } from "react-native";
import { IPostItem } from "../../../../Interfaces";

export default function ImageViewer(post: { source: string }) {

    return (
        <View style={[styles.constainer]}>
            <Image
                source={{ uri: post?.source }}
                resizeMethod='resize'
                resizeMode="contain"
                style={{width:'100%', flexGrow:1,flex:1}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        width: '100%',
        maxHeight: '100%',
        flexGrow:1,
    }
})