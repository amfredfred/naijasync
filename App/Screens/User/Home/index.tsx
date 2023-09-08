import { useState } from 'react';
import useThemeColors from "../../../Hooks/useThemeColors";
import { useDataContext } from "../../../Contexts/DataContext";
import React from 'react';
// import { BannerAd, BannerAdSize, TestIds, RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useNavigation } from "@react-navigation/native";
import PostsList from "../../__/PostsList";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../../Interfaces';
import { useAuthContext } from '../../../Contexts/AuthContext';
import { useEffect } from 'react'
import { REQUESTS_API } from '@env';
import SlideCarousel from '../../../Components/SlideCarousel';
import { Videos } from "../../../dummy-data";

export default function Home() {
    const { setData, states: NJS } = useDataContext()
    const colors = useThemeColors()
    const authContext = useAuthContext()
    const { navigate } = useNavigation()

    const [isRewardAdReady, setisRewardAdReady] = useState(false)
    const [hasEarnedRewards, sethasEarnedRewards] = useState(false)
    const [isRereshing, setIsRereshing] = useState(false)

    const handleNavigateexplore = (genre: string) => {
        (navigate as any)?.("Explorer", { genre });
        setData('states', 'isHeaderHidden', true);
    }

    // const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
    // const adRewadedUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

    // const rewarded = RewardedAd.createForAdRequest(adRewadedUnitId, {
    //     requestNonPersonalizedAdsOnly: true,
    //     keywords: ['fashion', 'clothing'],
    // });

    // useEffect(() => {
    //     const subscribe = rewarded.addAdEventListener(RewardedAdEventType.LOADED, (status) => {
    //         setisRewardAdReady(true)
    //         console.log("READY", status)
    //     })
    //     const earned_rewards = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (status) => {
    //         setisRewardAdReady(false)
    //         sethasEarnedRewards(true)
    //         console.log("EARNED_REWRADS", status)
    //     })
    //     const rewards_ad_error = rewarded.addAdEventListener(AdEventType.ERROR, (status) => {
    //         console.log("ERROR OCCURED: HERE", status)
    //     })
    //     rewarded.load()
    //     return () => {
    //         subscribe
    //         earned_rewards
    //         rewards_ad_error
    //         sethasEarnedRewards(false)
    //     }
    // }, [hasEarnedRewards])

    // const showREwardedAd = async () => {
    //     if (isRewardAdReady) {
    //         console.log("REWARDS AD READY")
    //         await rewarded.show()
    //     } else {
    //         console.log("REWARDS ADS NOT READY")
    //     }
    // }

    const posts = useQuery(
        ['posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}posts?username=${authContext?.user?.account?.username}`,
            method: 'GET',
        }),
        {
            getNextPageParam: (lastPage) => (lastPage as any).next_page_url,
        }
    )

    useEffect(() => {
        switch (posts?.status) {
            case 'loading':
                setIsRereshing(true)
                break;
            case 'success':
                setIsRereshing(false)
                break;
            case 'error':
                setIsRereshing(false)
                posts.remove()
                break;
            default:
                setIsRereshing(false)
                break;
        }
        return () => {
            // posts.remove()
        }
    }, [posts.status])


    const Post = (
        <SlideCarousel
            headline='Hollywood'
            items={Videos} />
    )
    
    return (
        <PostsList
            invertStickyHeaders
            stickyHeaderHiddenOnScroll
            ListHeaderComponent={Post}
            list={(posts?.data?.data as any)?.data ?? []}
            onRefresh={posts?.refetch}
            isRefrehing={posts?.isFetching} />
    )
}
