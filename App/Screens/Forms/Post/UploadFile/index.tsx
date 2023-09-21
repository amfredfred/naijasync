import React, { useEffect, useRef, useState, useMemo } from "react";
import { Image, Dimensions, View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useThemeColors from "../../../../Hooks/useThemeColors";

import MusicalLandscape from '../../../../../assets/muusical-landscape.jpg'

import * as Animatable from 'react-native-animatable'

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
import { FancyButton } from "../../../../Components/Buttons";
import { useMediaPlaybackContext } from "../../../../Contexts/MediaPlaybackContext";

const { height, width } = Dimensions.get('window')

export const UploadFileForm = (post?: IPostItem & { formMode: 'Post' | 'Update' }) => {

    const [fileType, setFileType] = useState<IMediaType>(null)
    const [isKeyboardShown, setIsKeyboardShown] = useState(false)
    const [isPostingGif, setisPostingGif] = useState(false)
    const themeColors = useThemeColors()
    const mediaContext = useMediaPlaybackContext()
    const { methods: { createPost, updatePost } } = usePostForm()
    const [sessionValues, setSessionValues] = useState<IPostContext>({ postType: 'UPLOAD', type: 'UPLOAD' })

    useKeyboardEvent({
        onShow: () => setIsKeyboardShown(true),
        onHide: () => setIsKeyboardShown(false),
    })

    useEffect(() => {

        setFileType(getMediaType(sessionValues?.file?.uri))

        return () => {
            setFileType(null)
        }
    }, [sessionValues?.file?.uri])

    useEffect(() => {
        if (post?.puid) {
            setSessionValues({
                ...post as any,
                file: {
                    uri: `${REQUESTS_API}${post?.fileUrl}`,
                    type: post?.fileType,
                    name: post?.puid
                },
                thumbnail: `${REQUESTS_API}${post?.thumbnailUrl}`,
                description: post?.description,
                title: post?.title,
                tags: post?.tags,
                postType: post?.postType,
                type: post?.postType
            })
        }
    }, [])

    const playPauseMedia = async () => {
        if (mediaContext?.states?.playState == 'playing')
            mediaContext?.pause()
        else {
            console.log('should be playing', mediaContext?.fileType)
            mediaContext?.play()
        }

    }

    const handleCreatePost = async () => {
        if (post?.formMode == 'Post')
            createPost({ ...sessionValues, 'postType': "UPLOAD" })
        else
            updatePost({ ...sessionValues })
    }

    const handlePickDocument = async () => {
        setisPostingGif(false)
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
                if (['video', 'audio'].includes(picked?.mimeType?.split('/')?.[0])) {
                    mediaContext?.connect({ fileUrl: picked?.uri })
                }
                // if (['image', 'video'].includes(picked?.mimeType?.split('/')?.[0])) {
                //     setSessionValues(state => ({ ...state, thumbnail: picked.uri }))
                // }
            }
        } catch (error) {

        }
    }

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
            <View style={[styles.textInputContainer, { flexGrow: 1 }]}>
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
                <View style={[styles.spaceBetween, { padding: 0, alignItems: 'flex-start', flexGrow: 1, height: (isKeyboardShown) ? 'auto' : sessionValues?.description ? 'auto' : undefined }]}>
                    <TextInput
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
        <View style={[styles.spaceBetween, { marginHorizontal: 10, marginTop: 20, borderRadius: 10, overflow: 'hidden', height: 45, backgroundColor: themeColors.background2 }]}>
            <TextInput
                placeholder={`Enter ${fileType} title here (optional)`}
                style={[styles.textInput, { color: themeColors.text, flex: 1 }]}
                value={sessionValues?.title}
                onChangeText={handleOnTitleTextChange}
                // autoFocus
                placeholderTextColor={'darkgrey'}
                returnKeyType="default"
            />
        </View>
    )


    const GifSearchTextInput = (
        <View style={{ flexGrow: 1 }}>
            <View style={[styles.spaceBetween, { marginHorizontal: 10, marginTop: 20, borderRadius: 10, overflow: 'hidden', height: 45, backgroundColor: themeColors.background2 }]}>
                <TextInput
                    editable={false}
                    placeholder={`Seach Gif...`}
                    style={[styles.textInput, { color: themeColors.text, flex: 1 }]}
                    value={sessionValues?.title}
                    onChangeText={handleOnTitleTextChange}
                    // autoFocus
                    placeholderTextColor={'darkgrey'}
                    returnKeyType="default"
                />
            </View>

            <View style={{padding:30, flex:1, justifyContent:'center', alignItems:'center', opacity:.4}}>
                <SpanText style={{fontSize:30}}>
                   GIF IS COMING SOON
                </SpanText>
            </View>
        </View>
    )


    const PostingTabs = (
        <View style={[styles.spaceBetween, styles.postingTabcContainer]}>

            {
                isPostingGif ? (
                    <View style={[styles.spaceBetween]}>
                        <Ionicons
                            size={25}
                            onPress={() => {
                                setSessionValues(s => ({ type: s.type, postType: s.postType }))
                                setisPostingGif(false)
                            }}
                            color={themeColors.text}
                            style={{ backgroundColor: themeColors.background2, borderRadius: 50, padding: 5, aspectRatio: 1 }}
                            name="arrow-back" />
                    </View>) : (
                    <View style={[styles.spaceBetween, { padding: 0 }]}>
                        <View style={[styles.spaceBetween, { gap: 20, }]}>
                            <MaterialIcons
                                size={25}
                                onPress={handlePickDocument}
                                name='attach-file'
                                color={themeColors.text}
                                style={{ backgroundColor: themeColors.background2, borderRadius: 50, padding: 5, aspectRatio: 1 }} />
                            {['video', 'audio'].includes(fileType) && (
                                <Animatable.View
                                    animation={'zoomIn'}>
                                    <MaterialCommunityIcons
                                        size={25}
                                        onPress={handlePickThumbnail}
                                        name='image-album'
                                        color={themeColors.text}
                                        style={{ borderRadius: 50, padding: 5 }} />
                                </Animatable.View>
                            )}
                        </View>

                        <MaterialIcons
                            onPress={() => {
                                setSessionValues(s => ({ type: s.type, postType: s.postType }))
                                setisPostingGif(true)
                            }}
                            style={{ backgroundColor: themeColors.background2, borderRadius: 50, padding: 5 }}
                            size={25}
                            color={themeColors.text}
                            name='gif' />
                    </View>
                )
            }

            <FancyButton
                containerStyle={{ paddingHorizontal: 20, borderRadius: 50, flex: 1 }}
                onPress={handleCreatePost}
                title={post?.formMode}
            />
        </View>
    )


    let FilePreviewComponent = null
    if (fileType === 'video')
        FilePreviewComponent = (
            <View style={{ width: '100%', flexGrow: 1 }}>
                <Video
                    resizeMode={ResizeMode.CONTAIN}
                    style={{ flexGrow: 1, width: '100%' }}
                    ref={mediaContext?.mediaRef}
                />
            </View>
        )
    else if (fileType === 'image')
        FilePreviewComponent = (
            <View style={{ width: '100%', flexGrow: 1, position: 'relative' }}>
                <Image
                    source={{ uri: sessionValues?.file?.uri }}
                    style={{ flexGrow: 1, width: '100%' }}
                    resizeMethod='resize'
                    resizeMode='contain'
                />
            </View>
        )
    else if (fileType === 'audio')
        FilePreviewComponent = (
            <ImageBackground
                source={MusicalLandscape}
                blurRadius={10}
                style={{ width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                <Ionicons
                    name='musical-note'
                    color={themeColors.text}
                    size={100}
                />
            </ImageBackground>)


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
                            {FilePreviewComponent}
                            {['video', 'audio'].includes(fileType) ? mediaContext?.states?.playState !== 'playing' && thumbPreviewer : null}
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
                                    name={mediaContext?.states?.playState === 'paused' ? 'play' : mediaContext?.states?.playState === 'playing' ? 'pause' : 'play'} />
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
            {!['audio', 'video'].includes(fileType) || Title}
            {isPostingGif ? GifSearchTextInput : postCaption}
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