import { Video } from "expo-av";
import { Button, IconButton } from "../../../Components/Buttons";
import { ContainerBlock, ContainerFlex, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";
import { HeadLine, SpanText } from "../../../Components/Texts";
import { useDataContext } from "../../../Contexts/DataContext";
import { add, formatDuration, formatFileSize, formatPlaytimeDuration } from "../../../Helpers";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useEffect, useRef, useState } from 'react'
import { RefreshControl, FlatList, Dimensions, StyleSheet, Image, Pressable } from 'react-native'
import * as Library from 'expo-media-library'
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { APP_NAME } from '@env'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window')

const ComingSoon = () => (
    <ContainerBlock  >
        <SpanText>Coming Soon!!! 🚀🚀🚀🌟</SpanText>
    </ContainerBlock>
);


export default function Downloads() {
    const colors = useThemeColors()
    const { states } = useDataContext()
    const [isRefreshing, setIsRefreshing] = useState<boolean>()
    const [UserDownloads, setUserDownloads] = useState<{
        videos?: Library.AssetInfo[],
        audios?: Library.AssetInfo[],
        photos?: Library.AssetInfo[],
        others?: Library.AssetInfo[]
    }>({})
    const [index, setIndex] = useState(0)

    const {
        libPermision,
        handleLibPermisionsRequest,
        getMydownloads
    } = useMediaLibrary()

    const onRefresh = async () => {
        try {
            setIsRefreshing(true)
            const [videos, audios, photos, others] = await Promise.allSettled([
                getMydownloads(['video']),
                getMydownloads(['audio']),
                getMydownloads(['photo']),
                getMydownloads(['unknown'])
            ])
            const downloads = {}
            if (videos?.status === 'fulfilled')
                downloads['videos'] = videos.value
            if (audios?.status === 'fulfilled')
                downloads['audios'] = audios.value
            if (photos?.status === 'fulfilled')
                downloads['photos'] = photos.value
            if (others?.status === 'fulfilled')
                downloads['others'] = others.value
            setUserDownloads(downloads)
            setIsRefreshing(false)
        } catch (error) {
            setIsRefreshing(false)
            console.log("DOWNLOADS: ", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    const accessButton = (
        <ContainerBlock>
            <HeadLine
                children="Media Library Access"
                style={{ paddingHorizontal: 0, marginBottom: 10, fontSize: 40 }}
            />
            <SpanText
                children={`${APP_NAME} need access to your media library to show your photos and videos.`}
                style={{ fontSize: 18, fontWeight: '300', opacity: .7 }}
            />
            <Button
                onPress={handleLibPermisionsRequest}
                containerStyle={{ borderRadius: 50, backgroundColor: colors.accent, marginTop: 20, borderTopEndRadius: 10, borderTopStartRadius: 10 }}
                textStyle={{ textAlign: 'center', width: '100%', }}
                title={"Grant Media Access"} />
        </ContainerBlock>
    )

    const VideosList = () => (
        <FlatList
            bouncesZoom={false}
            bounces={false}
            contentContainerStyle={{
                justifyContent: 'space-between',
                paddingVertical: 10,
            }}
            data={UserDownloads.videos}
            renderItem={({ item }) => (
                <Pressable key={item.creationTime} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <ContainerBlock style={{ padding: 0, position: 'relative', borderRadius: 10 }}>
                        <Image
                            source={{ uri: item?.uri }}
                            height={90}
                            resizeMethod="resize"
                            resizeMode='contain'
                            style={{ aspectRatio: '16/9' }}
                        />
                        <SpanText
                            children={formatPlaytimeDuration(item.duration)}
                            numberOfLines={2}
                            style={{
                                marginBottom: 6, position: 'absolute', right: 5, bottom: 5, padding: 3, backgroundColor: 'rgba(0,0,0,0.6)',
                                lineHeight: 25, fontFamily: 'Montserrat_400Regular',
                            }} />
                    </ContainerBlock>
                    <ContainerBlock style={{ backgroundColor: 'transparent', paddingVertical: 0, overflow: 'hidden', flexGrow: 1, maxWidth: '60%' }}>
                        <SpanText
                            children={item.filename}
                            numberOfLines={2}
                            style={{ marginBottom: 6, lineHeight: 25, fontFamily: 'Montserrat_400Regular', }} />
                        <SpanText
                            children={dayjs(new Date(item.creationTime * 1000)).format('D MMM, YYYY')}
                            style={{ fontSize: 12, opacity: .6, fontFamily: 'Montserrat_400Regular', }}
                        />

                    </ContainerBlock>
                </Pressable>

            )}
            keyExtractor={({ id }) => id}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
    );



    useEffect(() => {
        onRefresh()
        console.log("REFRSHIGN FROM FGHJKSKGHDSJHDSDSD")
    }, [])

    //Tab

    const [routes] = useState([
        { key: 'vodeos', title: "movies", albumable: 'videos' },
        { key: 'music', title: 'music', albumable: 'audios' },
        { key: 'photos', title: 'Photos', albumable: 'photos' },
        { key: 'others', title: 'more...', albumable: 'unknown' },
    ]);

    const renderScene = SceneMap({
        vodeos: VideosList,
        music: ComingSoon,
        photos: ComingSoon,
        others: ComingSoon
    });

    const handlePagerIndexChange = (index: number) => {
        console.log(index)
        setIndex(index)
    }

    const PAGINGS = (
        <PagerView
            style={styles.pagerView}
            onPageScroll={() => console.log("SCROLLED")}
            initialPage={0}
        >
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={handlePagerIndexChange}
                // initialLayout={initialLayout}
                renderTabBar={(props) => <TabBar
                    style={{ backgroundColor: 'green', }}
                    inactiveColor={colors.text}
                    activeColor={colors.accent}
                    {...props}
                />} />
        </PagerView>
    )

    console.log(libPermision?.granted, "MEDIA ACCESS")

    return (
        <ContainerFlex>
            <HeadLine
                children={
                    <>
                        Downloads •
                        <SpanText
                            onPress={handleLibPermisionsRequest}
                            style={{ color: libPermision?.granted ? colors.warning : colors.error }}
                            children={" " + (UserDownloads?.[routes?.[index]?.albumable]?.length ?? (libPermision?.status + " access To")) + " "} />
                        {routes?.[index]?.albumable}
                    </>
                }
                style={{ fontWeight: '900', textTransform: 'uppercase', paddingVertical: 10, paddingHorizontal: 15, borderBottomColor: libPermision?.granted ? colors.warning : colors.error, borderBottomWidth: 2 }}
            />
            {!libPermision?.granted ? accessButton :
                <ContainerBlock style={{ flex: 1, padding: 0 }}>

                    {PAGINGS}
                </ContainerBlock>
            }
        </ContainerFlex>
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
