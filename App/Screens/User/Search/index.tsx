import { ContainerBlock, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";
import { FlatList, RefreshControl, Image, Pressable } from 'react-native'
import { useDataContext } from "../../../Contexts/DataContext";
import { useQueries } from "@tanstack/react-query";
import { IconButton } from "../../../Components/Buttons";
import useThemeColors from "../../../Hooks/useThemeColors";
import { SpanText } from "../../../Components/Texts";
import axios from 'axios'
import { REQUESTS_API } from "@env"
import { useEffect, useState } from 'react'
import { IPostItem } from "../../../Interfaces";
import useTimeout from "../../../Hooks/useTimeout";
import ListSlideItem from "../../Partials/ListSlider/ListSliderItem";
import { Ionicons } from "@expo/vector-icons";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRoute } from "@react-navigation/native";
dayjs.extend(relativeTime);

export default function Search() {

    const { states: { user, states } } = useDataContext()
    const [isSelectedTarget, setisSelectedTarget] = useState("movies")
    const [fetchLimit, setfetchLimit] = useState(4)
    const [shouldQuery, setshouldQuery] = useState(false)
    const [isRefreshing, setisRefreshing] = useState(false)
    const { params } = useRoute()

    const colors = useThemeColors()

    const [$movies,] = useQueries({
        'queries': [
            {
                queryFn: async () => await axios.get<{ results: IPostItem[] }>(`${REQUESTS_API}search?query=${user?.searchRequestValue}&target=${isSelectedTarget}&limit=${fetchLimit}`),
                enabled: (states?.isInSearchMode || isSelectedTarget) && shouldQuery,
                queryKey: [String(user?.searchRequestValue).trim()]
            }
        ]
    })

    const expTabs = [
        { title: 'movies', },
        { title: 'news', },
        { title: 'music', },
    ]

    const onClearTimeout = () => {
        setshouldQuery(false)
    }

    const onTimeout = () => {
        if (user?.searchRequestValue || isSelectedTarget)
            setshouldQuery(true)
    }
    
    useEffect(() => {


    }, [])

    useTimeout({
        deps: [user?.searchRequestValue, isSelectedTarget],
        onClearTimeout,
        onTimeout,
        seconds: 1000
    })

    const handleOnRefresh = () => {

    }

    return (
        <ContainerBlock style={{ padding: 0, flex: 1 }}>

            <ContainerBlock style={{ paddingHorizontal: 0, }}>
                <ScrollContainer
                    horizontal
                    pagingEnabled
                    contentContainerStyle={{ gap: 10, }}>
                    {expTabs.map((ETab, index) =>
                        <IconButton
                            key={index}
                            onSelect={(selected) => setisSelectedTarget(selected)}
                            title={ETab.title}
                            active={ETab.title == isSelectedTarget} />
                    )}
                </ScrollContainer>
            </ContainerBlock>

            <ContainerBlock style={{ backgroundColor: colors.background2, flex: 1, padding: 0 }}>
                <FlatList
                    style={{}}
                    data={$movies?.data?.data?.results}
                    refreshControl={<RefreshControl onRefresh={handleOnRefresh} refreshing={isRefreshing} />}
                    renderItem={({ index, item }) => {
                        return (
                            <Pressable style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                <ContainerBlock style={{ padding: 0, borderRadius: 10 }}>
                                    <Image
                                        source={{ uri: `${REQUESTS_API}${item?.thumbnailUrl}` }}
                                        height={90}
                                        resizeMethod="resize"
                                        resizeMode='contain'
                                        style={{ aspectRatio: '16/9' }}
                                    />
                                </ContainerBlock>

                                <ContainerBlock style={{ backgroundColor: 'transparent', paddingVertical: 0, overflow: 'hidden', flexGrow: 1, maxWidth: '60%' }}>
                                    <SpanText
                                        children={item.title}
                                        numberOfLines={2}
                                        style={{ marginBottom: 6, lineHeight: 25, fontFamily: 'Montserrat_400Regular', }} />
                                    <SpanText
                                        children={dayjs(item.createdAt).format('D MMM, YYYY')}
                                        style={{ fontSize: 12, opacity: .6, fontFamily: 'Montserrat_400Regular', }}
                                    />
                                    <SpanText
                                        children={item.mimeType}
                                        numberOfLines={2}
                                        style={{ marginBottom: 6, lineHeight: 25, fontFamily: 'Montserrat_400Regular', }} />
                                </ContainerBlock>
                            </Pressable>
                        )
                    }}


                />
            </ContainerBlock>

        </ContainerBlock>
    )
}