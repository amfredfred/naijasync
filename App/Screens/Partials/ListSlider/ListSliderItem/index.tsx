import { Button } from "../../../../Components/Buttons"
import { ContainerBlock } from "../../../../Components/Containers"
import { SpanText } from "../../../../Components/Texts"
import { IPostItem } from "../../../../Interfaces"
import { Image, ImageBackground, useWindowDimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

export const VideoListItem = (props: IPostItem) => {
    const { width, height } = useWindowDimensions()
    const { thumb, caption, src, index, stretched, explorer } = props
    const { navigate } = useNavigation()
    const [isLonPressed, setisLonPressed] = useState(false)

    const handleOnPress = (props: IPostItem) => {
        console.log("PRESSED")
        props?.onPress?.(props)
        // return props
    }

    return (
        <Button
            onLongPress={() => setisLonPressed(true)}
            onPressOut={() => setisLonPressed(false)}
            onPress={() => handleOnPress(props)}
            // (navigate as any)?.('View', props)
            title={null}
            style={{
                padding: 0,
            }}
            containerStyle={{
                padding: 0,
                height: 148,
                maxHeight: 160,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'black',
                flexGrow: 1,
                aspectRatio: isLonPressed ? 16 / 9 : stretched ? 16 / 9 : 11 / 18,
            }}
            activeOpacity={.7} >
            <Image
                source={{ uri: thumb }}
                style={{
                    width: '100%',
                    height: '100%',
                }}

                resizeMethod="auto"
                resizeMode='cover' />
        </Button>
    )
}

export const AudioListItem = (props: IPostItem) => {
    const { } = props

    return <SpanText>audio list type</SpanText>
}


export default function ListSlideItem(props: IPostItem) {
    const { type, } = props
    switch (type) {
        case 'audio':
            return <AudioListItem {...props} />
        case 'video':
            return <VideoListItem {...props} />
        default:
            return null
    }
}
