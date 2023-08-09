import { useRoute } from "@react-navigation/native";
import { ContainerBlock, ContainerFlex, ScrollContainer } from "../../../Components/Containers";
import { RefreshControl, StyleSheet } from "react-native";
import { useState } from "react";
import VideoPlayer from "../../Partials/MediaPlayer/Video";
import { IPostItem } from "../../../Interfaces";
import { Button, IconButton } from "../../../Components/Buttons";
import { useDataContext } from "../../../Contexts/DataContext";
import useThemeColors from "../../../Hooks/useThemeColors";
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";

export default function View() {

    const [isRefreshing, setIsRefreshing] = useState(false)
    const {
        createDownload,
        downloadProgreess,
        libPermision,
        isDownloading,
        requestLibPermisions,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        downloadMessage
    } = useMediaLibrary()
    const colors = useThemeColors()
    const onRefresh = () => {

    }

    const { setData, states: NJS } = useDataContext()

    const handleToggleHeader = () => {

    }


    const { params } = useRoute()
    console.log(downloadProgreess?.written, downloadMessage)

    const beginDownlaod = () => {
        console.log("SHOULD DOWNLOAD ")
        createDownload((params as any)?.src, 'new-movies.mp4', 'video')
    }

    const pendDownload = () => {
        pauseDownload()
    }


    return (
        <ContainerFlex  >
            <VideoPlayer {...params as IPostItem} />
            <ScrollContainer
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}>
                <ContainerBlock style={{ backgroundColor: colors.background2, padding: 5 }}>
                    <Button
                        containerStyle={{ padding: 0, backgroundColor: 'transparent', paddingVertical: 10 }}
                        textStyle={{ textTransform: 'none' }}
                        title='Hey fred fred fred fred fred fred fred fred Hey fred fred fred fred fred fred fred fred Hey fred fred fred fred fred fred fred fred Hey fred fred fred fred fred fred fred fred'
                    />
                </ContainerBlock>
                <ScrollContainer horizontal contentContainerStyle={{ paddingVertical: 10, gap: 10 }}>
                    <IconButton
                        onPress={isDownloading ? pendDownload : beginDownlaod}
                        title={
                            isDownloading ? `${downloadProgreess?.expected}/${downloadProgreess?.written}` : "download"
                        }
                        containerStyle={[styles.iconsButton, { marginLeft: 10 }]}
                        icon={<MaterialCommunityIcons size={25} name="download" />}
                    />
                    <IconButton
                        title="share"
                        containerStyle={styles.iconsButton}
                        icon={<MaterialCommunityIcons size={25} name="share" />}
                    />
                    <IconButton
                        title="report"
                        containerStyle={styles.iconsButton}
                        icon={<MaterialIcons size={25} name="report" />}
                    />
                </ScrollContainer>
            </ScrollContainer>
            <Button
                title={"Toggle"}
                onPress={handleToggleHeader}
            />
        </ContainerFlex>
    )
}

const styles = StyleSheet.create({
    iconsButton: {
        borderWidth: 0,
    }
})