import TabSelector from "../../__/TabSelector";

import { useState, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import useThemeColors from "../../../Hooks/useThemeColors";
import { useDataContext } from "../../../Contexts/DataContext";
import React from 'react';
// import { BannerAd, BannerAdSize, TestIds, RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { ContainerBlock, ScrollContainer } from "../../../Components/Containers";
import { Button, IconButton } from "../../../Components/Buttons";
import { useNavigation } from "@react-navigation/native";
import PostsList from "../../__/PostsList";

export default function Home() {
    const { setData, states: NJS } = useDataContext()
    const colors = useThemeColors()
    const { navigate } = useNavigation()

    const [isRewardAdReady, setisRewardAdReady] = useState(false)
    const [hasEarnedRewards, sethasEarnedRewards] = useState(false)

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

    const expTabs = [
        { title: 'Home', exploring: "all" },
        { title: 'Comedy', exploring: "comedy " },
        { title: 'Action', exploring: "action movies" },
        { title: 'Sci-Fi', exploring: "sci-fi movies" },
        { title: 'Nollywood', exploring: "nollywood movies" },
    ]

    return (
        <ContainerBlock style={{ flex: 1, padding: 0 }}>
            {/* <ContainerBlock style={{ paddingHorizontal:0,   }}>
                <ScrollContainer
                    horizontal
                    contentContainerStyle={{ gap: 10, }}>
                    {expTabs.map((ETab, index) =>
                        <IconButton
                            key={index}
                            onPress={() => handleNavigateexplore(ETab.exploring)}
                            title={ETab.title}
                            active={index == 0} />
                    )}
                </ScrollContainer>
            </ContainerBlock>

            <ContentTables /> */}

            <PostsList />

        </ContainerBlock>
    )
}
