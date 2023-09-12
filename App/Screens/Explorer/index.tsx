import { ContainerFlex } from "../../Components/Containers";
import { useEffect, useMemo } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import useThemeColors from "../../Hooks/useThemeColors";
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
