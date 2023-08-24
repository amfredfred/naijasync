import useThemeColors from "../../../Hooks/useThemeColors";
import { useState, useRef, useEffect } from 'react'
import { Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import useKeyboardEvent from "../../../Hooks/useKeyboardEvent";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { StyleSheet, Dimensions, StatusBar, View, KeyboardAvoidingView, Platform, Text, ImageBackground, BackHandler } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as FilePicker from 'expo-document-picker'

import UploadIcon from '../../../../assets/upload-icon.png'
import ImportIcon from '../../../../assets/import-icon.png'
import AddImageIcn from '../../../../assets/upload-image-icon.png'
import DeleteIcon from '../../../../assets/delete-icon.png'

import Animated, { FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown, SlideOutUp, useSharedValue } from 'react-native-reanimated'
import PagerView from "react-native-pager-view";
import { formatFileSize, getMediaType, getTags } from "../../../Helpers";
import { usePostFormContext } from "../../../Contexts/FormContext";
import { IPostFormMethods } from "../../../Interfaces/IPostContext";
import { IconButton } from "../../../Components/Buttons";
import { ProgressBar } from "../../../Components/Inputs";
import useLinkPreview from "../../../Hooks/useLinkPreview";
import useTimeout from "../../../Hooks/useTimeout";
import { useMediaPlaybackContext } from "../../Statics/MediaViewer/Context";

export interface IPostForm {
    postableTypes: "QUESTION" | "STATUS" | "BLOG" | "MOVIE" | "IMPORT"
}

const { width, height } = Dimensions.get('window')

export default function PostsForm(props: { hidden: boolean }) {

    const [PostMode, setPostMode] = useState<IPostForm['postableTypes']>('MOVIE')
    const [shouldFetchPreview, setshouldFetchPreview] = useState(false)
    const [isShowingKeyboard, setisShowingKeyboard] = useState(false)
    const [isMediaFilesExpanded, setisMediaFilesExpanded] = useState(true)
    const [isEditorFocused, setisEditorFocused] = useState(false)
    const { methods, states } = usePostFormContext()
    const themeColors = useThemeColors()

    const mediaContext = useMediaPlaybackContext()

    const [sessionValues, setsessionValues] = useState<{
        files?: FilePicker.DocumentPickerResult['assets']
        thumbnail?: string
        importedLink?: string
        description?: string
        title?: string,
        tags?: [],
        video?: string
        audio?: string
    }>({})

    const LinkPreview = useLinkPreview({
        url: sessionValues?.importedLink,
        dep: sessionValues?.importedLink,
        enabled: Boolean(sessionValues?.importedLink && PostMode === 'IMPORT' && shouldFetchPreview),
        onSuccess(props) {

            const foundAudio = getMediaType(props?.firstAudio)
            const foundVideo = getMediaType(props?.firstVideo)
            console.log(foundAudio, foundVideo)
            setsessionValues(S => ({
                ...S,
                title: props?.title,
                description: props?.description,
                thumbnail: props.image ?? props?.firstImage,
                video: props?.firstVideo,
                audio: props?.firstAudio
            }))
        },
    })

    useTimeout({
        onTimeout: () => setshouldFetchPreview(true),
        onClearTimeout: () => setshouldFetchPreview(false),
        deps: [sessionValues?.importedLink]
    })

    const keyboardEvent = useKeyboardEvent({
        onHide: () => setisShowingKeyboard(false),
        onShow: () => setisShowingKeyboard(true),
        dep: null
    })

    const ITEMS_PER_PAGE = useSharedValue(3)
    const richText = useRef()

    const handleOnBackPress = () => {
        if (!props.hidden) {
            methods?.showForm(null, null)
            return true
        }
        return false
    }

    useEffect(() => {
        const BKH = BackHandler.addEventListener(
            'hardwareBackPress',
            handleOnBackPress
        )

        return () => {
            BKH.remove()
        }
    }, [])

    const handleSetFormChanges: IPostFormMethods['setData'] = async (key, payload) => {
        if (key === 'description') {
            let hashTags = getTags(String(payload))
            methods?.setData('tags', hashTags)
        }
        setsessionValues(S => ({ ...S, [key]: payload }))
        methods?.setData(key, payload)
    }

    const handleTextEditorContainerScrolled = () => {
        setisMediaFilesExpanded(false)
    }

    const handlePickDocument = async () => {
        let [type, multiple] = [[], false]

        if (PostMode === 'MOVIE') {
            type = ['video/*', 'image/png', 'image/jpeg', 'image/jpg']
        }

        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                multiple,
                type,
            })
            if (!pickedItems.canceled) {
                setsessionValues(S => ({ ...S, files: pickedItems.assets }))
                if (!sessionValues?.thumbnail)
                    setsessionValues(S => ({ ...S, thumbnail: pickedItems.assets?.[0]?.uri }))
            }
        } catch (error) {
            console.log("ERROR handlePickDocument -> ", error)
        }
    }

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

    const handelRemoveMediaFromSelection = (index: number) => {
        const modifiedSelection = sessionValues?.files?.filter((asset, i) => i !== index)
        setsessionValues(S => ({ ...S, files: modifiedSelection }))
        setisMediaFilesExpanded(true)
    }

    const handleTexEditorFocus = async () => {
        setisEditorFocused(true)
        console.log("FOCEUSED")
    }
    const handleTextEditorBlur = async () => {
        setisEditorFocused(false)
        console.log("OUT")
    }


    const FormHeader = (
        <View style={[styles.spaceBetween, { borderBottomColor: themeColors.background2, borderBottomWidth: 1 }]}>
            <View style={[styles.spaceBetween, { padding: 0, flexGrow: 1, justifyContent: 'flex-start' }]}>
                <Ionicons
                    onPress={() => methods?.showForm(null, null)}
                    name="arrow-back"
                    color={themeColors.text} size={30}
                />
                <Text style={[styles.textStyle, { color: themeColors.text, fontSize: 20, textTransform: 'capitalize', paddingRight: 10 }]}>
                    Create Post
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => setPostMode(S => (S = (S === 'IMPORT' ? "MOVIE" : "IMPORT")))}
                style={[styles.spaceBetween, styles.roundedButton, { backgroundColor: PostMode == 'IMPORT' ? 'red' : themeColors.background2 }]}>
                <Text style={[styles.textStyle, { color: themeColors.text, opacity: .6, fontSize: 16 }]}>  IMPORT  </Text>
                <Image
                    source={ImportIcon}
                    style={{ height: 30, width: 30, borderRadius: 10, }}
                />
            </TouchableOpacity>
        </View>
    )

    const PostsTitle = (
        <View style={[styles.textInputContainner, { backgroundColor: themeColors.background2 }]}>
            <TextInput
                style={[styles.textInput, { color: themeColors.text }]}
                placeholder={sessionValues?.title ?? "Title"}
                value={sessionValues?.title}
                numberOfLines={2}
                onChangeText={(text) => handleSetFormChanges('title', text)}
                placeholderTextColor={themeColors.text}
            />
        </View>
    )

    const PostInportInput = (
        <View style={[styles.textInputContainner, { backgroundColor: themeColors.background2 }]}>
            <TextInput
                style={[styles.textInput, { color: themeColors.text }]}
                placeholder="Enter link to import"
                numberOfLines={2}
                onChangeText={(text) => handleSetFormChanges('importedLink', text)}
                placeholderTextColor={themeColors.text}
            />
        </View>
    )

    const ThumbPreviewer = (
        <View>
            {
                sessionValues?.thumbnail ?
                    <ImageBackground
                        source={{ uri: sessionValues?.thumbnail }}
                        blurRadius={45}
                        resizeMethod="resize"
                        resizeMode="cover"
                        style={{
                            maxHeight: height / 3,
                            alignItems: 'center',
                            width: '100%',
                            backgroundColor: themeColors.background,
                            borderTopEndRadius: 20,
                            borderTopLeftRadius: 20,
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                        {
                            isMediaFilesExpanded && (
                                <Animated.Image
                                    entering={SlideInDown}
                                    exiting={SlideOutDown}
                                    style={{ width: '100%', height: (height / 3) - 50 }}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    source={{ uri: sessionValues?.thumbnail }}
                                />
                            )
                        }
                        <View style={[styles.spaceBetween, {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderTopEndRadius: 10,
                            borderTopLeftRadius: 10,
                            height: 50
                        }]}>
                            <TouchableOpacity
                                onPress={() => setisMediaFilesExpanded(s => !s)}
                                style={[styles.textInputContainner]}>
                                <Text style={[styles.textStyle, { color: themeColors.text, }]}>
                                    Thumb <Ionicons name='md-checkmark-done' size={20} color={'green'} />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setsessionValues(S => ({ ...S, thumbnail: null }))}
                                style={{}}>
                                <Image
                                    source={DeleteIcon}
                                    style={{ height: 25, width: 30, borderRadius: 10, }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handlePickThumb}
                                style={{}}>
                                <Image
                                    source={AddImageIcn}
                                    style={{ height: 25, width: 30, borderRadius: 10, }}
                                />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    : <TouchableOpacity
                        onPress={handlePickThumb}
                        style={[styles.spaceBetween, {
                            backgroundColor: themeColors.background2,
                            borderTopEndRadius: 10,
                            borderTopLeftRadius: 10,
                            height: 50,
                            justifyContent: 'center'
                        }]}>
                        <Text style={[styles.textStyle, { color: themeColors.text, }]}>
                            CHOOSE THUMB IMAGE
                        </Text>
                    </TouchableOpacity>
            }
        </View >
    )

    const PickedFilesToUpload = (
        <PagerView
            style={{ height: 120, marginTop: 10 }}   >
            {!sessionValues?.files?.length ?
                <TouchableOpacity
                    onPress={handlePickDocument}
                    style={[styles.addMediaPlaceholder, styles.spaceBetween, { justifyContent: 'center', alignItems: 'center' }]} >
                    <Image
                        style={{ width: 80, height: 80 }}
                        resizeMethod="resize"
                        resizeMode="contain"
                        source={UploadIcon}
                    />
                    <Text style={[styles.textStyle, { color: themeColors.text, fontSize: 26, opacity: .3 }]}>CHOOSE FILE</Text>
                </TouchableOpacity>
                :
                sessionValues?.files?.map((item, index) => (
                    <View style={[styles.spaceBetween, { height: 80, padding: 0 }]}>
                        <View style={[styles.spaceBetween, { padding: 0, justifyContent: 'flex-start' }]}>
                            <Image
                                resizeMethod="resize"
                                resizeMode='center'
                                source={{ uri: item.uri }}
                                style={{ height: 100, width: width / ITEMS_PER_PAGE.value, borderRadius: 5, }} />
                            <View style={{ width: '60%' }}>
                                <Text style={[styles.textStyle, { fontSize: 15, color: themeColors.text }]} numberOfLines={2}>{item?.name}</Text>
                                <View style={[styles.spaceBetween]}>
                                    <Text style={[styles.textStyle, { fontSize: 15, color: themeColors.text, opacity: .3, marginTop: 4 }]}>{formatFileSize(item?.size)}</Text>
                                    <Ionicons
                                        onPress={() => handelRemoveMediaFromSelection(index)}
                                        name='trash'
                                        size={20}
                                        color={themeColors.text}
                                    />
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.textStyle, { fontSize: 100, color: themeColors.text, position: 'absolute', right: 50, opacity: .1 }]}>{index + 1}</Text>
                    </View>)
                )
            }
        </PagerView>
    )

    const CreatePostButton = (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.spaceBetween, { padding: 0, }]}>
            <TouchableOpacity
                disabled={!states?.title}
                style={[styles.textInputContainner, styles.spaceBetween, {
                    margin: 0,
                    height: 46,
                    backgroundColor: themeColors.background2,
                    justifyContent: 'center',
                    borderRadius: 0
                }]}     >
                <Text style={{ color: themeColors.text, fontSize: 20, fontWeight: '600' }}>
                    POST
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )

    if (props.hidden) return null

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'height' : 'padding'}
            style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.containerInner, { backgroundColor: themeColors.background }]}>
                {FormHeader}
                <View style={[styles.richtextEditorContainer]}>
                    {PostsTitle}
                    {PostMode === 'IMPORT' && PostInportInput}
                    <RichEditor
                        style={{ flex: 1 }}
                        editorStyle={{ backgroundColor: themeColors.background, color: themeColors.text }}
                        textZoom={110}
                        ref={richText}
                        placeholder={sessionValues?.description ?? 'Hey 🤚, start typing...'}
                        onChange={(con) => { handleSetFormChanges('description', con) }}
                        allowsLinkPreview
                        onScroll={handleTextEditorContainerScrolled}
                        pasteAsPlainText
                        showsHorizontalScrollIndicator={false}
                        useWebView2
                        javaScriptEnabled={false}
                        initialContentHTML={sessionValues?.description}
                        collapsable
                        geolocationEnabled
                        autoCapitalize="sentences"
                    />
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ maxHeight: 40, }}
                            contentContainerStyle={{ padding: 10, gap: 10, alignItems: 'center' }}
                        >
                            {
                                states?.tags?.map(tag => <IconButton
                                    onPress={null}
                                    title={`#${tag}`}
                                    style={{ borderRadius: 2 }}
                                    containerStyle={[styles.iconsButton]}
                                />)
                            }
                        </ScrollView>
                        <ProgressBar
                            hidden
                            filled={10}
                        />
                    </View>
                    {isShowingKeyboard || (
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={{ width: '100%' }}  >
                            {ThumbPreviewer}
                            {!(isShowingKeyboard || PostMode === 'IMPORT') && PickedFilesToUpload}
                        </Animated.View>
                    )}
                </View>

                {
                    !isShowingKeyboard || <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        style={[styles.toolbarContainer]}>
                        <RichToolbar
                            selectedButtonStyle={{ backgroundColor: themeColors.background, }}
                            editor={richText}
                            iconTint={themeColors.background}
                            selectedIconTint="green"
                            actions={[
                                // actions.insertImage, 
                                actions.setBold,
                                actions.setItalic,
                                actions.insertBulletsList,
                                actions.insertOrderedList,
                                actions.insertLink,
                                actions.keyboard,
                                actions.undo,
                                actions.redo,
                                actions.setStrikethrough,
                                actions.setUnderline,
                                actions.removeFormat,
                                // actions.insertVideo, 
                            ]}
                        />
                    </Animated.View>
                }
                {isShowingKeyboard || CreatePostButton}
            </View>
        </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    container: {
        height,
        top: 0,
        position: 'absolute',
        marginTop: StatusBar.currentHeight,
        width,
        bottom: 0,
        flexGrow: 1
    },
    textInputContainner: {
        maxHeight: 50,
        margin: 5,
        padding: 5,
        borderRadius: 5,
        flexGrow: 1
    },
    textInput: {
        height: '100%',
        paddingHorizontal: 10,
        fontWeight: '300',
        fontSize: 17
    },
    roundedButton: {
        height: 30,
        borderRadius: 20,
        justifyContent: 'flex-end', overflow: 'hidden'
    },
    containerInner: {
        flex: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden',
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
    richtextEditorContainer: {
        flex: 1,
        position: 'relative'
    },
    toolbarContainer: {
        overflow: 'hidden',
        padding: 0
    },
    addMediaPlaceholder: {
        width: '100%',
        height: 120,
        borderRadius: 5,
    },
    iconsButton: {
        borderWidth: 0,
        borderRadius: 1,
        gap: 5,
        paddingHorizontal: 10
    },
})