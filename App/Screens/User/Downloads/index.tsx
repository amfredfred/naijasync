import { Video } from "expo-av";
import { Button } from "../../../Components/Buttons";
import { ContainerBlock, ContainerFlex, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";
import { SpanText } from "../../../Components/Texts";
import { useDataContext } from "../../../Contexts/DataContext";
import { add } from "../../../Helpers";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useState } from 'react'
import { RefreshControl, FlatList } from 'react-native'

export default function Downloads() {
    const colors = useThemeColors()
    const { states } = useDataContext()
    const [isRefreshing, setIsRefreshing] = useState<boolean>()
    const {
        libPermision,
        requestLibPermisions
    } = useMediaLibrary()

    const onRefresh = async () => {
        console.log("REFRESHING....")
        setIsRefreshing(true)
        await new Promise((resolved) => setTimeout(() => {
            resolved('')
            setIsRefreshing(false)
        }, 4000))
    }

    const accessButton = (
        <Button
            onPress={requestLibPermisions}
            containerStyle={{ borderRadius: 50, backgroundColor: colors.accent, top: '47%' }}
            textStyle={{ textAlign: "center" }}
            title={"Grant Media Access"} />
    )

    const medias = (
        <FlatList
            data={states?.downloads?.videos}
            renderItem={({ index, item }) => {
                return <Video
                    source={{ uri: item.uri }}
                    style={{ width: 200, height: 100, backgroundColor: 'red', marginTop:10 }}

                />
            }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
    )



    return (
        <ContainerFlex>
            <ContainerSpaceBetween>
                <SpanText style={{ padding: 10 }}>
                    {add(states?.downloads?.audios?.length ?? 0, states?.downloads?.videos?.length ?? 0)} Downloads
                </SpanText>
            </ContainerSpaceBetween>
            <ContainerBlock style={{ backgroundColor: colors.background2, borderTopEndRadius: 20, flex: 1, borderTopStartRadius: 20, padding: 10 }}>
                {!libPermision?.granted ? accessButton : medias}
            </ContainerBlock>
        </ContainerFlex>
    )
}