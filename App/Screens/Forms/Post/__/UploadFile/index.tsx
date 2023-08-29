import { Image, TouchableOpacity, View, Text, Dimensions, StyleSheet, TextInput, ImageBackground } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../../../Hooks/useThemeColors";

import UploadIcon from '../../../../../../assets/upload-icon.png'
import UploadBackground from '../../../../../../assets/autumn-leaves-background.jpg'
import MusicalLandscape from '../../../../../../assets/muusical-landscape.jpg'

import { useEffect, useRef, useState } from 'react'
import Animated, { SlideInDown, SlideOutDown, SlideOutUp, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { HeadLine, SpanText } from "../../../../../Components/Texts";
import { usePostFormContext } from "../../../../../Contexts/FormContext";
import { IPostContext } from "../../../../../Interfaces/IPostContext";
import * as FilePicker from 'expo-document-picker'
import { Gesture } from "react-native-gesture-handler";
import { Audio, Video, ResizeMode } from "expo-av";
import { getMediaType } from "../../../../../Helpers";
import useKeyboardEvent from "../../../../../Hooks/useKeyboardEvent";
import { IMediaType } from '../../../../../Interfaces';
import { IMediaPlayable } from '../../../../Statics/MediaViewer/Interface';

const { height, width } = Dimensions.get('window')

export default function UploadFileForm() {

    const videoMediaRef = useRef<Video>(null)
    const richText = useRef()
    const imageMediaRef = useRef<Image>(null)
    const [audioMediaRef, setAudioMediaRef] = useState<Audio.SoundObject>(null)
    const [fileType, setFileType] = useState<IMediaType>(null)
    const [mediaState, setMediaState] = useState<IMediaPlayable['states']>({})
    const [isCaptionInputFocused, setisCaptionInputFocused] = useState(false)
    const [isyKeyboardShown, setisyKeyboardShown] = useState(false)

    const [sessionValues, setsessionValues] = useState<IPostContext>({ postType: 'UPLOAD' })

    useKeyboardEvent({
        onShow: () => setisyKeyboardShown(true),
        onHide: () => setisyKeyboardShown(false),
    })


    useEffect(() => {

        const FT = getMediaType(sessionValues?.file?.uri)
        setFileType(FT)

        return () => {
            setFileType(null)
            setMediaState(s => ({ ...s, playState: 'paused' }))
        }

    }, [sessionValues?.file?.uri])


    const playPauseMedia = async () => {
        console.log(mediaState, fileType)
        try {
            if (fileType === 'audio') {
                if (!audioMediaRef)
                    setAudioMediaRef(await Audio.Sound.createAsync({
                        uri: sessionValues?.file?.uri,
                    }, {}, handlePlaybackStatusUpdate))
                if (mediaState.playState !== 'playing') {
                    setMediaState(s => ({ ...s, playState: 'playing' }))
                    await audioMediaRef?.sound?.playAsync()
                }
                else {
                    setMediaState(s => ({ ...s, playState: 'paused' }))
                    await audioMediaRef?.sound?.pauseAsync()
                }
            }
            else if (fileType === 'video') {
                if (videoMediaRef?.current) {
                    if (mediaState.playState !== 'playing') {
                        setMediaState(s => ({ ...s, playState: 'playing' }))
                        await videoMediaRef?.current?.playAsync()
                    }
                    else {
                        setMediaState(s => ({ ...s, playState: 'paused' }))
                        await videoMediaRef?.current?.pauseAsync()
                    }
                }
            }
        } catch (error) {
            console.log("ERROR-> ", error)
        }
    }

    const themeColors = useThemeColors()
    const { methods, states } = usePostFormContext()

    // Gesture
    const eContinerHeight = useSharedValue(height / 1.7)
    const lasDragPostion = useSharedValue(0)
    const eContinerReanimated = useAnimatedStyle(() => ({
        height: eContinerHeight.value
    }))

    const gesture = Gesture
        .Pan()
        .onBegin(() => { })
        .onStart(() => { })
        .onUpdate(e => {
            eContinerHeight.value = Math.max(120, Math.min(e.translationY + lasDragPostion.value, height / 1.7))
            console.log(eContinerHeight.value)
        })
        .onEnd(e => {
            lasDragPostion.value = Math.max(50, e.translationY)
        })

    //Handlers
    const handlePickDocument = async () => {
        let [type, multiple] = [['image/*', "video/*", "audio/*"], false]
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                multiple,
                type,
            })
            if (!pickedItems.canceled) {
                setsessionValues(S => ({
                    ...S, file: {
                        uri: pickedItems.assets?.[0]?.uri,
                        size: pickedItems.assets?.[0]?.size,
                        name: pickedItems.assets?.[0]?.name,
                        type: pickedItems?.assets?.[0]?.mimeType
                    }
                }))
                if (['video', 'image'].includes(fileType))
                    setsessionValues(S => ({ ...S, thumbnail: pickedItems.assets?.[0]?.uri }))
            }
        } catch (error) {
            console.log("ERROR handlePickDocument -> ", error)
        }
    }

    const handlePlaybackStatusUpdate = (data) => {
        if (data?.isLoaded && !data.isPlaying && data.didJustFinish) {
            console.log('Media playback has ended.');
            setMediaState(s => s = ({ playState: 'ended' }));
            videoMediaRef?.current?.setPositionAsync(0)
            audioMediaRef?.sound?.setPositionAsync(0)
        }
        const { positionMillis, playableDurationMillis, durationMillis } = data;
        const calculatedProgress = (positionMillis / playableDurationMillis) * 100;
        setMediaState((prevState) => ({
            ...prevState,
            progress: Number((calculatedProgress ?? 0).toFixed(0)),
            duration: durationMillis / 1000
        }));
    };

    const handlePickThumb = async () => {
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                type: ['image/jpg', 'image/png', 'image/jpeg']
            })
            if (!pickedItems.canceled)
                setsessionValues(S => ({ ...S, thumbnail: pickedItems.assets?.[0]?.uri }))
        } catch (error) {
            console.log("ERROR handlePickThumb -> ", error)
        }
    }

    const handelRemoveMediaFromSelection = () => {
        setsessionValues(S => ({ ...S, files: null }))
    }

    const PostCaption = (
        <View style={[styles.textInputContainner, { height: isyKeyboardShown ? 'auto' : 55 }]}>
            <HeadLine
                style={{ padding: 10, opacity: .7 }}
                hidden={!isyKeyboardShown}
                children={'📢 Attention You! 📢'} />
            <SpanText
                style={{ fontSize: 12, padding: 10, opacity: .5 }}
                hidden={!isyKeyboardShown}
            >
                Adding captions to your posts can make a world of difference! It's more than just text
                - it's a chance to share your story, your thoughts, and your personality.{'\n'}{'\n'}
                Captions help your audience understand what your post is all about. Whether it's a breathtaking photo, a funny moment, or an inspiring quote, a caption gives context and meaning to your content.
            </SpanText>
            <TextInput
                onFocus={() => setisCaptionInputFocused(true)}
                onBlur={() => setisCaptionInputFocused(false)}
                style={[styles.textInput, { color: themeColors.text }]}
                placeholder={isyKeyboardShown ? "Type your caption here..." : "What's up? caption 🖋️"}
                value={null}
                onChangeText={null}
                multiline
                textBreakStrategy="highQuality"
                placeholderTextColor={themeColors.text}
                returnKeyType="default"
            />
        </View>
    )

    const displayType = () => {
        switch (fileType) {
            case 'video':
                return (
                    <View style={{ width: '100%', flex: 1 }}>
                        <Video
                            resizeMode={ResizeMode.CONTAIN}
                            style={{ flex: 1, width: '100%' }}
                            ref={videoMediaRef}
                            source={{ uri: sessionValues?.file?.uri }}
                            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        />
                    </View>
                )
            case 'image':
                return (
                    <View style={{ width: '100%', flex: 1, position: 'relative' }}>
                        <Image
                            source={{ uri: sessionValues?.file?.uri }}
                            style={{ flex: 1, width: '100%' }}
                            resizeMethod='resize'
                            resizeMode='contain'
                        />
                    </View>
                )
            case 'audio':
                return (
                    <ImageBackground
                        source={MusicalLandscape}
                        blurRadius={10}
                        style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                        <Ionicons

                            name='musical-note'
                            color={themeColors.text}
                            size={100}

                        />
                    </ImageBackground>
                )
        }
    }

    const ThumbPreviewer = (
        <View style={[styles.thumbPreviewBackgroundImage]}>
            <ImageBackground
                source={{ uri: sessionValues?.thumbnail }}
                blurRadius={300}
                resizeMethod="resize"
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}   >
                <TouchableOpacity
                    onPress={handlePickThumb}
                    style={[styles.spaceBetween, {
                        position: 'absolute',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        height: '100%',
                        justifyContent: 'center'
                    }]}>
                    <Text
                        style={[styles.textStyle, { color: themeColors.text }]}>
                        Cover Image
                    </Text>
                </TouchableOpacity>
                {
                    sessionValues?.thumbnail && (
                        <View>
                            <Animated.Image
                                entering={SlideInDown}
                                exiting={SlideOutDown}
                                style={{ height: '100%', width: '100%' }}
                                resizeMethod="resize"
                                resizeMode="cover"
                                source={{ uri: sessionValues?.thumbnail }}
                            />
                            <View style={[styles.spaceBetween, { position: 'absolute', right: 10, top: 10, padding: 0 }]}>
                                <MaterialIcons
                                    onPress={() => setsessionValues(S => ({ ...S, thumbnail: null }))}
                                    style={[styles.iconsStyle]}
                                    size={20}
                                    color={themeColors.text}
                                    name="delete" />
                                <MaterialIcons
                                    onPress={handlePickThumb}
                                    style={[styles.iconsStyle]}
                                    size={20}
                                    color={themeColors.text}
                                    name="image" />
                            </View>
                        </View>
                    )
                }
            </ImageBackground>
        </View>
    )

    const FileExplorer = (
        <View style={[{ flex: 1 }]}>
            <ImageBackground
                source={UploadBackground}
                resizeMethod="resize"
                resizeMode="stretch"
                blurRadius={100}
                style={{ flex: 1 }}>
                <TouchableOpacity
                    style={[styles.spaceBetween, { flex: 1, opacity: .3, justifyContent: 'center' }]}
                    onPress={handlePickDocument}   >
                    <Image source={UploadIcon} />
                </TouchableOpacity>

                {/* <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.fileExplorerContainer, eContinerReanimated]}>
                        <View style={[styles.spaceBetween, { height: 20, justifyContent: 'center' }]}>
                            <View style={[styles.contentDescriptionContainerBar, { backgroundColor: themeColors.text }]} />
                        </View>

                    </Animated.View>
                </GestureDetector> */}
            </ImageBackground>
        </View>
    )

    const PreviewUploadedFile = (
        <View style={[styles.uploadededFilePreviewContainer, { padding: isyKeyboardShown ? 0 : 10 }]}>
            {
                isyKeyboardShown || (
                    <View style={[styles.spaceBetween, styles.uploadedFileContainer]}>
                        <View style={{ borderRadius: 10, overflow: 'hidden', flex: 1 }}>
                            <ImageBackground
                                blurRadius={100}
                                source={{ uri: sessionValues?.file?.uri }}
                                style={[styles.uploadedFilePreviewInnerContainer]}>
                                {displayType()}
                                {mediaState?.playState !== 'playing' && ThumbPreviewer}
                            </ImageBackground>
                        </View>
                        <View style={[{ zIndex: 5, right: 0, height: '100%', padding: 6, justifyContent: 'space-between', backgroundColor: themeColors.background }]}>
                            <View style={[{ gap: 10 }]}>
                                <MaterialIcons
                                    onPress={() => setsessionValues(S => ({ ...S, file: null }))}
                                    style={[styles.iconsStyle, { height: 40 }]}
                                    size={30}
                                    color={themeColors.text}
                                    name="delete" />
                                <MaterialIcons
                                    onPress={handlePickDocument}
                                    style={[styles.iconsStyle, { height: 40 }]}
                                    size={30}
                                    color={themeColors.text}
                                    name="find-replace" />
                            </View>
                            {['video', 'audio'].includes(fileType) &&
                                <Ionicons
                                    style={[styles.iconsStyle, { height: 40 }]}
                                    onPress={playPauseMedia}
                                    color={themeColors.text}
                                    size={30}
                                    name={mediaState.playState === 'paused' ? 'play' : mediaState.playState === 'playing' ? 'pause' : 'play'} />
                            }
                        </View>
                    </View>
                )
            }

            {PostCaption}
        </View>
    )

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.constainer, {}]}>
            {sessionValues?.file ? PreviewUploadedFile : FileExplorer}
        </Animated.View>
    )
}



