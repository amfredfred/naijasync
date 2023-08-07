import { useRoute } from "@react-navigation/native";
import { ContainerBlock, ScrollContainer } from "../../../Components/Containers";
import { ActivityIndicator, RefreshControl } from "react-native";
import { useState } from "react";
import VideoPlayer from "../../Partials/MediaPlayer/Video";
import { IPostItem } from "../../../Interfaces";

export default function View() {

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = () => {

    }

    const { params } = useRoute()


    return (
        <ScrollContainer
            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}  >
            <VideoPlayer {...params as IPostItem} />
        </ScrollContainer>
    )
}