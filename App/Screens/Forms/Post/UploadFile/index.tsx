import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image, Dimensions, View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../../Hooks/useThemeColors";

import UploadIcon from '../../../../../assets/upload-icon.png'
import UploadBackground from '../../../../../assets/autumn-leaves-background.jpg'
import MusicalLandscape from '../../../../../assets/muusical-landscape.jpg'

import Animated, { SlideInDown, SlideOutUp, SlideOutDown } from 'react-native-reanimated'
import { HeadLine, SpanText } from "../../../../Components/Texts";
import { IPostContext } from "../../../../Interfaces/IPostContext";
import * as FilePicker from 'expo-document-picker'
import { Audio, Video, ResizeMode } from "expo-av";
import { getMediaType } from '../../../../Helpers';
import useKeyboardEvent from "../../../../Hooks/useKeyboardEvent";
import { IMediaType, IPostItem } from '../../../../Interfaces';
import { IMediaPlayable } from '../../../Statics/Interface';
import usePostForm from "../../../../Hooks/usePostForms";
import { useDataContext } from "../../../../Contexts/DataContext";
import { REQUESTS_API } from "@env";

const { height, width } = Dimensions.get('window')

export const UploadFileForm = (post?: IPostItem & { formMode: 'create' | 'edit' }) => {

    const videoMediaRef = useRef<Video>(null)
    const [audioMediaRef, setAudioMediaRef] = useState<Audio.SoundObject>(null)
    const [fileType, setFileType] = useState<IMediaType>(null)
    const [mediaState, setMediaState] = useState<IMediaPlayable['states']>({})
    const [isCaptionInputFocused, setIsCaptionInputFocused] = useState(false)
    const [isKeyboardShown, setIsKeyboardShown] = useState(false)
    const themeColors = useThemeColors()

    const { methods: { createPost, updatePost } } = usePostForm()

    const [sessionValues, setSessionValues] = useState<IPostContext>({ postType: 'UPLOAD' })

    useKeyboardEvent({
        onShow: () => setIsKeyboardShown(true),
        onHide: () => setIsKeyboardShown(false),
    })

    useEffect(() => {
        const fileType = getMediaType(sessionValues?.file?.uri)
        setFileType(fileType)

        return () => {
            setFileType(null)
            setMediaState(state => ({ ...state, playState: 'paused' }))
        }
    }, [sessionValues?.file?.uri])

    useEffect(() => {
        if (post) {
            setSessionValues({
                ...post as any,
                file: {
                    uri: `${REQUESTS_API}${post?.fileUrl}`
                },
                thumbnail: `${REQUESTS_API}${post?.thumbnailUrl}`
            })
        }
    }, [])

    const playPauseMedia = async () => {
        try {
            if (fileType === 'audio') {
                if (!audioMediaRef)     
                    setAudioMediaRef(await Audio.Sound.createAsync({
                        uri: sessionValues?.file?.uri,
                    }, {}, handlePlaybackStatusUpdate))
                if (mediaState.playState !== 'playing') {
                    setMediaState(state => ({ ...state, playState: 'playing' }))
                    await audioMediaRef?.sound?.playAsync()
                } else {
                    setMediaState(state => ({ ...state, playState: 'paused' }))
                    await audioMediaRef?.sound?.pauseAsync()
                }
            } else if (fileType === 'video') {
                if (videoMediaRef?.current) {
                    if (mediaState.playState !== 'playing') {
                        setMediaState(state => ({ ...state, playState: 'playing' }))
                        await videoMediaRef?.current?.playAsync()
                    } else {
                        setMediaState(state => ({ ...state, playState: 'paused' }))
                        await videoMediaRef?.current?.pauseAsync()
                    }
                }
            }
        } catch (error) {
            console.log("ERROR-> ", error)
        }
    }

    const handleCreatePost = async () => {
        const post = await createPost({
            ...sessionValues, 'postType': "UPLOAD"
        })
    }

    const handlePickDocument = async () => {
        const [type, multiple] = [['image/*', "video/*", "audio/*"], false]
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                multiple,
                type,
            })
            if (!pickedItems.canceled) {
                const picked = pickedItems.assets?.[0]
                setSessionValues(state => ({
                    ...state, file: {
                        uri: picked?.uri,
                        size: picked.size,
                        name: picked.name,
                        type: picked?.mimeType
                    }
                }))
                if (['video', 'image'].includes(picked?.mimeType))
                    setSessionValues(state => ({ ...state, thumbnail: picked.uri }))
            }
        } catch (error) {
            console.log("ERROR handlePickDocument -> ", error)
        }
    }

    const handlePlaybackStatusUpdate = (data) => {
        if (data?.isLoaded && !data.isPlaying && data.didJustFinish) {
            setMediaState(state => ({ playState: 'ended' }));
            videoMediaRef?.current?.setPositionAsync(0)
            audioMediaRef?.sound?.setPositionAsync(0)
        }
        const { positionMillis, playableDurationMillis, durationMillis } = data;
        const calculatedProgress = (positionMillis / playableDurationMillis) * 100;
        setMediaState(prevState => ({
            ...prevState,
            progress: Number((calculatedProgress ?? 0).toFixed(0)),
            duration: durationMillis / 1000
        }));
    };

    const handlePickThumbnail = async () => {
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                type: ['image/jpg', 'image/png', 'image/jpeg']
            })
            if (!pickedItems.canceled)
                setSessionValues(state => ({ ...state, thumbnail: pickedItems.assets?.[0]?.uri }))
        } catch (error) {
            console.log("ERROR handlePickThumb -> ", error)
        }
    }

    const handleRemoveMediaFromSelection = () => {
        setSessionValues(state => ({ ...state, file: null }))
    }

    const handleOnChangeText = (text: string) => {
        setSessionValues(state => ({ ...state, description: text }))
    }

    const postCaption = (
        <View style={[styles.textInputContainer, { height: isKeyboardShown ? 'auto' : 'auto' }]}>
            <HeadLine
                style={{ padding: 10, opacity: .7 }}
                hidden={!isKeyboardShown}
                children={'📢 Attention You! 📢'} />
            <SpanText
                style={{ fontSize: 12, padding: 10, opacity: .5 }}
                hidden={!isKeyboardShown}
            >
                Adding captions to your posts can make a world of difference! It's more than just text
                - it's a chance to share your story, your thoughts, and your personality.{'\n'}{'\n'}
                Captions help your audience understand what your post is all about. Whether it's a breathtaking photo, a funny moment, or an inspiring quote, a caption gives context and meaning to your content.
            </SpanText>
            <View style={[styles.spaceBetween, { padding: 0, alignItems: 'flex-end', }]}>
                <TextInput
                    onFocus={() => setIsCaptionInputFocused(true)}
                    onBlur={() => setIsCaptionInputFocused(false)}
                    style={[styles.textInput, { color: themeColors.text, flexGrow: 1 }]}
                    placeholder={isKeyboardShown ? "Type your caption here..." : "What's up? caption 🖋️"}
                    value={sessionValues?.description}
                    onChangeText={handleOnChangeText}
                    multiline
                    textBreakStrategy="highQuality"
                    // autoFocus
                    placeholderTextColor={themeColors.text}
                    returnKeyType="default"
                />
            </View>
            {
                !isKeyboardShown && (
                    <TouchableOpacity
                        onPress={handleCreatePost}
                        style={[styles.spaceBetween, { gap: 3, borderRadius: 5, height: 50, marginTop: 10, backgroundColor: themeColors.success, justifyContent: 'center' }]}
                    >
                        <SpanText> {post?.formMode}  </SpanText>
                        <Ionicons
                            size={20}
                            name='chevron-forward'
                            color={themeColors.text}
                        />
                    </TouchableOpacity>
                )
            }
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

    const thumbPreviewer = (
        <View style={[styles.thumbPreviewBackgroundImage]}>
            <ImageBackground
                source={{ uri: sessionValues?.thumbnail }}
                blurRadius={300}
                resizeMethod="resize"
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}   >
                <TouchableOpacity
                    onPress={handlePickThumbnail}
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
                                    onPress={() => setSessionValues(state => ({ ...state, thumbnail: null }))}
                                    style={[styles.iconsStyle]}
                                    size={20}
                                    color={themeColors.text}
                                    name="delete" />
                                <MaterialIcons
                                    onPress={handlePickThumbnail}
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

    const fileExplorer = (
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
            </ImageBackground>
        </View>
    )

    const previewUploadedFile = (
        <View style={[styles.uploadedFilePreviewContainer, { padding: isKeyboardShown ? 0 : 10 }]}>
            {
                isKeyboardShown || (
                    <View style={[styles.spaceBetween, styles.uploadedFileContainer]}>
                        <View style={{ borderRadius: 10, overflow: 'hidden', flex: 1 }}>
                            <ImageBackground
                                blurRadius={100}
                                source={{ uri: sessionValues?.file?.uri }}
                                style={[styles.uploadedFilePreviewInnerContainer]}>
                                {displayType()}
                                {mediaState?.playState !== 'playing' && thumbPreviewer}
                            </ImageBackground>
                        </View>
                        <View style={[{ zIndex: 5, right: 0, height: '100%', padding: 6, justifyContent: 'space-between', backgroundColor: themeColors.background }]}>
                            <View style={[{ gap: 10 }]}>
                                <MaterialIcons
                                    onPress={() => setSessionValues(state => ({ ...state, file: null }))}
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
            {postCaption}
        </View>
    )

    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.container, {}]}>
            {sessionValues?.file ? previewUploadedFile : fileExplorer}
        </Animated.View>
    )
}

