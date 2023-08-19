import { FlatList, TouchableOpacity, Image } from 'react-native'
import { AssetInfo } from 'expo-media-library'
import { RefreshControl } from 'react-native-gesture-handler'
import { useState } from 'react'
import { ContainerBlock } from '../../../../Components/Containers'
import { SpanText } from '../../../../Components/Texts'
import { formatPlaytimeDuration } from '../../../../Helpers'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export interface IMarkedAsset extends AssetInfo {
    isSelected?: boolean,
    onLongPress?(props: this): this
    onPress?(props: this): this
}

export interface IFilesBrowser {
    assets: AssetInfo[]
    isRefreshing?: boolean
    onRefresh?(props?: ("audio" | "video" | "unknown" | "photo")[]): void
    onPressItem?(prop: IMarkedAsset): IMarkedAsset
    onLongPressItem?(prop: IMarkedAsset): IMarkedAsset
    hidden?: boolean
}

const BrowseFile = (props: IMarkedAsset) => {
    const { onLongPress, onPress, isSelected } = props

    const VideoItem = (
        <TouchableOpacity
            onLongPress={() => onLongPress?.(props)}
            onPress={() => isSelected ? onLongPress?.(props) : onPress?.(props)}
            key={props.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <ContainerBlock style={{ padding: 0, position: 'relative', borderRadius: 10, overflow: 'hidden', borderWidth: 1, }}>
                <SpanText>
                    ISSELECTED {String(isSelected)}
                </SpanText>
                <Image
                    source={{ uri: props?.uri }}
                    height={90}
                    resizeMethod="resize"
                    resizeMode='contain'
                    style={{ aspectRatio: '16/9' }}
                />
                <SpanText
                    children={formatPlaytimeDuration(props.duration)}
                    numberOfLines={2}
                    style={{
                        marginBottom: 6, position: 'absolute', right: 5, bottom: 5, padding: 3, backgroundColor: 'rgba(0,0,0,0.6)',
                        lineHeight: 25, fontFamily: 'Montserrat_400Regular',
                    }} />
            </ContainerBlock>
            <ContainerBlock style={{ backgroundColor: 'transparent', paddingVertical: 0, overflow: 'hidden', flexGrow: 1, maxWidth: '60%' }}>
                <SpanText
                    children={props.filename}
                    numberOfLines={2}
                    style={{ marginBottom: 6, lineHeight: 25, fontFamily: 'Montserrat_400Regular', }} />
                <SpanText
                    children={dayjs(new Date(props.creationTime * 1000)).format('D MMM, YYYY')}
                    style={{ fontSize: 12, opacity: .6, fontFamily: 'Montserrat_400Regular', }}
                />

            </ContainerBlock>
        </TouchableOpacity>
    )

    switch (props?.mediaType) {
        case 'video':
            return VideoItem
        default:
            return null
    }
}

export function FilesBrowser(props: IFilesBrowser) {

    const { assets, onRefresh, hidden, onPressItem, onLongPressItem } = props
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [markedAssets, setMarkedAssets] = useState<IMarkedAsset['id'][]>()

    const doRefresh = () => {
        try {
            setIsRefreshing(true)
            onRefresh?.()
            setIsRefreshing(false) 
        } catch (error) {

        }
        finally {
            setIsRefreshing(false)
        }
    }

    const onPressListItem = (props: IMarkedAsset) => {


        return props
    }

    const onToggleItem = (props: IMarkedAsset) => {
        const updateableAsset = props
        updateableAsset['isSelected'] = !props.isSelected
        onLongPressItem?.(updateableAsset)
        setMarkedAssets(P => [...P, updateableAsset['id']])
        return updateableAsset
    }

    if (hidden) return null

    if (!assets?.length) return (
        <ContainerBlock style={{ padding: 10, backgroundColor: 'red' }}>
            <SpanText children={assets?.keys()} />
        </ContainerBlock>
    )

    return (
        <FlatList
            bouncesZoom={false}
            bounces={false}
            contentContainerStyle={{
                justifyContent: 'space-between',
                paddingVertical: 10,
            }}
            data={assets}
            renderItem={({ item }) => <BrowseFile
                {...item}
                onLongPress={onToggleItem}
                onPress={onPressListItem}
                isSelected={markedAssets.includes(item.id)}
            />}
            keyExtractor={({ id }) => id}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={doRefresh} />}
        />
    )
}