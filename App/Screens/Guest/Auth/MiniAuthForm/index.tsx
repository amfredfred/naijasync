import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { Dimensions, View, StyleSheet, StatusBar } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { IThemedComponent } from '../../../../Interfaces'

const { height, width } = Dimensions.get('window')

const VIDEO_HEIGHT = 200

export default function MiniAuhForm(props: IThemedComponent) {
    const conH = useSharedValue(0);
    const draggingVideo = useSharedValue(false)
    const lastDragPosition = useSharedValue(34);
    const contConH = useSharedValue(VIDEO_HEIGHT)
    const contConDis = useSharedValue('none')
    const listConOpacity = useSharedValue(1)

    const colors = useThemeColors()


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

    if (props.hidden) return null

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.container, conAnimatedStyle, { borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: colors.background }]}>
            {/* VIDEO CONTAINER */}

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
    },
    containerInner: {
        backgroundColor: 'green',
    },


});