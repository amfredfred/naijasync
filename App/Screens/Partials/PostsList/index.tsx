import { REQUESTS_API } from '@env'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import { IPostItem } from '../../../Interfaces'
import PostItem from './__/PostItem'

export default function PostsList() {

    const [isRereshing, setIsRereshing] = useState(false)

    const posts = useQuery(
        ['posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}posts`,
            method: 'GET',
            headers: {},
            data: {}
        }),
        {
            getNextPageParam: (lastPage) => (lastPage as any).next_page_url,
        }
    )

    const handleOnRefreshList = () => {

    }


    useEffect(() => {
        console.log(posts.status)
    }, [posts.status])

    const Empty = () => (
        <View style={{ width: 200, height: 200, backgroundColor: 'pink' }}>

        </View>
    )


    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>

            <FlatList
                style={{ flex: 1, backgroundColor: 'green' }}
                data={posts?.data?.data}
                renderItem={({ item, index }) => (<PostItem {...item} />)}
                ListEmptyComponent={() => (<Empty />)}
                onRefresh={() => <RefreshControl onRefresh={handleOnRefreshList} refreshing={isRereshing} />}
                {...{}}
            />

        </View>
    )
}