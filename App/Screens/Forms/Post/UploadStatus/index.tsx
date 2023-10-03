import * as Library from 'expo-media-library'
import Animated from 'react-native-reanimated'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { useRef, useState, useEffect } from 'react'
import { Foundation, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { IPostItem } from '../../../../Interfaces'
import { Camera, useCameraDevice, useCameraPermission, CameraPosition, useMicrophonePermission } from 'react-native-vision-camera'
import { SpanText } from '../../../../Components/Texts'
import * as Animatable from 'react-native-animatable'

const { height, width } = Dimensions.get('window')

export default function UploadStatusFrom(post?: IPostItem & { formMode: 'Post' | 'Update' }) {

    const [CamType, setCamType] = useState<CameraPosition>('back');
    const [camMode, setCamMode] = useState<'video' | 'photo'>('photo')
    const camDevie = useCameraDevice(CamType)
    const { hasPermission: hasCamPermission, requestPermission: requestCamPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();

    const rotatateIcon = useRef(null);
    const rotate = () => {
        flipCamera()
        rotatateIcon.current.animate('rotate');
    };
    const flipCam = useRef(null);
    const flipCamera = () => {
        flipCam.current.animate('flipInY');
    };

    useEffect(() => {
        const Permit = async () => {
            if (!hasCamPermission)
                await requestCamPermission()
            if (camMode === 'video')
                if (!hasMicPermission)
                    await requestMicPermission()
        }
        Permit()
    }, [hasCamPermission, requestCamPermission, camMode])

    const themeColors = useThemeColors()

    const Controls = (
        <View style={[styles.mediaExplorerContainer]}>
       
            <View style={{ alignItems: 'center', flex: 1 }}>
                <TouchableOpacity
                    style={{ backgroundColor: themeColors.background2, borderRadius: 50, padding: 5, paddingHorizontal: 20 }}
                    onPress={() => {
                        setCamMode(cam => cam === 'video' ? 'photo' : 'video')
                    }}
                >
                    <SpanText style={{ textTransform: 'uppercase', fontSize: 12 }}>
                        {camMode === 'photo' ? 'CAPTURE' : 'VIDEO'}
                    </SpanText>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity>
                    <Foundation
                        color={themeColors?.text}
                        size={30}
                        style={{ backgroundColor: camMode === 'video' ? 'red' : themeColors?.background2, textAlign: 'center', padding: 10, borderRadius: 50, aspectRatio: 1 }}
                        name={camMode === 'video' ? 'record' : 'camera'} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => {
                    rotate()
                    setCamType(cam => cam === 'back' ? 'front' : 'back')
                }}
                style={{ position: 'relative', alignItems: 'center', padding: 5, borderRadius: 50 }}   >
                <Animatable.View
                    ref={rotatateIcon}
                    animation="rotate"
                    duration={300}
                    direction='alternate-reverse'
                >
                    <MaterialIcons
                        name='rotate-left'
                        style={{ aspectRatio: 1 }}
                        size={30}
                        color={themeColors.text}
                    />
                </Animatable.View>
            </TouchableOpacity>
        </View >
    )

    return (
        <View
            style={[styles.container, {}]}>
            {/* {Heading} */}
            <Animatable.View
                style={[styles.camContainer, { backgroundColor: themeColors.background2 }]}>
                <Animatable.View
                    style={[styles.camContainer]}
                    animation={'fadeIn'}
                    duration={1500}
                    delay={0}
                    iterationCount={0}
                    iterationDelay={0}
                    ref={flipCam}   >
                    <View style={{position:'absolute', left:0, height:'100%',width:'100%',zIndex:10, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:40, opacity:.2}}>COING SOON</Text>
                    </View>
                    <Camera style={[styles.camStyles, StyleSheet.absoluteFill]} device={camDevie} isActive={camDevie != undefined} />
                </Animatable.View>
            </Animatable.View>
            {Controls}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        position: 'relative'
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 2,
    },
    camContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
        height: 680,
        width: '100%'
    },
    camStyles: {
        position: 'relative',
    },

    mediaExplorerContainer: {
        left: 0,
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: 10
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