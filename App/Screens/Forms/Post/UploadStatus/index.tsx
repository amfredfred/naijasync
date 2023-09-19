import * as Library from 'expo-media-library'
import Animated, { SlideInDown, SlideInLeft, SlideOutLeft, SlideOutUp } from 'react-native-reanimated'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useRef, useState, useEffect } from 'react'
import { SpanText } from '../../../../Components/Texts'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const { height, width } = Dimensions.get('window')

export default function UploadStatusFrom() {
    const [libpermission, requestLibPermission] = Library.usePermissions()
    const [mediaFiles, setMediaFiles] = useState<Library.AssetInfo[]>([])

    const richText = useRef()
    const themeColors = useThemeColors()

    const MediLibrary = (
        <Animated.View>
            <Text>
                STATUS SCREEN
            </Text>
        </Animated.View>
    )

    const gesture = Gesture.Pan()

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.constainer, {}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, padding: 10, alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'red', width: 40, aspectRatio: 1, borderRadius: 50 }}>
                    <TouchableOpacity onPress={null} style={[]}   >
                        <MaterialCommunityIcons style={[styles.postTypeButtonIcon, { backgroundColor: themeColors.text }]} name='upload-multiple' />
                    </TouchableOpacity>
                </View>

            </View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.mediaExplorerContainer, { backgroundColor: themeColors.background2 }]}>
                    <Animated.ScrollView>
                        <SpanText>
                            COMIGN SOON !!!
                        </SpanText>
                    </Animated.ScrollView>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        position: 'relative',
        flexGrow: 1
    },
    mediaExplorerContainer: {
        height: 80,
        width: '100%',
        flexGrow: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    textEditoContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        minHeight: 100,
        justifyContent: 'center',
        flexGrow: 1,
        maxHeight: height / 3
    },
    postTypeButtonIcon: {
        backgroundColor: 'green',
        borderRadius: 50,
        fontSize: 30,
        aspectRatio: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 6,
    },
    textEditor: {

    }
})