export default UploadFileForm

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    textInputContainer: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'flex-end',
        marginTop: 30,
        overflow: 'hidden',
    },
    textEditorContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        minHeight: 100,
        justifyContent: 'center',
        flexGrow: 1,
        maxHeight: 'auto',
    },
    fileExplorerContainer: {
        height: height / 2.3,
        width: '100%',
        backgroundColor: 'red',
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        bottom: 0,
    },
    textInput: {
        paddingHorizontal: 10,
        fontWeight: '300',
        fontSize: 17,
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        gap: 10,
        position: 'relative',
    },
    textStyle: {
        fontSize: 18,
        fontWeight: '500',
    },
    thumbPreviewBackgroundImage: {
        height: 110,
        position: 'absolute',
        left: 10,
        bottom: 10,
        aspectRatio: '16/9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    uploadedFilePreviewContainer: {
        width: '100%',
        height: '100%',
        padding: 10,
        justifyContent: 'flex-end',
    },
    uploadedFilePreviewInnerContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    uploadedFileContainer: {
        flex: 1,
        position: 'relative',
        padding: 0,
    },
    contentDescriptionContainerBar: {
        width: 60,
        height: 5,
        borderRadius: 50,
        backgroundColor: 'red',
    },
    iconsStyle: {
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 30,
        padding: 3,
        aspectRatio: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textEditor: {},
});