import React, { useState } from "react";
import { FlatList, Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, IconButton } from "../Buttons";
import { ContainerBlock, ContainerSpaceBetween } from "../Containers";
import { HeadLine, SpanText } from "../Texts";
import { IListSlider, IPostItem } from "../../Interfaces";
import useThemeColors from "../../Hooks/useThemeColors";
import { useNavigation } from "@react-navigation/native";
import { useDataContext } from "../../Contexts/DataContext";
import { useMediaPlaybackContext } from "../../Screens/Statics/MediaViewer/Context";

const VideoListItem = (props: IPostItem) => {
    const { width, height } = useWindowDimensions();
    const { navigate } = useNavigation();
    const [isLongPressed, setIsLongPressed] = useState(false);

    const handleOnPress = () => {
        console.log("PRESSED");
        props.onPress?.(props);
    };

    return (
        <Button
            onLongPress={() => setIsLongPressed(true)}
            onPressOut={() => setIsLongPressed(false)}
            onPress={handleOnPress}
            title={null}
            style={{ padding: 0 }}
            key={props.id}
            containerStyle={{
                padding: 0,
                height: 148,
                maxHeight: 160,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'black',
                flexGrow: 1,
            }}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: props?.thumbnailUrl }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                resizeMethod="auto"
                resizeMode="cover"
            />
        </Button>
    );
};

const AudioListItem = () => <SpanText>audio list type</SpanText>;

export function ListSlideItem(props: IPostItem) {
    const { type } = props;
    switch (type) {
        case 'audio':
            return <AudioListItem />;
        case 'video':
            return <VideoListItem {...props} />;
        default:
            return null;
    }
}

export default function SlideCarousel(props: IListSlider) {
    const { items = [], headline } = props;
    const { setMedia } = useMediaPlaybackContext();
    const { text } = useThemeColors();
    const { navigate } = useNavigation();
    const { setData } = useDataContext();

    const handleNavigateExplore = (genre: string | null) => {
        if (genre) {
            (navigate as any)?.("Explorer", { genre });
            setData('states', 'isHeaderHidden', true);
        }
    };

    const handleOnPressListItem = (itemProps: IPostItem) => {
        setMedia?.(itemProps);
    };

    return (
        <ContainerBlock style={{ padding: 0, paddingVertical: 10 }}>
            <ContainerSpaceBetween>
                <HeadLine children={headline} />
                <IconButton
                    containerStyle={{ backgroundColor: 'transparent', paddingRight: 5 }}
                    icon={
                        <Ionicons
                            name="arrow-forward"
                            size={30}
                            color={text}
                            onPress={() => handleNavigateExplore(typeof headline === 'string' ? headline : null)}
                            title={headline}
                        />
                    }
                />
            </ContainerSpaceBetween>
            <FlatList
                data={items}
                bouncesZoom={false}
                bounces={false}
                contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
                renderItem={({ item, index }: { item: IPostItem, index: number }) => (
                    <ListSlideItem onPress={handleOnPressListItem} key={index} {...item} />
                )}
                keyExtractor={({ id }) => id}
                horizontal
                isTVSelectable
                importantForAccessibility='auto'
            />
        </ContainerBlock>
    );
}