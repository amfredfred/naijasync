import { View, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { IPostItem } from '../../../Interfaces'
import PostItem from './__/PostItem'
import useThemeColors from '../../../Hooks/useThemeColors'
import { SpanText } from '../../../Components/Texts'

interface IPostList {
    list: IPostItem[],
    onRefresh?(): void,
    isRefrehing?: boolean
    ListHeaderComponent?: FlatList['props']['ListHeaderComponent']
    invertStickyHeaders?: FlatList['props']['invertStickyHeaders']
    stickyHeaderHiddenOnScroll?: FlatList['props']['stickyHeaderHiddenOnScroll']
    stickyHeaderIndices?: FlatList['props']['stickyHeaderIndices']
}


export const Empty = () => {
    const themeColors = useThemeColors()

    return (
        <View style={{ height: 340, paddingTop: 10 }}>
            <View style={[styles.postWrapper]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <View style={{ width: 40, aspectRatio: 1, borderRadius: 50, backgroundColor: themeColors.background, opacity: .6 }} />
                </View>
                <View style={[styles.postContentWrapper, { backgroundColor: themeColors.background, opacity: .6 }]} />
            </View>
        </View>
    )
}

export default function PostsList({ list,
    onRefresh, isRefrehing,
    ListHeaderComponent,
    invertStickyHeaders,
    stickyHeaderHiddenOnScroll,
    stickyHeaderIndices = [0]
}: IPostList) {

    const themeColors = useThemeColors()

    const handleOnRefreshList = () => {

        onRefresh?.()

    }


    return (
        <FlatList
            stickyHeaderIndices={stickyHeaderIndices}
            stickyHeaderHiddenOnScroll={stickyHeaderHiddenOnScroll}
            invertStickyHeaders={invertStickyHeaders}
            ListHeaderComponent={ListHeaderComponent}
            maxToRenderPerBatch={4}
            // ItemSeparatorComponent={() => <View style={{ backgroundColor: themeColors.background2, height: 5 }} />}
            style={{ flex: 1, backgroundColor: themeColors.background2 }}
            data={list}
            renderItem={({ item, index }) => (<PostItem {...item} />)}
            ListEmptyComponent={() => (Array.from({ length: 5 }, (_, index) => <Empty key={index} />))}
            refreshControl={<RefreshControl onRefresh={handleOnRefreshList} refreshing={isRefrehing} />}
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