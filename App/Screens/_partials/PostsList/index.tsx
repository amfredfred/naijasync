import { View, FlatList, StyleSheet } from 'react-native'
import { IPostItem } from '../../../Interfaces'
import useThemeColors from '../../../Hooks/useThemeColors'

export const Empty = () => {
    const themeColors = useThemeColors()

    return (
        <View style={{ height: 340, paddingTop: 10 }}>
            <View style={[styles.postWrapper, { padding: 10 }]}>
                <View style={{ height: '100%', paddingLeft: 10, justifyContent: 'flex-start' }}>
                    <View style={{ width: 40, aspectRatio: 1, borderRadius: 50, backgroundColor: themeColors.background, opacity: .6 }} />
                </View>
                <View style={[styles.postContentWrapper, { backgroundColor: themeColors.background, opacity: .6 }]} />
            </View>
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
        borderRadius: 10
    }
})