import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useMemo, useState } from 'react'
import { HeadLine, SpanText } from '../../../Components/Texts'
import useThemeColors from '../../../Hooks/useThemeColors'
import { useAuthContext } from '../../../Contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from '../../../Helpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../../Interfaces';
import { REQUESTS_API } from '@env';
import PostItem from '../../__/PostsList/__/PostItem';
import { IPostType } from '../../../Interfaces/IPostContext';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

interface IAccount {
    postTypes: IPostType['types'],
    screenTabs: "video" | "audio" | "image" | 'article'
}

export const Empty = () => {
    const themeColors = useThemeColors()

    return (
        <View style={{ height: 340, paddingTop: 10 }}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <View style={{ width: 40, aspectRatio: 1, borderRadius: 50, backgroundColor: themeColors.background, opacity: .6 }} />
                </View>
                <View style={[styles.postContentWrapper, { backgroundColor: themeColors.background, opacity: .6 }]} />
            </View>
        </View>
    )
}

export default function Account() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const [isRefreshingPost, setisRefreshingPost] = useState(false)
    const [ActiveTab, setActiveTab] = useState<IAccount['screenTabs']>('video')
    const [index, setIndex] = useState(0)

    const tabs: IAccount['screenTabs'][] = [
        "video", 'audio', 'image', 'article'
    ]

    const posts = useQuery(
        ['user-posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}account-posts`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            },
        })
    )




    const [routes] = useState([
        { key: 'video', title: "Video", },
        { key: 'audio', title: 'music', },
        { key: 'image', title: 'Photos', },
        { key: 'article', title: 'article', },
    ]);

    const ListItemVideos = () => useMemo(() => (
        <FlatList
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            data={posts?.data?.data?.filter(post => (post.fileType === 'video'))}
            renderItem={({ item, index }) => <PostItem key={item?.puid} {...item} />}
        />
    ), [posts?.data?.data])

    const ListItemAudios = () => useMemo(() => (
        <FlatList
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            data={posts?.data?.data?.filter(post => (post.fileType === 'audio'))}
            renderItem={({ item, index }) => <PostItem key={item?.puid} {...item} />}
        />
    ), [posts?.data?.data])
    const ListItemImages = () => useMemo(() => (
        <FlatList
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            data={posts?.data?.data?.filter(post => (post.fileType === 'image'))}
            renderItem={({ item, index }) => <PostItem key={item?.puid} {...item} />}
        />
    ), [posts?.data?.data])
    const ListItemArticles = () => useMemo(() => (
        <FlatList
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            data={posts?.data?.data?.filter(post => (post.postType === 'ARTICLE'))}
            renderItem={({ item, index }) => <PostItem key={item?.puid} {...item} />}
        />
    ), [posts?.data?.data])

    const renderScene = SceneMap({
        video: ListItemVideos,
        audio: ListItemAudios,
        image: ListItemImages,
        article: ListItemArticles,
    });

    const handlePagerIndexChange = (index: number) => {
        setActiveTab(routes?.[index]?.key as any)
        setIndex(index)
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <PagerView
                style={[styles.pagerView, { backgroundColor: themeColors.background2 }]}
                initialPage={0}  >
                {useMemo(() =>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={handlePagerIndexChange}
                        // initialLayout={initialLayout}
                        renderTabBar={(props) => <TabBar
                            style={{ backgroundColor: themeColors.background, borderBottomColor: themeColors?.background2, borderBottomWidth: StyleSheet.hairlineWidth }}
                            inactiveColor={themeColors.text}
                            activeColor={themeColors.primary}
                            {...props}
                        />} />
                    , [ActiveTab, posts?.data?.data])}
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileData: {
        width: '100%',
        padding: 10
    },
    coverPhoto: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    profileContainerInnerOne: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        width: '100%',
        height: 70,
        marginTop: -35,
    },
    profilePicContainer: {
        width: 70,
        padding: 5,
        borderRadius: 50,
        borderWidth: 4,
    },
    profilDataFollow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    profilePicture: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    smallText: {
        fontSize: 12,
        textTransform: 'capitalize'
    },
    tagline: {
        fontSize: 16,
        marginTop: 8,
    },

    spaceBeteen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
    tabIndexButton: {
        height: 40,
        minWidth: 80,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    tabIndexButtonUnderline: {
        height: 6,
        backgroundColor: 'red'
        , borderTopLeftRadius: 50
        , borderTopRightRadius: 50,
        width: '100%',
        position: 'absolute',
        bottom: -1,
        opacity: .5
    },
    pagerView: {
        flex: 1,
    },
    scene: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postWrapper: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        flexGrow: 1
    },
    postContentWrapper: {
        flex: 1,
        height: '100%',
        paddingRight: 10,
        borderRadius: 10
    }
}); 
