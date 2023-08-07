import { Button } from "../../../../Components/Buttons"
import { ContainerBlock } from "../../../../Components/Containers"
import { SpanText } from "../../../../Components/Texts"
import { IPostItem } from "../../../../Interfaces"
import { Image, ImageBackground, useWindowDimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export const VideoListItem = (props: IPostItem) => {
    const { width, height } = useWindowDimensions()
    const { thumb, caption, src, index, } = props
    const { navigate } = useNavigation()
    return (
        <Button
            onPress={() => navigate?.('View', props)}
            title={null}
            style={{
                height: 140,
                padding: 0,
                width: (width / 1.8),
                borderRadius: 10,
                overflow: 'hidden'
            }}
            containerStyle={{
                padding: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'pink'
            }}
            activeOpacity={.7} >
            <Image
                source={{ uri: thumb }}
                style={{ height: '100%', width: '100%' }}
                resizeMethod="auto"
                resizeMode='stretch' />
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
