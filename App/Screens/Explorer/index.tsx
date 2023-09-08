import { ContainerBlock, ContainerFlex, ContainerSpaceBetween } from "../../Components/Containers";
import { SpanText } from "../../Components/Texts";
import { useEffect, useMemo } from 'react'
import { BackHandler, FlatList } from 'react-native'
import { useDataContext } from "../../Contexts/DataContext";
import { IconButton } from "../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useThemeColors from "../../Hooks/useThemeColors";
import { Videos } from "../../dummy-data";
import { IPostItem } from "../../Interfaces";
import { ListSlideItem } from "../../Components/SlideCarousel";
import UserLayout from "../../Layouts/User";
import VideoExplorer from "./Video";
import AudioExplorer from "./Audio";

export default function Explorer() {

    const { params } = useRoute()
    const { exploring, genre, screen } = params as any
    console.log(params)

    const { background, background2 } = useThemeColors()
    const { navigate } = useNavigation()

    const handleBackPress = () => {
        return false
    }

    const handleGoBack = () => {
        (navigate as any)?.("Home")
    }

    //Effects
    useEffect(() => {
        const BHND = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        return () => {
            BHND.remove()
        }
    }, [])


    return useMemo(() => (
        <UserLayout>
            <ContainerFlex style={{ padding: 0 }}>
                {screen === 'video' && (<VideoExplorer />)}
                {screen === 'audio' && (<AudioExplorer />)}
            </ContainerFlex>
        </UserLayout>
    ), [params])
}
