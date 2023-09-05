import { View, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { IPostItem } from '../../../Interfaces'
import PostItem from './__/PostItem'
import useThemeColors from '../../../Hooks/useThemeColors'

interface IPostList {
    list: IPostItem[],
    onRefresh?(): void,
    isRefrehing?: boolean
    ListHeaderComponent?: FlatList['props']['ListHeaderComponent']
}

export default function PostsList({ list, onRefresh, isRefrehing, ListHeaderComponent }: IPostList) {

    const themeColors = useThemeColors()

    const handleOnRefreshList = () => {

        onRefresh?.()

    }

    const Empty = () => (
        <View style={{ height: 340, paddingTop: 10 }}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <View style={{ width: 40, aspectRatio: 1, borderRadius: 50, backgroundColor: themeColors.background2, opacity: .6 }} />
                </View>
                <View style={[styles.postContentWrapper, { backgroundColor: themeColors.background2, opacity: .6 }]} >

                </View>
            </View>
        </View>
    )

    return (
        <FlatList
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll
            invertStickyHeaders
            ListHeaderComponent={ListHeaderComponent}
            ItemSeparatorComponent={() => <View style={{ backgroundColor: themeColors.background2, height: 5 }} />}
            style={{ flex: 1 }}
            data={list}
            renderItem={({ item, index }) => (<PostItem {...item} />)}
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            refreshControl={<RefreshControl onRefresh={handleOnRefreshList} refreshing={isRefrehing} />}
            keyExtractor={(p) => p.puid.trim()}
            {...{}}
        />
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
        borderRadius: 10
    }
})