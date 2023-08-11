import React, { useState, useEffect } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ContainerBlock, ContainerFlex, ScrollContainer } from "../../../Components/Containers";
import VideoPlayer from "../../Partials/MediaPlayer/Video";
import { IPostItem } from "../../../Interfaces";
import { Button, IconButton } from "../../../Components/Buttons";
import { useDataContext } from "../../../Contexts/DataContext";
import useThemeColors from "../../../Hooks/useThemeColors";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import { convertStringToCase } from "../../../Helpers";

export default function View() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        createDownload,
        downloadProgreess,
        downloadStataus,
        pauseDownload,
        libPermision,
        handleLibPermisionsRequest
    } = useMediaLibrary();

    const colors = useThemeColors();

    const { params } = useRoute();

    const onRefresh = () => {
        // Handle refresh here
    };

    const beginDownload = () => {
        console.log("SHOULD DOWNLOAD");
        createDownload((params as any)?.src, "new-movies-2023.mp4");
    };

    const suspendDownload = () => {
        pauseDownload();
    };

    const { setData, states: NJS } = useDataContext();

    const handleToggleHeader = () => {
        // Toggle header logic
    };

    useEffect(() => {
        if (!libPermision?.granted) {
            console.log("CALLED")
        }
        return () => {

        }
    }, [libPermision])


    console.log(downloadStataus)

    return (
        <ContainerFlex>
            <VideoPlayer {...params as IPostItem} />
            <ScrollContainer
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
            >
                <ContainerBlock style={{ padding: 5, paddingHorizontal: 10 }}>
                    <Button
                        containerStyle={{ padding: 0, backgroundColor: "transparent", paddingVertical: 10 }}
                        textStyle={{ textTransform: "none", width: '90%' }}
                        title="Ronaldo Goal - Al Nassr vs Al Shorta 1-0 Highlights & All Goals - 2023"
                    />
                </ContainerBlock>
                <ScrollContainer
                    horizontal
                    contentContainerStyle={{ paddingVertical: 10, gap: 10 }}
                >
                    <IconButton
                        onPress={downloadStataus == 'paused' ? suspendDownload : beginDownload}
                        title={downloadStataus == 'downloading' ? `${downloadProgreess?.expected ?? 0}/${downloadProgreess?.written ?? 0}` : "download"}
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
                title="Toggle"
                onPress={handleToggleHeader}
            />
        </ContainerFlex>
    );
}

const styles = StyleSheet.create({
    iconsButton: {
        borderWidth: 0,
    },
});
