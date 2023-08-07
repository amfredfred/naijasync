import ListSlider from "../../Partials/ListSlider";
import { SpanText } from "../../../Components/Texts";
import { ScrollContainer } from "../../../Components/Containers";
import { RefreshControl } from "react-native";
import { useState } from "react";
import { Videos } from "../../../dummy-data";
import Swiper from 'react-native-swiper'


export default function Home() {

    const [isRefreshing, setIsRefreshing] = useState()
    const onRefresh = () => {

    }


    return (
        <ScrollContainer
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} >
            <ListSlider
                headline='Hollywood'
                items={Videos} />
            <ListSlider
                headline='NollyWood'
                items={Videos}
            />
            <ListSlider
                headline='Skits'
                items={Videos}
            />
            <ListSlider
                headline='2023'
                items={Videos}
            />
            <ListSlider
                headline='2023 movies'
                items={Videos}
            />
        </ScrollContainer>
    )
}