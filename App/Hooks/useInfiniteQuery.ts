'use strict'

import { useEffect, useState } from "react";
import { useInfiniteQuery as tanUseInfiniteQuery } from '@tanstack/react-query'
import { IUseInfiniteQueryArgs, IUseInfiniteQueryParams } from "../Interfaces";
import useEndpoints from "./useEndpoints";

export default function useInfiniteQuery(props: IUseInfiniteQueryArgs): IUseInfiniteQueryParams {

    const [$Results, set$Results] = useState<any>()
    const endpoint = useEndpoints()

    const fetch = async ({ pageParam = 1 }) => await endpoint.useGetMethod(props?.url.concat(`?page=${pageParam}${props.chainedQuery}`))

    const infiniteQuery = tanUseInfiniteQuery({
        queryKey: [props.querykey],
        queryFn: fetch,
        getNextPageParam: (lastPage, pages) => {
            let next_page = (lastPage as any).data?.next_page_url?.split?.('=',)[1]
            return next_page
        },
        keepPreviousData: true,
        enabled: props.enabled,
        select: (data) => ({
            pages: [...data.pages],
            pageParams: [...data.pageParams],
        }),
        cacheTime: 10000
    })

    const onRefetch = () => {
        infiniteQuery?.remove()
        infiniteQuery?.refetch()
    }

    useEffect(() => {
        const mergePosts = []
        infiniteQuery?.data?.pages?.map((page, index, array) => mergePosts?.push(...(page?.data as any)?.data))
        set$Results(P => mergePosts)
    }, [infiniteQuery?.data])

    const loadMoreItems = async () => {
        if (infiniteQuery?.hasNextPage)
            await infiniteQuery?.fetchNextPage()
    };


    return {
        loadMoreItems,
        onRefetch,
        error: infiniteQuery.error,
        results: $Results,
        hasNextPage: infiniteQuery.hasNextPage,
        isRefetching: infiniteQuery.isRefetching
    } satisfies IUseInfiniteQueryParams
}