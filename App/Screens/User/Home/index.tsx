import ListSlider from "../../Partials/ListSlider";
import { SpanText } from "../../../Components/Texts";
import { ContainerBlock, ScrollContainer } from "../../../Components/Containers";
import { RefreshControl } from "react-native";
import { useState } from "react";
import { Videos } from "../../../dummy-data";


export default function Home() {

    const [isRefreshing, setIsRefreshing] = useState<boolean>()
    const [currentPage, setCurrentPage] = useState(0);
    const [SlideIndex, setSlideIndex] = useState(0)

    const onRefresh = async () => {
        console.log("REFRESHING....")
        setIsRefreshing(true)
        await new Promise((resolved) => setTimeout(() => {
            resolved('')
            setIsRefreshing(false)
        }, 4000))
    }

    return (
        <ScrollContainer
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} >



            <ContainerBlock>
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
            </ContainerBlock>
        </ScrollContainer>
    )
}