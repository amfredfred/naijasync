import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";
import { HeadLine, SpanText } from "../../../Components/Texts";
import { IListSlider, IPostItem } from "../../../Interfaces";
import ListSlideItem from "./ListSliderItem";
import { ActivityIndicator, FlatList } from "react-native";
import { useState } from 'react'
import { Button, IconButton } from "../../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useNavigation } from "@react-navigation/native";
import useStorage from "../../../Hooks/useStorage";
import { useDataContext } from "../../../Contexts/DataContext";
import { useMediaPlaybackContext } from "../../Statics/MediaViewer/Context";

export default function ListSlider(props: IListSlider) {
    const { items = [], headline } = props
    const {
        setMedia
    } = useMediaPlaybackContext()

    const { text } = useThemeColors()
    const { navigate } = useNavigation()
    const { setData } = useDataContext()
    const handleNavigateexplore = (genre: string) => {
        (navigate as any)?.("Explorer", { genre });
        setData('states', 'isHeaderHidden', true);
    }

    const handleOnPressListItem = async (props: IPostItem) => {
        setMedia?.({sources:[props.src], thumbnailUri:props.thumb})
    }

    return (
        <ContainerBlock
            style={{ padding: 0, paddingVertical: 10, }}>
            {/* {props.children} */}
            <ContainerSpaceBetween>
                <HeadLine children={headline} />
                <IconButton
                    containerStyle={{ backgroundColor: 'transparent', paddingRight: 5 }}
                    icon={<Ionicons name="arrow-forward" size={30} color={text}
                        onPress={() => handleNavigateexplore(typeof headline == 'string' ? headline : null)}
                        title={headline} 
                    />}
                />
            </ContainerSpaceBetween>
            <FlatList
                data={items}
                bouncesZoom={false}
                initialNumToRender={4}
                bounces={false}
                contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
                renderItem={({ item, index }: { item: IPostItem, index: number }) => <ListSlideItem onPress={handleOnPressListItem} key={index} index={index} {...item} />}
                keyExtractor={({ id }) => id}
                horizontal
                initialScrollIndex={2}
                isTVSelectable
                importantForAccessibility='auto'
            />
        </ContainerBlock>
    )
}