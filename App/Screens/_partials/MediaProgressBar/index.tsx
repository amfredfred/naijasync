import { View, TouchableOpacity, StyleSheet } from "react-native"
import { IMediaPlayable } from "../../Statics/Interface"
import { ITheme, IThemedComponent } from "../../../Interfaces"

export type IMediaPlayerControls = IMediaPlayable['states'] & IThemedComponent  

export default function MediaProgressBard(props: IMediaPlayerControls) {

    const { duration, position, bufferProgress, progress,   hidden, playState } = props

    if (hidden) return null

    return (
        <TouchableOpacity
            onPress={() => console.log("------")}
            style={[styles.playControlsContainer]} >
            <View style={{ flex: 1 }} >
                <View
                    style={[styles.mediaProgressContainer]}>
                    <View style={[styles.mediaProgressBar, { width: `${progress * 100}%` }]}>
                        {playState === 'paused' && <View style={[styles.mediaProgressarPointer]} />}
                    </View>
                    <View style={[styles.mediaBufferBar, { width: `${bufferProgress * 100}%` }]} />
                </View>
                
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    playControlsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },


    // 
    mediaProgressContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 3,
        position: 'relative',
        borderRadius: 50,
    },
    mediaBufferBar: {
        backgroundColor: 'green',
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


