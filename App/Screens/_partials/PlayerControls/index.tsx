import { View, TouchableOpacity, StyleSheet } from "react-native"
import { SpanText } from "../../../Components/Texts"
import { formatPlaytimeDuration } from "../../../Helpers"
import { IMediaPlayable } from "../../Statics/Interface"
import { ITheme, IThemedComponent } from "../../../Interfaces"

type IMediaPlayerControls = IMediaPlayable['states'] & IThemedComponent & {
    Button?: React.ReactNode
}

export default function MediaPlayerControls(props: IMediaPlayerControls) {

    const { duration, position, bufferProgress, progress, Button, hidden, playState } = props

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
                <SpanText
                    hidden={!duration}
                    style={{ fontSize: 10, padding: 0, marginTop: 5, width: '100%', textAlign: 'right', color: 'white' }}  >
                    {formatPlaytimeDuration(position)}/{formatPlaytimeDuration(duration)}
                </SpanText>
            </View>
            {Button && Button}
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    playControlsContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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