const styles = StyleSheet.create({
    constainer: {
        height: '100%',
        // padding: 10
    },
    textInputContainner: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'flex-end',
        marginTop: 30,
        overflow: 'hidden'
    }
    ,
    textEditoContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        minHeight: 100,
        justifyContent: 'center',
        flexGrow: 1,
        maxHeight: 'auto'
    },
    fileExplorerContainer: {
        height: height / 2.3,
        width: '100%',
        backgroundColor: 'red',
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        bottom: 0,
        // position: 'absolute',
    },
    textInput: {
        paddingHorizontal: 10,
        fontWeight: '300',
        fontSize: 17
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10,
        position: 'relative'
    },
    textStyle: {
        fontSize: 18,
        fontWeight: '500'
    },
    thumbPreviewBackgroundImage: {
        height: 110,
        position: 'absolute',
        left: 10,
        bottom: 10,
        aspectRatio: '16/9',
        borderRadius: 10,
        overflow: 'hidden'
    },
    uploadededFilePreviewContainer: {
        width: '100%',
        height: '100%',
        padding: 10,
        justifyContent: 'flex-end'
    },
    uploadedFilePreviewInnerContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end'
    },
    uploadedFileContainer: {
        flex: 1,
        position: 'relative',
        padding: 0
    },
    contentDescriptionContainerBar: {
        width: 60,
        height: 5,
        borderRadius: 50,
        backgroundColor: 'red'
    },
    iconsStyle: {
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 30,
        padding: 3,
        aspectRatio: 1,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    textEditor: {

    }
})