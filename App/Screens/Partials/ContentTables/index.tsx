import ListSlider from "../../Partials/ListSlider";
import { SpanText } from "../../../Components/Texts";
import { ContainerBlock, ScrollContainer } from "../../../Components/Containers";
import { useState } from 'react'
import { RefreshControl } from 'react-native'
import { Videos } from "../../../dummy-data";

export default function ContentTables() {
    const [isRefreshing, setIsRefreshing] = useState<boolean>()


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
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
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