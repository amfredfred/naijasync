import { useMemo, useState } from 'react';
import useThemeColors from "../../Hooks/useThemeColors";
import { useDataContext } from "../../Contexts/SysContext";
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../Interfaces';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useEffect } from 'react'
import { REQUESTS_API } from '@env';
import UserLayout from '../../Layouts/User';
import PostItem from '../_partials/PostItem';
import { FlatList, View } from 'react-native'
import { Empty } from '../_partials/PostsList';
import * as Animatable from 'react-native-animatable';
import { SpanText } from '../../Components/Texts';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { IconButton } from '../../Components/Buttons';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const navigation = useNavigation()
    const { navigate } = useNavigation()

    const [isRereshing, setIsRereshing] = useState(false)
    const [$Posts, set$Posts] = useState<IPostItem[]>([])
    const isRouteReady = navigation.isFocused();

    const fetch = async ({ pageParam = 1 }) => {
        const url = `${REQUESTS_API}posts?page=${pageParam}`
        return await axios<IPostItem[]>({
            url,
            method: 'GET',
            data: {
                username: authContext?.user?.account?.username
            },
        })
    }

    const posts = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetch,
        getNextPageParam: (lastPage, pages) => {
            let next_page = (lastPage as any).data?.next_page_url?.split?.('=',)[1]
            return next_page
        },
        keepPreviousData: true,
        enabled: isRouteReady,
        select: (data) => ({
            pages: [...data.pages],
            pageParams: [...data.pageParams],
        }),
    })

    const onRefetch = () => {
        posts?.remove()
        posts?.refetch()
    }

    useEffect(() => {
        const mergePosts = []
        posts?.data?.pages?.map((page, index, array) => mergePosts?.push(...(page?.data as any)?.data))
        set$Posts(P => mergePosts)
    }, [posts?.fetchStatus, posts?.data?.pages?.length])

    useEffect(() => {
        switch (posts?.status) {
            case 'loading':
                setIsRereshing(true)
                break;
            case 'success':
                setIsRereshing(false)
                break;
            case 'error':
                setIsRereshing(false)
                posts.remove()
                break;
            default:
                setIsRereshing(false)
                break;
        }
        return () => {
            // posts.remove()
        }
    }, [posts.status])

    const loadMoreItems = async () => {
        if (posts?.hasNextPage) {
            await posts?.fetchNextPage()
            console.log("posts?.fetchNextPage()")
        }


    };

    const zoomOut = {
        0: {
            opacity: 1,
            scale: .4,
        },
        0.5: {
            opacity: 1,
            scale: 0.3,
        },
        1: {
            opacity: 0,
            scale: 1,
        },
    };

    const ListFooting = (
        <View style={{ height: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Animatable.View
                animation={zoomOut}
                iterationCount="infinite"
                direction="alternate"
                style={{
                    width: 600,
                    height: 10,
                    backgroundColor: 'white',
                    borderRadius: 50
                }}
            />
        </View>
    )

    const ListHeading = (
        <ScrollView
            horizontal
            style={[{ width: '100%', backgroundColor: themeColors.background }]}
            contentContainerStyle={[styles.spaceBetween,]}>
            <TouchableOpacity
                onPress={() => (navigate as any)?.('Stories')}
                style={[styles.spaceBetween, { borderRadius: 50, overflow: 'hidden', gap: 5, backgroundColor: themeColors.background2, paddingHorizontal: 20 }]} >
                <SpanText children="Stories" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.spaceBetween, { borderRadius: 50, overflow: 'hidden', gap: 5, backgroundColor: themeColors.background2, paddingHorizontal: 20 }]} >
                <SpanText style={{ color: themeColors.secondary }} children="#247" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => (navigate as any)?.('Market')}
                style={[styles.spaceBetween, { borderRadius: 50, overflow: 'hidden', gap: 5, backgroundColor: themeColors.background2, paddingHorizontal: 20, paddingLeft: 15 }]} >
                <SpanText children="Market Place" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.spaceBetween, { borderRadius: 50, overflow: 'hidden', gap: 5, backgroundColor: themeColors.background2, paddingHorizontal: 20 }]} >
                <SpanText children="All" />
            </TouchableOpacity>
        </ScrollView >
    )

    return useMemo(() => (
        <UserLayout>
            <FlatList
                stickyHeaderHiddenOnScroll
                ListHeaderComponent={ListHeading}
                stickyHeaderIndices={$Posts ? [0] : undefined}
                ItemSeparatorComponent={() => <View style={{ backgroundColor: themeColors.background2, height: 5 }} />}
                style={{ flex: 1 }}
                data={$Posts}
                renderItem={({ item, index }) => (<PostItem {...item} />)}
                ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
                onRefresh={onRefetch}
                refreshing={isRereshing}
                // refreshControl={<RefreshControl onRefresh={handleOnRefreshList} refreshing={isRefrehing} />}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={.9}
                ListFooterComponent={posts?.hasNextPage && ListFooting}
            />
        </UserLayout>
    ), [$Posts])

}

const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
})