import { useEffect, useMemo, useState, createRef } from "react";
import ThemedModal from "../../../../Components/Modals";
import { IPostItem } from "../../../../Interfaces";
import { ScrollView, StyleSheet, View, useWindowDimensions, Animated as RNAnimated, TouchableOpacity } from "react-native";
import ProfileAvatar from "../../../../Components/ProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "../../../../Components/Buttons";
import useThemeColors from "../../../../Hooks/useThemeColors";
import ImagePresent from "./Image";
import { REQUESTS_API } from "@env";
import PostExplorerFooting from "../../../Explorer/Wrapper/Footing";
import usePostForm from "../../../../Hooks/usePostForms";
import React, { useRef } from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { TextExpandable } from "../../../../Components/Texts";
import PostItemMenu from "../../../_partials/PostMenu";
import { useMediaPlaybackContext } from "../../../Statics/MediaViewer/Context";
import VideoPresent from "./Video";


type PresentMedia = IPostItem & {
    onClose?(): void
}

export default function PresentMedia(post: PresentMedia) {

    //ads
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    const [isBannerAdVisible, setisBannerAdVisible] = useState(true)
    const mediaContext = useMediaPlaybackContext()

    const { onClose, onPress } = post
    const { height } = useWindowDimensions()
    const { } = useNavigation()
    const themeColors = useThemeColors()
    const postForm = usePostForm()

    const [isPostFocused, setIsPostFocused] = useState(false)

    let pressTimeout;

    const handleOnPress = () => {
        // Check the press duration to determine if it's a long-press or a short press
        pressTimeout = setTimeout(() => {

        }, 100); // Adjust the duration as needed

        setIsPostFocused(!isPostFocused);
    };

    const handleOnLongPress = () => {
        // Clear the pressTimeout to prevent toggling on long-press
        clearTimeout(pressTimeout);
        // Handle long-press here, or leave it empty if you don't want to do anything
    };

    const onRequestClose = () => {
        onClose?.()
    }

    useEffect(() => {
        postForm?.methods?.updatePost({ 'views': 1, puid: post?.puid })
        console.log('reloaded')
    }, [])

    const RenderPost = () => {
        switch (post?.postType) {
            case 'UPLOAD': {
                switch (post?.fileType) {
                    case 'image':
                        return <ImagePresent source={`${REQUESTS_API}${post?.fileUrl}`} />
                    case 'video':
                        return <VideoPresent {...post} />
                    default:
                        break;
                }

            }
            default:
                break;
        }
    }

    const postHeading = (
        <View style={[styles?.viewerHeading, { zIndex: 10, }]}>
            <IconButton
                onPress={onRequestClose}
                icon={<Ionicons size={30} name='arrow-back' />}
            />
            <ProfileAvatar {...post?.owner} avatarOnly />
        </View>
    )

    const postContent = (
        <ScrollView style={[styles.postContent]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ maxHeight: '100%', flexGrow: 1 }}>
            <RNAnimated.View
                style={{ flexGrow: 1 }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={handleOnLongPress}
                    onPress={handleOnPress}
                    style={{ flexGrow: 1 }}>
                    {RenderPost()}
                </TouchableOpacity>
            </RNAnimated.View>
        </ScrollView>
    )

    const posFooting = (
        <View style={[styles.posFooting]}>
            {
                post?.description && (
                    <TextExpandable
                        hidden={!post?.description} style={{ fontSize: 17, lineHeight: 23, padding: 10, paddingBottom: 5 }} children={post?.description} />
                )
            }
            {isBannerAdVisible && <View style={[styles.bannerAdContainer, { overflow: 'hidden' }]}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
                <IconButton onPress={() => setisBannerAdVisible(false)} icon={<Ionicons name="close" />} />
            </View>}
            <PostExplorerFooting {...post} />
        </View>
    )

    return useMemo(() => (
        <ThemedModal
            hideBar
            animationType='fade'
            onRequestClose={onRequestClose}
            visible={Boolean(post?.puid)} >
            <View style={{ backgroundColor: themeColors.background, height }}>
                {isPostFocused || postHeading}
                {postContent}
                {isPostFocused || posFooting}
            </View>
        </ThemedModal>
    ), [post?.puid, isPostFocused, isBannerAdVisible])
}

const styles = StyleSheet.create({
    viewerHeading: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    postContent: {
        flex: 1,
        width: '100%',
        zIndex: -1
    },
    bannerAdContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    posFooting: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        overflow: 'hidden'
    }
})