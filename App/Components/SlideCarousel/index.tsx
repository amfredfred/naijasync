import React, { useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Button, IconButton } from "../Buttons";
import { ContainerBlock, ContainerSpaceBetween } from "../Containers";
import { HeadLine, SpanText } from "../Texts";
import { IListSlider, IPostItem } from "../../Interfaces";
import useThemeColors from "../../Hooks/useThemeColors";
import { useNavigation } from "@react-navigation/native";
import { useDataContext } from "../../Contexts/DataContext";
import { useMediaPlaybackContext } from "../../Contexts/MediaPlaybackContext";
import { REQUESTS_API } from "@env";


export function ListSlideItem(props: IPostItem) {
    const { type, fileType } = props;
 
    const handleOnPress = () => {
        console.log("PRESSED");
        props.onPress?.(props);
    };

    const VideoItem = () => (
        <TouchableOpacity
            onPress={handleOnPress}
            style={[styles.videoListItem]}  >
            <Image
                source={{ uri: `${REQUESTS_API}${props?.thumbnailUrl}` }}
                style={[styles.listThumb]}
                resizeMethod="auto"
                resizeMode="cover" />
            <SpanText
                style={{ paddingHorizontal: 5, fontSize: 12 }}
                children={props?.caption ?? props?.title ?? props?.description} />
            <SpanText style={[styles.itemDuration, { color: 'white' }]} />
            <View style={[styles.playIconContainer]}
                children={<Ionicons size={25} color={'white'} name="play-circle" />} />
        </TouchableOpacity>
    )

    const AudioItem = () => (
        <TouchableOpacity
            onPress={handleOnPress}
            style={[styles.videoListItem, { width: 95, aspectRatio: 1 }]}  >
            <Image
                source={{ uri: `${REQUESTS_API}${props?.thumbnailUrl}` }}
                style={[styles.listThumb]}
                resizeMethod="auto"
                resizeMode="cover" />
            <SpanText
                style={{ paddingHorizontal: 5, fontSize: 12 }}
                children={props?.caption ?? props?.title ?? props?.description} />
            <MaterialIcons name='audiotrack' style={[styles.topRightIcon]} />

            <View style={[styles.playIconContainer]}
                children={<Ionicons size={25} color={'white'} name="play-circle" />} />
        </TouchableOpacity>
    )


    switch (type ?? fileType) {
        case 'audio':
            return < AudioItem />
        case 'video':
            return <VideoItem />;
        default:
            return null;
    }
}

export default function SlideCarousel(props: IListSlider) {
    const { items = [], headline } = props;
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
                    <ListSlideItem onPress={handleOnPressListItem}{...item} key={index} />
                )}
                horizontal
            />
        </ContainerBlock>
    );
}

const styles = StyleSheet.create({
    videoListItem: {
        width: 140,
        overflow: 'hidden',
        position: 'relative'
    },
    listThumb: {
        flexGrow: 1,
        width: '100%',
        minHeight: 75,
        borderRadius: 5,
    },
    itemDuration: {
        position: 'absolute',
        left: 20,
        bottom: 10,
        padding: 3,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    playIconContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    topRightIcon: {
        padding: 3,
        borderRadius: 50,
        position: 'absolute',
        right: 5,
        top: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white'
    },
    spaceBetween: {
        justifyContent: "space-between",
        alignItems: 'center',
        flexDirection: 'row'
    }
})