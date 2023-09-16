'use strict'

import { BackHandler, FlatList, RefreshControl, View, useWindowDimensions, StyleSheet, Image, TouchableOpacity } from "react-native"
import { HeadLine, SpanText } from "../../../Components/Texts"
import { ContainerSpaceBetween } from "../../../Components/Containers"
import { IconButton } from "../../../Components/Buttons"
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import useThemeColors from "../../../Hooks/useThemeColors"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { REQUESTS_API } from "@env"
import { useAuthContext } from "../../../Contexts/AuthContext"
import { IPostItem } from "../../../Interfaces"
import { useMediaPlaybackContext } from "../../../Contexts/MediaPlaybackContext"
import { ResizeMode, Video } from "expo-av" 
import ExplorerPostItemWrapper from "../Wrapper"
import PresentMedia from "../../Viewer/Post/PresentMedia"

export default function VideoExplorer() {

    const { params } = useRoute()
    const { exploring, genre, screen } = params as any 
    const authContext = useAuthContext()

    const [Videos, setVideos] = useState<IPostItem[]>()

    const { background, background2, text } = useThemeColors()
    const { navigate } = useNavigation()

    const $videos = useQuery(
        ['videos'],
        async () => await axios.get<IPostItem[]>(`${REQUESTS_API}posts?type=video&username=${authContext?.user?.account?.username}`,),
        { getNextPageParam: () => { } }
    )

    useEffect(() => {
        if ($videos?.status === 'success') {
            console.log($videos?.data?.data)
            setVideos(($videos?.data?.data as any)?.data)
        } else if ($videos?.status === 'error') {
            console.log("ERERO ", ($videos?.failureReason as any)?.response?.data)
        }
    }, [$videos.status])


    const handleBackPress = () => {
        return false
    }

    const handleGoBack = () => {
        (navigate as any)?.("Home")
    }

    const onRefresh = () => {
        $videos?.refetch()
    }

    //Effects
    useEffect(() => {
        const BHND = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        return () => {
            BHND.remove()
        }
    }, [])

    const Heading = (
        <ContainerSpaceBetween style={{ padding: 0, height: 45, backgroundColor: background }}>
            <IconButton
                icon={<Ionicons onPress={handleGoBack} name="arrow-back" size={35} />}
                containerStyle={{ backgroundColor: 'transparent', gap: 10 }}
                title={exploring ?? genre ?? screen}
                textStyle={{ fontSize: 20 }}
            />
        </ContainerSpaceBetween>
    )


    const VideoComponent = (post: IPostItem) => {
        const [isPresentingMedia, setisPresentingMedia] = useState(false)
        const mediaPlayer = useMediaPlaybackContext()
        return (
            <ExplorerPostItemWrapper post={post} >
                <TouchableOpacity
                    onPress={() => setisPresentingMedia(true)}
                    style={[styles.vieoContainer]}>
                    <View style={[styles.overlay]}
                        children={<Ionicons onPress={() => (navigate as any)?.('PlayVideo', { post })}
                            name="play-circle" size={40} color={text} />} />
                    <Image
                        resizeMethod="resize"
                        resizeMode="cover"
                        style={[styles.videoThumbImage]}
                        source={{ uri: `${REQUESTS_API}${post?.thumbnailUrl ?? post?.fileUrl}` }} />
                    {
                        !post?.thumbnailUrl && (
                            <Video
                                resizeMode={ResizeMode.CONTAIN}
                                style={[styles.videoComponent, { backgroundColor: background }]}
                                ref={mediaPlayer?.mediaRef}
                                source={{ 'uri': `${REQUESTS_API}${post?.fileUrl}` }} />
                        )
                    }
                </TouchableOpacity>
                {isPresentingMedia && (<PresentMedia onClose={() => setisPresentingMedia(false)}   {...post} />)}
            </ExplorerPostItemWrapper>
        )
    }

    return useMemo(() => (
        <FlatList
            stickyHeaderHiddenOnScroll
            stickyHeaderIndices={[0]}
            ListHeaderComponent={Heading}
            data={Videos}
            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={$videos?.isRefetching} />}
            renderItem={({ index, item }) => <VideoComponent {...item} />}
        />
    ), [$videos.data?.data])
}

const styles = StyleSheet.create({
    vieoContainer: {
        width: '100%',
        flexGrow: 1,
        position: 'relative',
        minHeight: 300,
    },
    videoThumbImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    },
    videoComponent: {
        width: '100%',
        flexGrow: 1,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        paddingBottom: 6,
        paddingHorizontal: 5,
        gap: 10
    },
    overlay: {
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 20
    }
})