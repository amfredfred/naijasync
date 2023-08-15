import TabSelector from "../../Partials/TabSelector";
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import useThemeColors from "../../../Hooks/useThemeColors";
import ContentTables from "../../Partials/ContentTables";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useDataContext } from "../../../Contexts/DataContext";
import { useEffect } from 'react'
import React from 'react';
// import { BannerAd, BannerAdSize, TestIds, RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { ContainerBlock, ScrollContainer } from "../../../Components/Containers";
import { Button, IconButton } from "../../../Components/Buttons";
import { useNavigation } from "@react-navigation/native";

const ComingSoon = () => (
    <View style={styles.scene}>
        <Text>Coming Soon!!! 🚀🚀🚀🌟</Text>
    </View>
);

export default function Home() {
    const { setData, states: NJS } = useDataContext()
    const colors  =  useThemeColors()
    const { navigate } = useNavigation()
    const [routes] = useState([
        { key: 'movies', title: 'movies' },
        { key: 'music', title: 'music' },
        { key: 'betting', title: 'betting' },
        { key: 'more', title: 'more...' },
    ]);
    const expTabs = [
        { title: 'Home', exploring: "all" },
        { title: 'Comedy', exploring: "comedy " },
        { title: 'Action', exploring: "action movies" },
        { title: 'Sci-Fi', exploring: "sci-fi movies" },
        { title: 'Nollywood', exploring: "nollywood movies" },
    ]

    const [isRewardAdReady, setisRewardAdReady] = useState(false)
    const [hasEarnedRewards, sethasEarnedRewards] = useState(false)

    const renderScene = SceneMap({
        movies: ContentTables,
        music: ComingSoon,
        betting: ComingSoon,
        more: () => TabSelector({ 'hidden': false })
    });

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

    return (
        <ContainerBlock style={{ flex: 1,padding:0 }}>
            <ContainerBlock style={{ paddingHorizontal:0,   }}>
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

            <ContentTables />

            {/* <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(event) => setIndex(event.nativeEvent.position)}
                onPageScroll={(data) => handleScroll(data as any)}  >
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    renderTabBar={(props) => <TabBar
                        style={{ backgroundColor: 'transparent', }}
                        inactiveColor={colors.text}
                        activeColor={colors.accent}
                        {...props}
                    />} />
            </PagerView> */}

        </ContainerBlock>
    )
}



const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
