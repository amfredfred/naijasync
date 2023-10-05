import { useMemo, useState } from 'react';
import useThemeColors from "../../Hooks/useThemeColors";
import React from 'react';
import { useNavigation } from "@react-navigation/native";
// import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../Interfaces';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useEffect } from 'react'
import UserLayout from '../../Layouts/User';
import PostItem from '../_partials/PostItem';
import { ActivityIndicator, FlatList, View } from 'react-native'
import { Empty } from '../_partials/PostsList';
import * as Animatable from 'react-native-animatable';
import { SpanText } from '../../Components/Texts';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import useEndpoints from '../../Hooks/useEndpoints';
import useInfiniteQuery from '../../Hooks/useInfiniteQuery';

export default function Home() {
    const themeColors = useThemeColors()
    const { navigate } = useNavigation()
    const endpoints = useEndpoints()
    const { results, error, onRefetch, loadMoreItems, hasNextPage, isRefetching } = useInfiniteQuery({ url: endpoints.publication, enabled: true, querykey: 'posts' })
    const items = results as IPostItem[]

    const ListFooting = (
        <View style={{ height: 27, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={25} color={'red'} />
        </View>
    )

    const ListHeading = (
        <View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
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
        </View>
    )

    return (
        <UserLayout>
            {ListHeading}
            <FlatList
                stickyHeaderHiddenOnScroll
                // ListHeaderComponent={ListHeading}
                showsVerticalScrollIndicator={false}
                // stickyHeaderIndices={items?.length > 2 ? [0] : undefined}
                ItemSeparatorComponent={() => <View style={{ backgroundColor: themeColors.background2, height: 5 }} />}
                style={{ flex: 1 }}
                data={items}
                renderItem={({ item, index }) => (<PostItem {...item} />)}
                ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
                onRefresh={onRefetch}
                refreshing={isRefetching}
                // refreshControl={<RefreshControl onRefresh={handleOnRefreshList} refreshing={isRefrehing} />}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={.9}
                ListFooterComponent={hasNextPage && ListFooting}
            />
        </UserLayout>
    )

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