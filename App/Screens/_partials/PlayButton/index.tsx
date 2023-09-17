import { TouchableOpacity, ActivityIndicator } from 'react-native'
import { IMediaPlayable } from '../../Statics/Interface'
import { Ionicons } from '@expo/vector-icons'

export default function PlayButton(props: IMediaPlayable) {

    let Component = null;
    if (!props?.states?.isReady || props?.states?.playState === 'loading')
        Component = <ActivityIndicator size={25} color={'white'} />
    else
        Component = <Ionicons
            color={'white'}
            size={25}
            name={(props?.states?.playState == 'ended') ? 'play-circle' : props?.states?.playState == 'playing' ? 'pause' : 'play'} />

    return (
        <TouchableOpacity
            disabled={!props?.states?.isReady || props?.states?.playState === 'loading'}
            onPress={props?.states?.playState === 'playing' ? props?.pause : props?.play}
            children={Component}
        />
    )
}