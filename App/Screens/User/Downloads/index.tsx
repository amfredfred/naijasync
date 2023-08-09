import { ContainerBlock, ContainerFlex, ScrollContainer } from "../../../Components/Containers";
import { SpanText } from "../../../Components/Texts";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useState } from 'react'
import { RefreshControl } from 'react-native'

export default function Downloads() {
    const colors = useThemeColors()

    const [isRefreshing, setIsRefreshing] = useState<boolean>()
    const {
        
    } = useMediaLibrary()


    const onRefresh = async () => {
        console.log("REFRESHING....")
        setIsRefreshing(true)
        await new Promise((resolved) => setTimeout(() => {
            resolved('')
            setIsRefreshing(false)
        }, 4000))
    }


    return (
        <ContainerFlex>
            <SpanText style={{ padding: 10 }}>Downloads</SpanText>
            <ScrollContainer
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            >
                <ContainerBlock style={{ backgroundColor: colors.background2, borderTopEndRadius: 20, height: 1000, borderTopStartRadius: 20, padding: 10 }}>
                    <SpanText>HEY DOWNLOADS</SpanText>
                </ContainerBlock>
            </ScrollContainer>
        </ContainerFlex>
    )
}