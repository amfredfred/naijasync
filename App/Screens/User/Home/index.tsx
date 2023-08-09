import TabSelector from "../../Partials/TabSelector";
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import useThemeColors from "../../../Hooks/useThemeColors";
import ContentTables from "../../Partials/ContentTables";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";


const ComingSoon = () => (
    <View style={styles.scene}>
        <Text>Coming Soon!!! 🚀🚀🚀🌟</Text>
    </View>
);


const initialLayout = { width: Dimensions.get('window').width };
export default function Home() {

    const colors = useThemeColors()
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'movies', title: 'movies 🎞️' },
        { key: 'music', title: 'music 🎶' },
        { key: 'betting', title: 'betting 🎲' },
        { key: 'more', title: 'more... 📃' },
    ]);

    const renderScene = SceneMap({
        movies: ContentTables,
        music: ComingSoon,
        betting: ComingSoon,
        more: () => TabSelector({ 'hidden': false })
    });

    const translateY = useRef().current;

    const handleScroll = ({ position, offset }) => {
        // Animated.event(
        //     [{ nativeEvent: { contentOffset: { y: translateY } } }],
        //     { useNativeDriver: false }
        // );

        console.log(position)
    }

    return (
        <PagerView
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
                    style={{ backgroundColor: colors.headerBackgorund, }}
                    inactiveColor={colors.text}
                    activeColor={colors.accent}
                    {...props}
                />}
            />
        </PagerView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue'
    },
    pagerView: {
        flex: 1,
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
