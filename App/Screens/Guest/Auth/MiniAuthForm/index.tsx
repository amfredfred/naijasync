import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { Dimensions, View, StyleSheet, StatusBar, BackHandler } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { IThemedComponent } from '../../../../Interfaces'
import { IAuthContextMethods } from '../../../../Interfaces/iAuthContext'
import { HeadLine } from '../../../../Components/Texts'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuthContext } from '../../../../Contexts/AuthContext'

const { height, width } = Dimensions.get('window')

const VIDEO_HEIGHT = 200

export default function MiniAuhForm() {
    const conH = useSharedValue(0);
    const draggingVideo = useSharedValue(false)
    const lastDragPosition = useSharedValue(34);
    const contConH = useSharedValue(VIDEO_HEIGHT)
    const contConDis = useSharedValue('none')
    const listConOpacity = useSharedValue(1)
    const authContext = useAuthContext()

    const colors = useThemeColors()

    const handleBackPress = () => {
        console.log('CALLED')
        authContext?.showMiniAuthForm?.(false)
        return true
    }

    useEffect(() => {

        const HBP = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

        console.log('CHNAGED', authContext?.isShowingMiniAuthForm)

        return () => {
            HBP?.remove()
        }
    }, [authContext?.isShowingMiniAuthForm])


    const conAnimatedStyle = useAnimatedStyle(() => {
        return {
            top: conH.value,
        };
    });

    const contentContainerStyle = useAnimatedStyle(() => {
        return {
            top: contConH.value,
            display: contConDis.value as any
        };
    });

    const listReanimated = useAnimatedStyle(() => ({
        opacity: listConOpacity.value
    }))

    const gesture = Gesture.Pan()
        .onStart(e => {
            contConH.value = withSpring(100)
            contConDis.value = 'none'
        })
        .onBegin(e => {
        })
        .onUpdate(e => {
            listConOpacity.value = Math.abs(height / Math.max(0, Math.min(lastDragPosition.value + e.translationY / 1, height - VIDEO_HEIGHT)) / 100)
            conH.value = Math.max(0, Math.min(lastDragPosition.value + e.translationY / 1, height - VIDEO_HEIGHT));
        })
        .onEnd(e => {
            if (e.translationY <= height / 2) {
                conH.value = 0
                listConOpacity.value = 1
            } else if (e.translationY >= height / 2) {
                conH.value = height - VIDEO_HEIGHT
                listConOpacity.value = 0
            }
            lastDragPosition.value = e.translationY
            draggingVideo.value = false;
        });

    if (!authContext?.isShowingMiniAuthForm) return null

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, conAnimatedStyle, { backgroundColor: colors.background }]}>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                <View></View>
                <Ionicons
                    onPress={() => authContext?.showMiniAuthForm?.(false)}
                    name='close' size={30} color={colors.text} />
            </View>
            {/* VIDEO CONTAINER */}
            <View style={[styles.containerInner]}>
                <HeadLine style={{ fontSize: 23 }} children={'Login/Register'} />

            </View>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {
        // overflow: 'hidden',
        backgroundColor: 'red',
        position: 'absolute',
        flex: 1,
        height: height,
        marginTop: StatusBar.currentHeight,
        zIndex: 10,
        width,

        justifyContent: 'flex-end'
    },
    containerInner: {
        backgroundColor: 'green',
        padding: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },


});