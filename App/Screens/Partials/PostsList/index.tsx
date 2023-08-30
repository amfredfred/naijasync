import { REQUESTS_API } from '@env'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { IPostItem } from '../../../Interfaces'
import PostItem from './__/PostItem'
import useThemeColors from '../../../Hooks/useThemeColors'
import TabSelector from '../TabSelector'
import ContentTables from '../ContentTables'
import { SpanText } from '../../../Components/Texts'

export default function PostsList() {

    const [isRereshing, setIsRereshing] = useState(false)
    const themeColors = useThemeColors()

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

        posts?.refetch()

    }


    useEffect(() => {
        console.log(posts.status)

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

        console.log((posts?.data?.data as any)?.data)

        return () => {
            // posts.remove()
        }
    }, [posts.status])

    const Empty = () => (
        <View style={{ height: 340, paddingTop: 10 }}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <View style={{ width: 40, aspectRatio: 1, borderRadius: 50, backgroundColor: themeColors.background2, opacity: .6 }} />
                </View>
                <View style={[styles.postContentWrapper, { backgroundColor: themeColors.background2, opacity:.6}]} >

                </View>
            </View>
        </View>
    )

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                stickyHeaderIndices={[0]}
                stickyHeaderHiddenOnScroll
                invertStickyHeaders
                ListHeaderComponent={<ContentTables />}
                ItemSeparatorComponent={() => <View style={{ backgroundColor: themeColors.background2, height: 5 }} />}
                style={{ flex: 1 }}
                data={(posts?.data?.data as any)?.data ?? []}
                renderItem={({ item, index }) => (<PostItem {...item} />)}
                ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
                refreshControl={<RefreshControl onRefresh={handleOnRefreshList} refreshing={isRereshing} />}
                {...{}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    postWrapper: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        flexGrow: 1
    },
    postContentWrapper: {
        flex: 1,
        height: '100%',
        paddingRight: 10,
        borderRadius:10
    }
})