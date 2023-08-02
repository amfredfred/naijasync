import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";
import Swiper from 'react-native-swiper'
import { HeadLine, SpanText } from "../../../Components/Texts";
import { IListSlider, IPostItem } from "../../../Interfaces";
import ListSlideItem from "./ListSliderItem";
import { ActivityIndicator, FlatList } from "react-native";

export default function ListSlider(props: IListSlider) {

    const { items = [], headline } = props

    return (
        <ContainerBlock
            style={{ padding: 0, paddingVertical: 10  }}>
            {/* {props.children} */}
            <ContainerSpaceBetween>
                <HeadLine children={headline} />
                <SpanText>HEDSD</SpanText>
            </ContainerSpaceBetween>
            <FlatList
                data={items}
                bouncesZoom={false}
                bounces={false}
                contentContainerStyle={{ paddingHorizontal: 10, gap:10 }}
                renderItem={({ item, index }: { item: IPostItem, index: number }) => <ListSlideItem key={index} index={index} {...item} />}
                horizontal
            />
        </ContainerBlock>
    )
}