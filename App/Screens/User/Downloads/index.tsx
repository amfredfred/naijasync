import { Video } from "expo-av";
import { Button, IconButton } from "../../../Components/Buttons";
import { ContainerBlock, ContainerFlex, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";
import { SpanText } from "../../../Components/Texts";
import { useDataContext } from "../../../Contexts/DataContext";
import { add, formatDuration, formatFileSize, formatPlaytimeDuration } from "../../../Helpers";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useEffect, useRef, useState } from 'react'
import { RefreshControl, FlatList, Dimensions } from 'react-native'
import * as Library from 'expo-media-library'
import { Feather, Ionicons } from "@expo/vector-icons";
import useStorage from "../../../Hooks/useStorage";
const { width, height } = Dimensions.get('window')

export default function Downloads() {
    const colors = useThemeColors()
    const { states } = useDataContext()
    const [isRefreshing, setIsRefreshing] = useState<boolean>()

    const {
        libPermision,
        handleLibPermisionsRequest,
        getMydownloads
    } = useMediaLibrary()

    const {
        NaijaSync
    } = useStorage("@NaijaSync")

    const onRefresh = async () => {
        console.log("REFRESHING....")
        setIsRefreshing(true)
        await getMydownloads(['audio', 'video', 'photo'])
        setIsRefreshing(false)
    }

    const accessButton = (
        <Button
            onPress={handleLibPermisionsRequest}
            containerStyle={{ borderRadius: 50, backgroundColor: colors.accent, top: '47%' }}
            textStyle={{ textAlign: "center" }}
            title={"Grant Media Access"} />
    )

    const medias = (
        <FlatList
            contentContainerStyle={{
                gap: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                flexWrap: 'wrap'
            }}
            data={[...(NaijaSync?.storage?.myDownloadedAssets ?? [])]}
            renderItem={({ index, item }) => {
                if (item.mediaType === 'video') return <Button
                    containerStyle={{
                        padding: 0,
                        minWidth: width / 2 - 18,
                    }}
                    title={undefined}>
                    <ContainerBlock style={{ padding: 0, borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                        <Video style={{ width: '100%', height: 120 }} source={{ uri: item.uri }} />

                        <SpanText
                            style={{ fontSize: 17, padding: 4, width: '90%', position: 'absolute', left: 0, bottom: 0 }}
                            children={item.filename}
                        />
                        <SpanText
                            children={formatPlaytimeDuration(item.duration)}
                            style={{
                                position: 'absolute',
                                right: 6, padding: 3, paddingHorizontal: 7, fontSize: 11,
                                bottom: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)'
                            }}
                        />
                    </ContainerBlock>
                </Button>
            }}
            keyExtractor={({ id }) => id}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
    )



    useEffect(() => {
        if (!states?.storage?.myDownloadedAssets?.length) {
            onRefresh()
            console.log("REFRSHIGN FROM FGHJKSKGHDSJHDSDSD")
        }
    }, [])

    return (
        <ContainerFlex>
            <ContainerSpaceBetween>
                <SpanText style={{ padding: 10 }}>
                    {states?.storage?.myDownloadedAssets?.length} Downloads
                </SpanText>
            </ContainerSpaceBetween>
            <ContainerBlock style={{ backgroundColor: colors.background2, borderTopEndRadius: 20, flex: 1, borderTopStartRadius: 20, padding: 10 }}>
                {!libPermision?.granted ? accessButton : medias}
            </ContainerBlock>
        </ContainerFlex>
    )
}