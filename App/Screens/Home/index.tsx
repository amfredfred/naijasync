import { useState } from 'react';
import useThemeColors from "../../Hooks/useThemeColors";
import { useDataContext } from "../../Contexts/DataContext";
import React from 'react';
import { BannerAd, BannerAdSize, TestIds, RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useNavigation } from "@react-navigation/native";
import PostsList from "../_partials/PostsList";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../Interfaces';
import { useAuthContext } from '../../Contexts/AuthContext';
import { useEffect } from 'react'
import { REQUESTS_API } from '@env';
import SlideCarousel from '../../Components/SlideCarousel';
import { Videos } from "../../dummy-data";
import UserLayout from '../../Layouts/User';

export default function Home() {
    const { setData, states: NJS } = useDataContext()
    const colors = useThemeColors()
    const authContext = useAuthContext()
    const { navigate } = useNavigation()

    const [isRereshing, setIsRereshing] = useState(false)

    const handleNavigateexplore = (genre: string) => {
        (navigate as any)?.("Explorer", { genre });
        setData('states', 'isHeaderHidden', true);
    }

    const posts = useQuery(
        ['posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}posts?username=${authContext?.user?.account?.username}`,
            method: 'GET',
        }),
        {
            getNextPageParam: (lastPage) => (lastPage as any).next_page_url,
        }
    )

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


    const Post = (
        <SlideCarousel
            headline='Tranding Now 🔥'
            items={Videos} />
    )

    return (
        <UserLayout>
            <PostsList
                invertStickyHeaders
                stickyHeaderHiddenOnScroll
                ListHeaderComponent={Post}
                list={(posts?.data?.data as any)?.data ?? []}
                onRefresh={posts?.refetch}
                isRefrehing={posts?.isFetching} />
        </UserLayout>
    )
}
