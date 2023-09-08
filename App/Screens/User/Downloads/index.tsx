import { Video } from "expo-av";
import { Button, ButtonGradient, IconButton } from "../../../Components/Buttons";
import { ContainerBlock, ContainerFlex, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";
import { HeadLine, SpanText } from "../../../Components/Texts";
import { add, formatDuration, formatFileSize, formatPlaytimeDuration, openURi } from "../../../Helpers";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshControl, FlatList, Dimensions, StyleSheet, Image, Pressable, ImageBackground, BackHandler, Linking } from 'react-native'
import * as Library from 'expo-media-library'
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { APP_NAME, APP_ALBUM_NAME } from '@env'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ShareContent from "../../../Components/ShareFile";
import { FilesBrowser } from "./FilesBrowser";


dayjs.extend(relativeTime);

const ComingSoon = () => (
    <ContainerBlock  >
        <SpanText>Coming Soon!!! 🚀🚀🚀🌟</SpanText>
    </ContainerBlock>
);

export default function Downloads() {
    const colors = useThemeColors()
    const { navigate } = useNavigation()
    const [isRefreshing, setIsRefreshing] = useState<boolean>()
    const [UserDownloads, setUserDownloads] = useState<{
        videos?: Library.AssetInfo[],
        audios?: Library.AssetInfo[],
        photos?: Library.AssetInfo[],
        others?: Library.AssetInfo[]
    }>({})

    const [BottomSheetDate, setBottomSheetDate] = useState<Library.AssetInfo>()

    const [index, setIndex] = useState(0)

    const {
        libPermision,
        handleLibPermisionsRequest,
        getMydownloads,
        hasDownloadedMedias
    } = useMediaLibrary()

    //Tab

    const [routes] = useState([
        { key: 'vodeos', title: "movies", albumable: 'videos' },
        { key: 'music', title: 'music', albumable: 'audios' },
        { key: 'photos', title: 'Photos', albumable: 'photos' },
        { key: 'others', title: 'more...', albumable: 'unknown' },
    ]);

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
        } finally {
            setIsRefreshing(false)
        }
    }

    const accessButton = (
        <LinearGradient
            colors={[colors.background, colors.background2]}
            style={{ paddingBottom: 20, borderTopRightRadius: 20, padding: 10, borderTopLeftRadius: 20, flex: 1 }}>
            <HeadLine
                children="Media Library Access"
                style={{ paddingHorizontal: 0, marginBottom: 10, fontSize: 40 }}
            />
            <SpanText
                onPress={handleLibPermisionsRequest}
                style={{ color: libPermision?.granted ? colors.warning : colors.error, fontSize: 12 }}
                children={" Media Access is " + (libPermision?.status)} />
            <SpanText
                children={`${APP_NAME} need access to your media library to show your photos and videos.`}
                style={{ fontSize: 18, fontWeight: '300', opacity: .7 }}
            />
            <Button
                onPress={handleLibPermisionsRequest}
                containerStyle={{ borderRadius: 50, backgroundColor: colors.accent, marginTop: 20 }}
                textStyle={{ textAlign: 'center', width: '100%', }}
                title={"Grant Media Access"} />
        </LinearGradient>
    )

    const handleDownloadedItemClicked = async (item: Library.AssetInfo) => {
        setBottomSheetDate(item)
    }

    // const VideosList = () => (
    //     <FlatList
    //         bouncesZoom={false}
    //         bounces={false}
    //         contentContainerStyle={{
    //             justifyContent: 'space-between',
    //             paddingVertical: 10,
    //         }}
    //         data={UserDownloads.videos}
    //         renderItem={({ item }) => (
    //             <Pressable
    //                 onPress={() => handleDownloadedItemClicked(item)}
    //                 key={item.creationTime} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
    //                 <ContainerBlock style={{ padding: 0, position: 'relative', borderRadius: 10, overflow: 'hidden', borderWidth: 1, }}>
    //                     <Image
    //                         source={{ uri: item?.uri }}
    //                         height={90}
    //                         resizeMethod="resize"
    //                         resizeMode='contain'
    //                         style={{ aspectRatio: '16/9' }}
    //                     />
    //                     <SpanText
    //                         children={formatPlaytimeDuration(item.duration)}
    //                         numberOfLines={2}
    //                         style={{
    //                             marginBottom: 6, position: 'absolute', right: 5, bottom: 5, padding: 3, backgroundColor: 'rgba(0,0,0,0.6)',
    //                             lineHeight: 25, fontFamily: 'Montserrat_400Regular',
    //                         }} />
    //                 </ContainerBlock>
    //                 <ContainerBlock style={{ backgroundColor: 'transparent', paddingVertical: 0, overflow: 'hidden', flexGrow: 1, maxWidth: '60%' }}>
    //                     <SpanText
    //                         children={item.filename}
    //                         numberOfLines={2}
    //                         style={{ marginBottom: 6, lineHeight: 25, fontFamily: 'Montserrat_400Regular', }} />
    //                     <SpanText
    //                         children={dayjs(new Date(item.creationTime * 1000)).format('D MMM, YYYY')}
    //                         style={{ fontSize: 12, opacity: .6, fontFamily: 'Montserrat_400Regular', }}
    //                     />

    //                 </ContainerBlock>
    //             </Pressable>

    //         )}
    //         keyExtractor={({ id }) => id}
    //         refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    //     />
    // );

    const handlebackbuttonPress = () => {
        if ('') {

            return true
        } else {

        }
        return false
    }

    useEffect(() => {
        onRefresh()

        const BHND = BackHandler.addEventListener('hardwareBackPress', handlebackbuttonPress)

        return () => {
            BHND.remove()
        }
    }, [])

    const renderScene = SceneMap({
        vodeos: () => FilesBrowser({ assets: UserDownloads?.videos, onRefresh }),
        music: () => FilesBrowser({ assets: UserDownloads?.audios, onRefresh }),
        photos: () => FilesBrowser({ assets: UserDownloads?.photos, onRefresh }),
        others: () => FilesBrowser({ assets: UserDownloads?.others, onRefresh })
    });

    const handlePagerIndexChange = (index: number) => {
        setIndex(index)
    }

    const PAGINGS = (
        <PagerView
            style={[styles.pagerView, { backgroundColor: colors.background2 }]}
            initialPage={0}
        >
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={handlePagerIndexChange}
                // initialLayout={initialLayout}
                renderTabBar={(props) => <TabBar
                    style={{ backgroundColor: colors.background, }}
                    inactiveColor={colors.text}
                    activeColor={colors.primary}
                    {...props}
                />} />
        </PagerView>
    )

    const hasNoDownloads = (
        < LinearGradient
            colors={[colors.background, colors.background]}
            style={{ flex: 1, justifyContent: 'center' }}>
            <HeadLine
                children="Zero Downloads!!"
                style={{ paddingHorizontal: 20, marginBottom: 10, fontSize: 40 }}
            />
            <SpanText
                style={{ fontSize: 18, fontWeight: '300', opacity: .7, paddingHorizontal: 20, width: '90%', marginBottom: 10 }}
                children={`${APP_NAME}\nYou haven't downloaded anything yet. Press the button to explore and download content.`}
            />
            <ContainerBlock style={{ borderRadius: 5, flexDirection: 'row', backgroundColor: 'transparent', flexWrap: 'wrap', gap: 20, padding: 20 }}>
                <ButtonGradient
                    icon={<MaterialIcons size={40} name="audiotrack" color={'white'} />}
                    containerStyle={{ width: '40%', flexGrow: 1 }}
                    title={"Explore Music"}
                    gradient={['#FF6B6B', '#FF8E53']}
                    onPress={() => (navigate as any)?.("Search", { exploring: 'music audio' })}
                />
                <ButtonGradient
                    gradient={['#3A8DFF', '#3ABEFF']}
                    icon={<MaterialIcons size={40} name="airplay" color={'white'} />}
                    containerStyle={{ width: '40%' }}
                    title={"Movies"}
                    onPress={() => (navigate as any)?.("Search", { exploring: 'movies video videos' })}
                />
                {/* <ButtonGradient
                    gradient={['green', '#26C0F7']}
                    icon={<MaterialIcons size={40} name="favorite" color={'white'} />}
                    containerStyle={{ width: '40%', flexGrow: 1 }}
                    title={"Free bettin Odds"}
                    onPress={() => (navigate as any)?.("Search", { exploring: 'betting' })}
                /> */}
            </ContainerBlock>
        </LinearGradient>
    )

    const handleOpenUrl = async (assetUri: string) => {
        openURi(assetUri)
    }

    return (
        <ContainerFlex
            style={{ backgroundColor: colors.background2 }}
        >
            <HeadLine
                hidden={!libPermision?.granted || !hasDownloadedMedias}
                children={
                    <>
                        Downloads •
                        <SpanText
                            onPress={handleLibPermisionsRequest}
                            style={{ color: libPermision?.granted ? colors.warning : colors.error, fontSize: 12 }}
                            children={" " + (UserDownloads?.[routes?.[index]?.albumable]?.length ?? "") + " "} />
                        {routes?.[index]?.albumable}
                    </>
                }
                style={{
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    // borderBottomColor: libPermision?.granted ? colors.warning : colors.error,
                    // borderBottomWidth: 2
                }}
            />
            {!libPermision?.granted ? accessButton :
                <ContainerBlock style={{ flex: 1, padding: 0 }}>
                    {hasDownloadedMedias ? PAGINGS : hasNoDownloads}
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
