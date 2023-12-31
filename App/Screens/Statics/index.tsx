import AudioPlayer from './Audio'

//
import { Video, ResizeMode } from "expo-av";
import { forwardRef, useState } from 'react'
import { IMediaPlayable } from "./Interface";
import useKeyboardEvent from '../../Hooks/useKeyboardEvent';

export const MediaViewer = forwardRef<Video, IMediaPlayable>((props, videoRef) => {

    const [isKeyboadVisible, setisKeyboadVisible] = useState(false)

    useKeyboardEvent({
        onShow: () => setisKeyboadVisible(true),
        onHide: () => setisKeyboadVisible(false)
    })

    let Component = <></>

    if (props?.presenting || isKeyboadVisible) return null
    else if (props?.type === 'audio')
        Component = <AudioPlayer
            {...props}
        />
    return (Component)
})

export default MediaViewer