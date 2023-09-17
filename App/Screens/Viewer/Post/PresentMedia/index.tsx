import { useEffect, useState, } from "react";
import ThemedModal from "../../../../Components/Modals";
import { IPostItem } from "../../../../Interfaces";
import { ScrollView, StyleSheet, View, useWindowDimensions, Animated as RNAnimated, TouchableOpacity } from "react-native";
import ProfileAvatar from "../../../../Components/ProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "../../../../Components/Buttons";
import useThemeColors from "../../../../Hooks/useThemeColors";
import ImagePresent from "./Image";
import { REQUESTS_API } from "@env";
import usePostForm from "../../../../Hooks/usePostForms";
import React from 'react';
import { BannerAd, BannerAdSize, TestIds, useRewardedAd } from 'react-native-google-mobile-ads';
import VideoPresent from "./Video";
import useMediaPlayback from "../../../../Hooks/usemediaPlayback";
import PostExplorerFooting from "../../../Explorer/Wrapper/Footing";
import { TextExpandable } from "../../../../Components/Texts";
import { LinearGradient } from "expo-linear-gradient";
import { useRewardedInterstitialAd } from "react-native-google-mobile-ads";
import { useAuthContext } from "../../../../Contexts/AuthContext";
import { getRandomBoolean } from "../../../../Helpers";



type PresentMedia = IPostItem & {
    onClose?(): void
}

export default function PresentMedia(post: PresentMedia) {
    //ads rewarded video
    const RewardedAdsId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    const bannerAdId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    const RewarededInterStitialId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    // rewarded
    const rewardedVideoAd = useRewardedAd(RewardedAdsId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['clothing', 'technology'],
    })
    //rewarded interstitial ads
    const rewardedInterstitialAd = useRewardedInterstitialAd(RewarededInterStitialId, {
        requestNonPersonalizedAdsOnly: true
    })

    const { onClose, onPress } = post
    const { height } = useWindowDimensions()
    const themeColors = useThemeColors()
    const postForm = usePostForm()
    const authContext = useAuthContext()
    const [isPostFocused, setIsPostFocused] = useState(false)
    const [isBannerAdVisible, setisBannerAdVisible] = useState(true)

    useEffect(() => {
        console.log("LOADING ADS")
        if (!rewardedInterstitialAd.isLoaded)
            rewardedInterstitialAd.load()
        if (!rewardedVideoAd?.isLoaded)
            rewardedVideoAd.load()
    }, [post?.fileUrl, rewardedVideoAd.load, rewardedInterstitialAd.load])

    //sharing rewards from ads
    useEffect(() => {
        if (rewardedInterstitialAd?.reward?.amount || rewardedVideoAd?.reward) {
            postForm?.methods?.updatePost({
                rewards: ((rewardedInterstitialAd?.reward?.amount ?? rewardedVideoAd?.reward?.amount / 100) * 70).toFixed(3),
                puid: post?.puid
            })
            // reward the  user
            if (authContext?.user?.person === 'isAuthenticated') {
                authContext?.updateAccount({
                    points: (rewardedInterstitialAd?.reward?.amount ?? rewardedVideoAd?.reward?.amount / 100) * 30
                })
            }
        }
    }, [rewardedInterstitialAd?.isClosed, rewardedVideoAd?.isClosed])

    const showREwardedAd = async () => {
        if (getRandomBoolean())
            try {
                if (rewardedVideoAd?.isLoaded) {
                    console.log("LOADED rewardedVideoAd")
                    rewardedVideoAd.show()
                } else if (rewardedInterstitialAd?.isLoaded) {
                    console.log("LOADED rewardedInterstitialAd")
                    rewardedInterstitialAd?.show({ immersiveModeEnabled: true })
                } else {
                    console.log("REWARDS ADS NOT READY")
                }
            } catch (error) {
                console.log("PRESENT_MEDIA_REWARDED_VIDEO_ERROR -> ", error)
            }
        else
            console.log('not showing ads this time')
        onClose?.()
    }


    let pressTimeout = undefined;
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


    const onRequestClose = async () => showREwardedAd()

    useEffect(() => {
        postForm?.methods?.updatePost({ 'views': 1, puid: post?.puid })
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


    const postFooting = (
        <LinearGradient
            colors={['transparent', 'transparent', 'black']}
            style={[styles.posFooting]}>
            <TextExpandable
                hidden={!post?.description}
                style={{ padding: 10, paddingBottom: 5 }}
                children={post?.description} />
            {isBannerAdVisible && <View style={[styles.bannerAdContainer, { overflow: 'hidden' }]}>
                <BannerAd
                    unitId={bannerAdId}
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
                {isPostFocused || postFooting}
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
})