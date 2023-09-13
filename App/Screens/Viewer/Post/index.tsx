import { useMemo } from "react";
import ThemedModal from "../../../Components/Modals";
import { IPostItem } from "../../../Interfaces";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import ExplorerPostItemWrapper from "../../Explorer/Wrapper";
import ProfileAvatar from "../../../Components/ProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "../../../Components/Buttons";
import useThemeColors from "../../../Hooks/useThemeColors";
import ImageViewer from "./Image";
import { REQUESTS_API } from "@env";
import LikeButton from "../../__/PostsList/__/PostItem/Like";
import PostExplorerFooting from "../../Explorer/Wrapper/Footing";

type IPostViewer = IPostItem & {
    onClose?(): void
}

export default function PostViewer(post: IPostViewer) {

    const { onClose, onPress } = post
    const { height } = useWindowDimensions()
    const { } = useNavigation()
    const themeColors = useThemeColors()

    const onRequestClose = () => {
        onClose?.()
    }

    console.log(post?.fileType, 'post type')

    const RenderPost = () => {
        switch (post?.postType) {
            case 'UPLOAD': {
                switch (post?.fileType) {
                    case 'image':
                        return <ImageViewer source={`${REQUESTS_API}${post?.fileUrl}`} />
                    default:
                        break;
                }

            }
            default:
                break;
        }
    }

    const postHeading = (
        <View style={[styles?.viewerHeading]}>
            <IconButton
                onPress={onRequestClose}
                icon={<Ionicons size={30} name='arrow-back' />}
            />
            <ProfileAvatar {...post?.owner} />
        </View>
    )

    const postContent = (
        <ScrollView style={[styles.postContent]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ maxHeight: '100%', flexGrow: 1 }}>
            <View style={{ flexGrow: 1 }}>
                {RenderPost()}
            </View>
        </ScrollView>
    )

    const posFooting = (
        <View style={[styles.posFooting]}>
            <PostExplorerFooting {...post} />
        </View>
    )

    return useMemo(() => (
        <ThemedModal
            hideBar
            onRequestClose={onRequestClose}
            visible={Boolean(post?.puid)} >
            <View style={{ backgroundColor: themeColors.background, height }}>
                {postHeading}
                {postContent}
                {posFooting}
            </View>
        </ThemedModal>
    ), [post?.puid])
}

const styles = StyleSheet.create({
    viewerHeading: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    postContent: {
        flex: 1,
        width: '100%',
    },
    posFooting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})