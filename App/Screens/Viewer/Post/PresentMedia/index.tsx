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
import { TextExpandable } from "../../../../Components/Texts";
import { BannerAd, BannerAdSize, TestIds, RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useMediaPlaybackContext } from "../../../Statics/MediaViewer/Context";
import VideoPresent from "./Video";
import MediaPlayerControls from "../../../_partials/PlayerControls";
import { LinearGradient } from "expo-linear-gradient";


type PresentMedia = IPostItem & {
    onClose?(): void
}

export default function PresentMedia(post: PresentMedia) {

    //ads
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    const [isBannerAdVisible, setisBannerAdVisible] = useState(true)
    const mediaContext = useMediaPlaybackContext()
    const [isRewardAdReady, setisRewardAdReady] = useState(false)
    const [hasEarnedRewards, sethasEarnedRewards] = useState(false)

    const { onClose, onPress } = post
    const { height } = useWindowDimensions()
    const { } = useNavigation()
    const themeColors = useThemeColors()
    const postForm = usePostForm()

    const [isPostFocused, setIsPostFocused] = useState(false)

    let pressTimeout;

    const adRewadedUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

    const rewarded = RewardedAd.createForAdRequest(adRewadedUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['clothing', 'technology'],
    });

    useEffect(() => {
        const unsubscribe_subscribe = rewarded.addAdEventListener(RewardedAdEventType.LOADED, (status) => {
            setisRewardAdReady(true)
            console.log("READY", status)
        })
        const unsubscribe_earned_rewards = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (status) => {
            setisRewardAdReady(false)
            sethasEarnedRewards(true)
            postForm?.methods?.updatePost({ rewards: (status?.amount / 4).toFixed(1), puid: post?.puid })
            console.log("EARNED_REWRADS", status)
        })

        rewarded.load()
        return () => {
            unsubscribe_subscribe()
            unsubscribe_earned_rewards()
            sethasEarnedRewards(false)
            setisRewardAdReady(false)
        }
    }, [])

    const showREwardedAd = async () => {
        try {
            if (isRewardAdReady) {
                console.log("REWARDS AD READY")
                await rewarded.show()
            } else {
                console.log("REWARDS ADS NOT READY")
            }
        } catch (error) {
            console.log("PRESENT_MEDIA_REWARDED_VIDEO_ERROR -> ", error)
        }
    }

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


    const onRequestClose = async () => {
        console.log(isRewardAdReady, rewarded.loaded, ':: rewaded ad satte')
        showREwardedAd()
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
                    activeOpacity={1}
                    onLongPress={handleOnLongPress}
                    onPress={handleOnPress}
                    style={{ flexGrow: 1 }}>
                    {RenderPost()}
                </TouchableOpacity>
            </RNAnimated.View>
        </ScrollView>
    )

    const posFooting = (
        <LinearGradient
            colors={['transparent', 'transparent', 'black']}
            style={[styles.posFooting]}>
            <View style={{ height: 35 }}>
                <MediaPlayerControls
                    hidden={!mediaContext?.mediaRef?.current}
                    {...mediaContext?.states}
                    Button={
                        <IconButton
                            onPress={mediaContext.states.playState === 'playing' ? mediaContext?.pause : mediaContext.play}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            style={{ width: 35, backgroundColor: 'transparent' }}
                            icon={<Ionicons
                                name={mediaContext?.states?.playState === 'playing' ? 'pause' : 'play'}
                                color={'white'}
                                size={35}
                            />}
                        />
                    } />
            </View>
            <TextExpandable
                hidden={!post?.description}
                style={{ padding: 10, paddingBottom: 5 }}
                children={post?.description} />
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
        </LinearGradient>
    )

    return (
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
    )
}
    

const styles = StyleSheet.create({
    viewerHeading: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
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
        bottom: 0,
        position: 'absolute', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius:20
    }
})