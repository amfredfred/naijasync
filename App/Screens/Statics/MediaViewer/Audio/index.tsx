import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import Animated, { SlideInDown, SlideInUp, SlideOutDown } from 'react-native-reanimated'
import { IMediaPlayable } from '../Interface'
import { IThemedComponent } from '../../../../Interfaces'
import { Audio } from 'expo-av'
import { forwardRef, useState } from 'react'
import { IconButton } from '../../../../Components/Buttons'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { useMediaPlaybackContext } from '../Context'
import { Videos } from '../../../../dummy-data'

const { width, height } = Dimensions.get('window')

export type IAudioPlayer = IThemedComponent & IMediaPlayable & {
    ref: React.RefObject<Audio.SoundObject>
    thumbnailUri?: string
    audioList?: [{

    }]
}

const AudioPlayer = forwardRef<Audio.SoundObject, IAudioPlayer>((props, ref) => {
    const { thumbnailUri, ...AV } = props
    const colors = useThemeColors()

    const [isShwoingList, setisShwoingList] = useState(false)
    const handleToggleAudioList = () => {
        setisShwoingList(s => !s)
    }


    const handleRefreshAudioList = () => {

    }

    console.log(AV.states?.playState)

    const AudioList = (
        <Animated.View
            entering={SlideInDown}
            style={[styles.audioListContainer]}>
            <View style={[styles.spaceBetween, { backgroundColor: 'red', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 50, overflow: 'hidden', width: '100%' }]}>
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
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ padding: 10 }}
                data={[...Videos, ...Videos]}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={[styles.spaceBetween, styles.audioListItem, { opacity: AV.source === item.src ? .5 : 1 }]}>
                            <View style={[styles.spaceBetween, { paddingHorizontal: 0, flex: 1 }]}>
                                <View style={[styles.spaceBetween, { paddingHorizontal: 0 }]}>
                                    <Image
                                        style={[styles.audiolistItemImage]}
                                        source={{ uri: item.thumb }}
                                    />
                                    <View style={[styles.audioListItemTextContent]}>
                                        <Text children="Kene Lu Ya" style={{ padding: 0, fontWeight: '800', fontSize: 18, color: colors.text }} />
                                        <Text children="ADA Ehi" style={{ fontSize: 11, fontWeight: '300', color: colors.text }} />
                                    </View>
                                </View>
                                <View style={[styles.spaceBetween, { paddingHorizontal: 0 }]}>
                                    <TouchableOpacity
                                        style={[styles.iconsButton]}
                                        onPress={() => AV?.handleDownloadItem(item.src)}  >
                                        <MaterialIcons
                                            name='file-download'
                                            color={colors.text}
                                            size={25} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.iconsButton]}
                                        onPress={() => {
                                            AV.source !== item.src ? AV?.connect(item?.src, item.thumb) : AV.source === item.src && AV.states?.playState === 'paused' ? AV?.play() : AV.pause()
                                        }}     >
                                        {/* props?.connect(item?.src, item.thumb) */}
                                        <Ionicons
                                            size={25}
                                            color={colors.text}
                                            name={AV.source !== item.src ? "play" : AV.source === item.src && AV.states?.playState === 'paused' ? 'play' : AV.source === item.src && AV.states?.playState === 'canPlay' ? 'play' : 'pause'} />
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
        <Animated.View
            style={[styles.container, { backgroundColor: colors.background2, position: isShwoingList ? 'absolute' : 'relative' }]}>
            {!isShwoingList || AudioList}

            <View style={[{ backgroundColor: colors.background2 }]}>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${AV?.states.progress ?? 0}%` }]} />
                </View>
                <View style={[styles.spaceBetween]}>
                    <Image
                        source={{ uri: thumbnailUri }}
                        style={{ width: 40, borderRadius: 50, aspectRatio: 1 }}
                        resizeMethod='resize'
                        resizeMode='contain'
                    />

                    <View
                        style={{ padding: 0, flex: 1 }} >
                        <TouchableOpacity  >
                            <Text children="Kene Lu Ya" style={{ padding: 0, fontWeight: '800', fontSize: 18, color: colors.text }} />
                            <Text children="ADA Ehi" style={{ fontSize: 11, fontWeight: '300', color: colors.text }} />
                        </TouchableOpacity>
                    </View>

                    <IconButton
                        onPress={handleToggleAudioList}
                        icon={<MaterialIcons
                            name={isShwoingList ? 'close' : 'queue-music'}
                            color={colors.text}
                            size={40}
                        />}
                    />
                    {/* <IconButton
                        onPress={AV.states.playState === 'playing' ? AV?.pause : AV.play}
                        icon={<MaterialIcons
                            name={'more-horiz'}
                            color={colors.text}
                            size={40}
                        />}
                    /> */}
                    <IconButton
                        onPress={AV.states.playState === 'playing' ? AV?.pause : AV.play}
                        containerStyle={{}}
                        icon={<Ionicons
                            name={AV.states.playState === 'playing' ? 'pause' : 'play'}
                            color={colors.text}
                            size={40}
                        />}
                    />
                </View>
            </View>
        </Animated.View>
    )

})

export default AudioPlayer


const styles = StyleSheet.create({
    container: {
        padding: 0,
        width: '100%',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        gap: 10
    },
    audioListContainer: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: height / 2,
        width: '100%',
    },
    audioListItem: {
        height: 50,
        paddingHorizontal: 0,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden'
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
    },


    button: {

    },
    progressBarContainer: {
        width: '100%',
        height: 3,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'red',
    },
    seekContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 20,
    },
    seekBar: {
        height: '100%',
        backgroundColor: 'transparent',
    },
})