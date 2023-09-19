import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image, Dimensions, View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../../Hooks/useThemeColors";

import UploadIcon from '../../../../../assets/upload-icon.png'
import UploadBackground from '../../../../../assets/autumn-leaves-background.jpg'
import MusicalLandscape from '../../../../../assets/muusical-landscape.jpg'

import Animated, { SlideInDown, SlideOutUp, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated'
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
    const [isTitleFocused, setIsTitleFocused] = useState(false)
    const [isKeyboardShown, setIsKeyboardShown] = useState(false)
    const themeColors = useThemeColors()

    const { methods: { createPost, updatePost } } = usePostForm()

    const [sessionValues, setSessionValues] = useState<IPostContext>({ postType: 'UPLOAD', type: 'UPLOAD' })

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
        // if (post) {
        //     setSessionValues({
        //         ...post as any,
        //         file: {
        //             uri: `${REQUESTS_API}${post?.fileUrl}`
        //         },
        //         thumbnail: `${REQUESTS_API}${post?.thumbnailUrl}`,
        //         description: post?.description,
        //         title: post?.title,
        //         tags: post?.tags,
        //         postType: post?.postType
        //     })
        // }
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
        if (post?.formMode == 'create')
            createPost({ ...sessionValues, 'postType': "UPLOAD" })
        else
            updatePost({ ...sessionValues })
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

    const handleOnCaptionTextChange = (text: string) => {
        setSessionValues(state => ({ ...state, description: text }))
    }

    const handleOnTitleTextChange = (text: string) => {
        setSessionValues(state => ({ ...state, title: text }))
    }

    const postCaption = (
        <View style={{ flexGrow: 1 }}>
            <View style={[styles.textInputContainer,{  flexGrow:1}]}>
                <HeadLine
                    style={{ padding: 10, opacity: .7 }}
                    hidden={!isKeyboardShown}
                    children={'📢 Attention You! 📢'} />
                <SpanText
                    style={{ fontSize: 12, padding: 10, opacity: .5 }}
                    hidden={!isKeyboardShown}    >
                    Adding captions to your posts can make a world of difference! It's more than just text
                    - it's a chance to share your story, your thoughts, and your personality.
                </SpanText>
                <View style={[styles.spaceBetween, { padding: 0, alignItems: 'flex-start', flexGrow:1, height: (isKeyboardShown) ? 'auto' : sessionValues?.description ? 'auto' : undefined }]}>
                    <TextInput
                        onFocus={() => setIsCaptionInputFocused(true)}
                        onBlur={() => setIsCaptionInputFocused(false)}
                        style={[styles.textInput, { color: themeColors.text, flexGrow: 1 }]}
                        placeholder={['video', 'audio'].includes(fileType) ? `Caption your ${fileType} (recommended)` : isKeyboardShown ? "Type your caption here..." : "What's up?🖋️"}
                        value={sessionValues?.description}
                        onChangeText={handleOnCaptionTextChange}
                        multiline
                        textBreakStrategy="highQuality"
                        // autoFocus
                        placeholderTextColor={'darkgrey'}
                        returnKeyType="default"
                        maxLength={255}
                    />
                </View>

            </View>
        </View>
    )

    const Title = (
        <View style={[styles.spaceBetween, { marginHorizontal: 10, borderRadius: 10, overflow: 'hidden', height: 45, backgroundColor: themeColors.background2 }]}>
            <TextInput
                placeholder={`Enter ${fileType} title here (optional)`}
                onFocus={() => setIsCaptionInputFocused(true)}
                onBlur={() => setIsCaptionInputFocused(false)}
                style={[styles.textInput, { color: themeColors.text, flex: 1 }]}
                value={sessionValues?.title}
                onChangeText={handleOnTitleTextChange}
                // autoFocus
                placeholderTextColor={'darkgrey'}
                returnKeyType="default"
            />
        </View>
    )


    const PostingTabs = (
        <View style={[styles.spaceBetween, styles.postingTabcContainer]}>
            <View style={[styles.spaceBetween, { gap: 20, }]}>
                <TouchableOpacity>
                    <FontAwesome5
                        size={25}
                        onPress={handlePickDocument}
                        name='photo-video'
                        color={themeColors.text}
                    />
                </TouchableOpacity>
                {['video', 'audio'].includes(fileType) && <MaterialCommunityIcons
                    size={25}
                    onPress={handlePickThumbnail}
                    name='image-album'
                    color={themeColors.text}
                />}
            </View>

            <TouchableOpacity
                onPress={handleCreatePost}
                style={[styles.spaceBetween, { backgroundColor: themeColors.background2, borderRadius: 50 }]}  >
                <SpanText style={{ textTransform: 'capitalize' }}> {post?.formMode}  </SpanText>
            </TouchableOpacity>
        </View>
    )

    const displayType = () => {
        switch (fileType) {
            case 'video':
                return (
                    <View style={{ width: '100%', flexGrow: 1 }}>
                        <Video
                            resizeMode={ResizeMode.CONTAIN}
                            style={{ flexGrow: 1, width: '100%' }}
                            ref={videoMediaRef}
                            source={{ uri: sessionValues?.file?.uri }}
                            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        />
                    </View>
                )
            case 'image':
                return (
                    <View style={{ width: '100%', flexGrow: 1, position: 'relative' }}>
                        <Image
                            source={{ uri: sessionValues?.file?.uri }}
                            style={{ flexGrow: 1, width: '100%' }}
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
                        style={{ width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
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
                                    color='white'
                                    name="delete" />
                                <MaterialIcons
                                    onPress={handlePickThumbnail}
                                    style={[styles.iconsStyle]}
                                    size={20}
                                    color='white'
                                    name="image" />
                            </View>
                        </View>
                    )
                }
            </ImageBackground>
        </View>
    )

    const previewUploadedFile = (
        <View style={[styles.uploadedFilePreviewContainer]}>
            {
                isKeyboardShown || (
                    <View style={[styles.spaceBetween, styles.uploadedFileContainer]}>
                        <ImageBackground
                            blurRadius={180}
                            source={{ uri: sessionValues?.file?.uri }}
                            style={[styles.uploadedFilePreviewInnerContainer]}>
                            {displayType()}
                            {['video', 'audio'].includes(fileType) ? mediaState?.playState !== 'playing' && thumbPreviewer : null}
                            <Ionicons
                                style={[styles.iconsStyle, { height: 40, position: 'absolute', right: 20, top: 20 }]}
                                onPress={() => setSessionValues(state => ({ ...state, file: null }))}
                                color={'white'}
                                size={30}
                                name={'remove'} />
                            {['video', 'audio'].includes(fileType) &&
                                <Ionicons
                                    style={[styles.iconsStyle, { height: 40, position: 'absolute', right: 20, bottom: 20 }]}
                                    onPress={playPauseMedia}
                                    color={'white'}
                                    size={30}
                                    name={mediaState.playState === 'paused' ? 'play' : mediaState.playState === 'playing' ? 'pause' : 'play'} />
                            }
                        </ImageBackground>
                    </View>
                )
            }
        </View>
    )

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.container, {}]}>
            {isTitleFocused || postCaption}
            {!['audio', 'video'].includes(fileType) || Title}
            {!sessionValues?.file?.uri || previewUploadedFile}
            {isKeyboardShown || PostingTabs}
        </Animated.View>
    )
}

export default UploadFileForm

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    postingTabcContainer: {
        width: '100%',
        paddingHorizontal: 15,
        paddingLeft: 10
    },
    textInputContainer: {
        width: '100%',
        paddingVertical: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        flexGrow: 1
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
        fontSize: 16,
        lineHeight: 23,
        opacity: .7
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
        height: 80,
        position: 'absolute',
        left: 10,
        bottom: 10,
        aspectRatio: '16/9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    uploadedFilePreviewContainer: {
        width: '100%',
        flexGrow: 1,
        justifyContent: 'flex-end',
        padding: 10
    },
    uploadedFilePreviewInnerContainer: {
        overflow: 'hidden',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'flex-end',
        borderRadius: 10
    },
    uploadedFileContainer: {
        position: 'relative',
        padding: 0,
        flex: 1
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