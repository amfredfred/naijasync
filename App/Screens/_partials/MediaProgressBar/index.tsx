import { View, TouchableOpacity, StyleSheet, LayoutChangeEvent, } from "react-native"
import { IMediaPlayable } from "../../Statics/Interface"
import { ITheme, IThemedComponent } from "../../../Interfaces"
import { useState } from 'react'

export type IMediaPlayerControls = IMediaPlayable & IThemedComponent & {
    open?: boolean
}

export default function MediaProgressBard(props: IMediaPlayerControls) {

    if (props?.hidden) return null

    const { states: { duration, position, bufferProgress, progress, playState, }, open, handleSeek } = props

    const [containerWidth, setContainerWidth] = useState<number | null>(null);

    const handleSeekBarPress = (e: any) => {
        if (containerWidth !== null) {
            const { locationX } = e.nativeEvent;
            const seekPercentage = (locationX / containerWidth) * 100;
            const seekPositionMillis = ((seekPercentage / 100) * duration) * 1000;
            // Call the handleSeek function with the seekPositionMillis
            // handleSeek(seekPositionMillis);
        }
    };

    const handleContainerLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };


    return (
        <View
            style={[styles.container, { height: open ? 30 : 2 }]}
            onLayout={handleContainerLayout}   >
            <View
                onTouchMove={handleSeekBarPress}  style={[styles.playControlsContainer]} >
                    <View style={{ flex: 1 }} >
                        <View
                            style={[styles.mediaProgressContainer]}>
                            <View style={[styles.mediaProgressBar, { width: `${progress * 100}%` }]}>
                                {(playState === 'paused' || open) && <View style={[styles.mediaProgressarPointer]} />}
                            </View>
                            <View style={[styles.mediaBufferBar, { width: `${bufferProgress * 100}%` }]} />
                        </View>

                    </View> 
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'darkgrey',
        width: '100%',
    },
    playControlsContainer: {
        flexDirection: 'row',
        height: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    // 
    mediaProgressContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 3,
        position: 'relative',
        borderRadius: 50,
    },
    mediaBufferBar: {
        width: 80,
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '100%',
        borderRadius: 50,
        opacity: .2
    },
    mediaProgressBar: {
        backgroundColor: 'red',
        width: 40,
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '100%',
        zIndex: 2,
        borderRadius: 50,
    },
    mediaProgressarPointer: {
        borderRadius: 50,
        width: 10,
        aspectRatio: 1,
        backgroundColor: 'red',
        position: 'absolute',
        right: -5,
        bottom: -3.4
    }
})


