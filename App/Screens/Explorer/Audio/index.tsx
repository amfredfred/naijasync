'use strict'

import { BackHandler, FlatList, RefreshControl, View, useWindowDimensions, StyleSheet, Image } from "react-native"
import { SpanText } from "../../../Components/Texts"
import { ContainerSpaceBetween } from "../../../Components/Containers"
import { IconButton } from "../../../Components/Buttons"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import useThemeColors from "../../../Hooks/useThemeColors"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { REQUESTS_API } from "@env"
import { useAuthContext } from "../../../Contexts/AuthContext"
import { IPostItem } from "../../../Interfaces"
import { useMediaPlaybackContext } from "../../Statics/MediaViewer/Context"
import ExplorerPostItemWrapper from "../Wrapper"

export default function AudioExplorer() {

    const { params } = useRoute()
    const { exploring, genre, screen } = params as any
    const { height, width } = useWindowDimensions()
    const authContext = useAuthContext()
    console.log(params)

    const [Videos, setVideos] = useState<IPostItem[]>()

    const { background, background2 } = useThemeColors()
    const { navigate } = useNavigation()

    const $videos = useQuery(
        ['audios'],
        async () => await axios.get<IPostItem[]>(`${REQUESTS_API}posts?type=audio&username=${authContext?.user?.account?.username}`,),
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

    const AudioComponent = (props: IPostItem) => {

        const mediaPlayer = useMediaPlaybackContext()

        return (
            <ExplorerPostItemWrapper post={props} >
                <View style={[styles.spaceBetween, { padding: 6 }]}>
                    <Image
                        source={{ uri: `${REQUESTS_API}${props?.thumbnailUrl}` }}
                        style={{ width: 100, aspectRatio: 1 / 1, borderRadius: 10 }}
                    />

                </View>
            </ExplorerPostItemWrapper>
        )
    }

    return (
        <View>
            <FlatList
                stickyHeaderHiddenOnScroll
                stickyHeaderIndices={[0]}
                ListHeaderComponent={Heading}
                data={Videos}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={$videos?.isRefetching} />}
                renderItem={({ index, item }) => <AudioComponent {...item} />}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        gap: 10
    }, blockContainer: {
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 5
    },
})