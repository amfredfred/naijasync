import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import Animated, { SlideInDown, SlideInLeft, SlideOutLeft } from 'react-native-reanimated'
import { IMediaPlayable } from '../Interface'
import { Audio } from 'expo-av'
import { forwardRef, useState } from 'react'
import { IconButton } from '../../../../Components/Buttons'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { useToast } from '../../../../Contexts/ToastContext'
import useKeyboardEvent from '../../../../Hooks/useKeyboardEvent'
import MediaPlayerControls from '../../../_partials/PlayerControls'
import { SpanText } from '../../../../Components/Texts'
import { formatPlaytimeDuration } from '../../../../Helpers'
import { ThemeProvider } from 'react-native-paper'

const { width, height } = Dimensions.get('window')

export default forwardRef<Audio.SoundObject, IMediaPlayable>((props, ref) => {
    const { thumbnailUrl, presenting, ...AV } = props
    const colors = useThemeColors()
    const { toast } = useToast()

    const [isShwoingList, setisShwoingList] = useState(false)
    const handleToggleAudioList = () => {
        setisShwoingList(s => !s)
    }




    const handleRefreshAudioList = () => {

    }

    const AudioList = (
        <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutLeft}
            style={[styles.audioListContainer]}>
            <FlatList
                stickyHeaderHiddenOnScroll
                stickyHeaderIndices={[0]}
                ListHeaderComponent={() => (
                    <View style={[styles.spaceBetween, { height: 50, overflow: 'hidden', backgroundColor: colors.background2, width: '100%' }]}>
                        <Text children="More For You 🎶" style={{ padding: 0, fontWeight: '900', fontSize: 21, color: colors.text }} />
                        <View style={[styles.spaceBetween, { paddingHorizontal: 0 }]}>
                            <TouchableOpacity
                                style={[styles.iconsButton]} >
                                <MaterialIcons
                                    name='search'
                                    color={colors.text}
                                    size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setisShwoingList(false)}
                                style={[styles.iconsButton]}  >
                                <Ionicons
                                    size={25}
                                    color={colors.text}
                                    name='close' />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden', backgroundColor: colors.background2 }}
                data={[]}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={[styles.spaceBetween, styles.audioListItem, { opacity: AV.fileUrl === item.fileUrl ? .5 : 1 }]}>
                            <View style={[styles.spaceBetween, { paddingHorizontal: 0, flex: 1 }]}>
                                <View style={[styles.spaceBetween, { paddingHorizontal: 0 }]}>
                                    <Image
                                        style={[styles.audiolistItemImage]}
                                        source={{ uri: item.thumbnailUrl }}
                                    />
                                    <View style={[styles.audioListItemTextContent]}>
                                        <Text children="Kene Lu Ya" style={{ padding: 0, fontWeight: '800', fontSize: 18, color: colors.text }} />
                                        <Text children="ADA Ehi" style={{ fontSize: 11, fontWeight: '300', color: colors.text }} />
                                    </View>
                                </View>
                                <View style={[styles.spaceBetween, { paddingHorizontal: 0 }]}>
                                    <TouchableOpacity
                                        style={[styles.iconsButton]}
                                        onPress={() => AV?.handleDownloadItem(item.fileUrl)}  >
                                        <MaterialIcons
                                            name='file-download'
                                            color={colors.text}
                                            size={25} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.iconsButton]}
                                        onPress={() => {
                                            AV.fileUrl !== item.fileUrl ? AV?.connect(item) : AV.fileUrl === item.fileUrl && AV.states?.playState === 'paused' ? AV?.play() : AV.pause()
                                        }}     >
                                        <Ionicons
                                            size={25}
                                            color={colors.text}
                                            name={AV.fileUrl !== item.fileUrl ? "play" : AV.fileUrl === item.fileUrl && AV.states?.playState === 'paused' ? 'play' : AV.fileUrl === item.fileUrl && AV.states?.playState === 'canPlay' ? 'play' : 'pause'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item) => item.id}
            />

        </Animated.View>
    )


    return (
        <Animated.View style={[styles.container, styles.spaceBetween]}>
            <View style={{ gap: 10, flex: 1, padding: 5, backgroundColor: colors.background2, borderTopRightRadius: 10 }}>
                <View style={{ gap: 10 }}>
                    <IconButton
                        onPress={AV?.remove}
                        icon={<MaterialIcons
                            name={'close'}
                            color={colors.text}
                            size={25}
                        />}
                    />
                    <IconButton
                        onPress={handleToggleAudioList}
                        icon={<MaterialIcons
                            name={isShwoingList ? 'arrow-back' : 'queue-music'}
                            color={colors.text}
                            size={25}
                        />}
                    />
                </View>

                <View style={{ alignItems: 'center',  justifyContent: 'center' }}>
                    <SpanText
                        hidden={!AV?.states?.duration}
                        style={{ fontSize: 10 }}
                        children={formatPlaytimeDuration(AV?.states?.position)} />
                    <SpanText children='/' />
                    <SpanText
                        hidden={!AV?.states?.duration}
                        style={{ fontSize: 10 }}
                        children={formatPlaytimeDuration(AV?.states?.duration)} />
                </View>
                <IconButton
                    containerStyle={{}}
                    onPress={AV.states.playState === 'playing' ? AV?.pause : AV.play}
                    icon={<Ionicons
                        name={AV.states.playState === 'playing' ? 'pause-circle' : 'play-circle'}
                        color={colors.text}
                        size={25}
                    />}
                />
            </View>
            {!isShwoingList || AudioList}
        </Animated.View>
    )

})

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 50,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        'justifyContent': 'space-between',
        gap: 5
    },
    audioListContainer: {
        borderRadius: 10,
        width: width - 60,
        height: height / 3,
        position: 'absolute',
        left: 55
    },
    audioListItem: {
        height: 50,
        paddingHorizontal: 0,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',

    },
    audiolistItemImage: {
        height: 50,
        aspectRatio: 1,
    },
    audioListItemTextContent: {
        height: 50,
        justifyContent: 'center',
        paddingVertical: 2,
    },
    iconsButton: {
        width: 40,
        aspectRatio: 1,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})