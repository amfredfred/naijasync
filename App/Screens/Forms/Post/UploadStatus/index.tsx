import * as Library from 'expo-media-library'
import Animated, { SlideInDown, SlideInLeft, SlideOutLeft, SlideOutUp } from 'react-native-reanimated'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useRef, useState, useEffect } from 'react'
import { SpanText } from '../../../../Components/Texts'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { IPostItem } from '../../../../Interfaces'
import { Camera, CameraType } from 'expo-camera';

const { height, width } = Dimensions.get('window')

export default function UploadStatusFrom(post?: IPostItem & { formMode: 'Post' | 'Update' }) {

    const [libpermission, requestLibPermission] = Library.usePermissions()
    const [mediaFiles, setMediaFiles] = useState<Library.AssetInfo[]>([])

    // const [CamType, setCamType] = useState(CameraType.back);
    // const [CamPermision, requestCamPermision] = Camera.useCameraPermissions();

    // useEffect(() => {

    //     const Permit = async () => {
    //         if (!CamPermision) {
    //             await requestCamPermision()
    //         }
    //         else if (!CamPermision?.granted) {
    //             await requestCamPermision()
    //         }
    //     }

    //     Permit()

    // }, [CamPermision])


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

    const Heading = (
        <View style={[styles.heading]}>
            <View style={{ backgroundColor: 'red', width: 40, aspectRatio: 1, borderRadius: 50 }}>
                <TouchableOpacity onPress={null} style={[]}   >
                    <Ionicons
                        style={[styles.postTypeButtonIcon]}
                        name='arrow-back'
                        color={'white'} />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.constainer, {}]}>
            {Heading}
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
        flexGrow: 1,
        backgroundColor: 'green',
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10,
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 2, backgroundColor: 'red'
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
        fontSize: 25,
        aspectRatio: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    textEditor: {

    }
})