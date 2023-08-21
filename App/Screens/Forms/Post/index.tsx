import { ContainerBlock } from "../../../Components/Containers";
import { useDataContext } from "../../../Contexts/DataContext";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useState, useRef } from 'react'
import { Image, TextInput, TouchableOpacity } from 'react-native'
import useAuthStatus from "../../../Hooks/useAuthStatus";
import useKeyboardEvent from "../../../Hooks/useKeyboardEvent";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { StyleSheet, Dimensions, StatusBar, View, KeyboardAvoidingView, Platform, Text } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker'
import * as FilePicker from 'expo-document-picker'
import { AssetInfo } from "expo-media-library";
import UploadIcon from '../../../../assets/upload-icon.png'
import Animated, { FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown, SlideOutUp, useSharedValue } from 'react-native-reanimated'
import PagerView from "react-native-pager-view";
import { formatFileSize } from "../../../Helpers";
import { usePostFormContext } from "../../../Contexts/FormContext";
import { IPostFormMethods } from "../../../Interfaces/IPostContext";

export interface IPostForm {
    postableTypes: "QUESTION" | "STATUS" | "BLOG" | "MOVIE"
}

const { width, height } = Dimensions.get('window')

const EDITOR_HEIGHT = 230

export default function PostsForm() {

    const [PostMode, setPostMode] = useState<IPostForm['postableTypes']>('MOVIE')
    const [selectedFilesToUpload, setselectedFilesToUpload] = useState<FilePicker.DocumentPickerResult['assets']>([])
    const [selectedThumbnail, setselectedThumbnail] = useState<FilePicker.DocumentPickerResult['assets']>()
    const [isShowingKeyboard, setisShowingKeyboard] = useState(false)
    const [isMediaFilesExpanded, setisMediaFilesExpanded] = useState(true)
    const [isPreviewingThumb, setisPreviewingThumb] = useState(false)

    const [isEditorFocused, setisEditorFocused] = useState(false)

    const authStatus = useAuthStatus()
    const dataContext = useDataContext()
    const themeColors = useThemeColors()
    const { methods, states } = usePostFormContext()

    const ITEMS_PER_PAGE = useSharedValue(3)

    const richText = useRef()
    const pickerRef = useRef()

    const keyboardEvent = useKeyboardEvent({
        onHide: () => setisShowingKeyboard(false),
        onShow: () => setisShowingKeyboard(true),
        dep: null
    })

    console.log(isShowingKeyboard)

    const handleSetFormChanges: IPostFormMethods['setData'] = async (key, payload) => {
        methods?.setData(key, payload)
    }

    const handleOnKeyboardShow = async () => {

    }

    const handleOnKeyboardHide = async () => {

    }

    const handleRequestCreatePost = async () => {

    }

    const handleRequestUpdatePost = async () => {

    }

    console.log(states.description)

    const handlePickDocument = async () => {
        let [type, multiple] = [[], true]

        if (PostMode === 'MOVIE') {
            type = ['video/mp4', 'video/webm', 'video/mkv']
        }

        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                multiple,
                type,
            })
            setselectedFilesToUpload(pickedItems.assets)
            console.log(pickedItems)
        } catch (error) {
            console.log("ERROR handlePickDocument -> ", error)
        }
    }

    const handlePickThumb = async () => {
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                type: ['image/jpg', 'image/png', 'image/jpeg']
            })
            setselectedThumbnail(pickedItems.assets)
            console.log(pickedItems)
        } catch (error) {
            console.log("ERROR handlePickThumb -> ", error)
        }
    }

    const handelRemoveMediaFromSelection = (index: number) => {
        const modifiedSelection = selectedFilesToUpload?.filter((asset, i) => i !== index)
        setselectedFilesToUpload(modifiedSelection)
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

    const BrowseSelectedFiles = (
        <Animated.View style={[styles.browseSelectedFilesContainer]}>
            {
                (Boolean(selectedFilesToUpload?.length)) && (
                    <View>
                        <TouchableOpacity style={[styles.spaceBetween, {
                            width: '100%',
                            alignItems: 'center',
                            opacity: .4,
                            backgroundColor: themeColors.background2,
                            borderTopLeftRadius: 20, borderTopRightRadius: 20
                        }]}>
                            <MaterialIcons
                                name={isMediaFilesExpanded ? 'expand-more' : 'expand-less'}
                                size={34}
                                color={themeColors.text}
                            />
                            <TouchableOpacity
                                onPress={handlePickThumb}
                                style={[styles.spaceBetween, styles.roundedButton, { backgroundColor: themeColors.background2 }]}>
                                <Text style={[styles.textStyle, { color: themeColors.text, opacity: .6, fontSize: 16 }]}>  Upload Thumbnail  </Text>
                                <Image
                                    source={UploadIcon}
                                    style={{ height: 30, width: 30, borderRadius: 10, }}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {
                            selectedThumbnail && (
                                <View style={{backgroundColor:'red'}}>
                                    {
                                        isMediaFilesExpanded && (
                                            <Animated.View
                                                entering={SlideInDown}
                                                exiting={SlideOutDown}
                                            >

                                                <Image
                                                    style={{ width: 100, }}
                                                    resizeMethod="resize"
                                                    resizeMode="contain"
                                                    source={{ uri: selectedThumbnail?.[0].uri }}
                                                />
                                            </Animated.View>
                                        )
                                    }
                                    <TouchableOpacity style={[styles.textInputContainner]}>
                                        <Text style={[styles.textStyle, { color: themeColors.text, }]}>
                                            Thumb <Ionicons name='md-checkmark-done' size={20} color={'green'} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                )
            }
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{ width: '100%' }}
            >
                <ContainerBlock hidden={isShowingKeyboard}>
                    <PagerView
                        // horizontal
                        style={{ height: selectedFilesToUpload?.length ? 80 : height / 2, }}
                    // contentContainerStyle={{ gap: 10 }}
                    >
                        {!selectedFilesToUpload?.length ?
                            <TouchableOpacity
                                onPress={handlePickDocument}
                                style={[styles.addMediaPlaceholder, { justifyContent: 'center', alignItems: 'center' }]} >
                                <Image
                                    source={UploadIcon}
                                />
                                <Text style={[styles.textStyle, { color: themeColors.text, fontSize: 26, opacity: .3 }]}>CHOOSE FILE</Text>
                            </TouchableOpacity>
                            :
                            selectedFilesToUpload?.map((item, index) => (
                                <View style={[styles.spaceBetween, { height: 60, padding: 0 }]}>
                                    <View style={[styles.spaceBetween, { padding: 0, justifyContent: 'flex-start' }]}>
                                        <Image source={{ uri: item.uri }} style={{ height: 60, width: width / ITEMS_PER_PAGE.value, borderRadius: 5, borderColor: 'red', borderWidth: .3 }} />
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
                </ContainerBlock>
            </Animated.View>
        </Animated.View>
    )


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'height' : 'padding'}
            style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.containerInner, { backgroundColor: themeColors.background }]}>
                <View style={[styles.spaceBetween, { borderBottomColor: themeColors.background2, borderBottomWidth: 1 }]}>
                    <View style={[styles.spaceBetween, { padding: 0, flexGrow: 1, justifyContent: 'flex-start' }]}>
                        <Ionicons
                            name="arrow-back"
                            color={themeColors.text} size={30}
                        />
                        <Text style={[styles.textStyle, { color: themeColors.text, fontSize: 20, textTransform: 'capitalize', paddingRight: 10 }]}>
                            Create Post
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handlePickDocument}
                        style={[styles.spaceBetween, styles.roundedButton, { backgroundColor: themeColors.background2 }]}>
                        <Text style={[styles.textStyle, { color: themeColors.text, opacity: .6, fontSize: 16 }]}>  Upload  </Text>
                        <Image
                            source={UploadIcon}
                            style={{ height: 30, width: 30, borderRadius: 10, }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.richtextEditorContainer]}>
                    <View style={[styles.textInputContainner, { backgroundColor: themeColors.background2 }]}>
                        <TextInput
                            style={[styles.textInput, { color: themeColors.text }]}
                            placeholder="Title"
                            numberOfLines={2}
                            onChangeText={(text) => handleSetFormChanges('title', text)}
                            placeholderTextColor={themeColors.text}
                        />
                    </View>
                    <RichEditor
                        style={{ backgroundColor: 'green', flex: 1 }}
                        editorStyle={{ backgroundColor: themeColors.background, color: themeColors.text }}
                        textZoom={100}
                        ref={richText}
                        placeholder={PostMode === "MOVIE" ? "❤️ Tell us about this post..." : ''}
                        onChange={(con) => { handleSetFormChanges('description', con) }}
                        allowsLinkPreview
                        // pasteAsPlainText
                        showsHorizontalScrollIndicator={false}
                        javaScriptEnabled={false}
                        collapsable
                        // initialFocus
                        geolocationEnabled
                        // initialContentHTML={'what is up'}
                        autoCapitalize="sentences"
                    />


                    {isShowingKeyboard || BrowseSelectedFiles}
                </View>

                <ContainerBlock
                    hidden={!isShowingKeyboard}
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
                </ContainerBlock>

                <ContainerBlock
                    hidden={isShowingKeyboard || !selectedFilesToUpload?.length}
                >
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        style={[styles.spaceBetween, { padding: 0, }]}>
                        <TouchableOpacity
                            disabled={!states?.title}
                            style={[styles.textInputContainner, styles.spaceBetween, { margin: 0, backgroundColor: themeColors.background2, justifyContent: 'center', borderRadius: 50 }]}     >
                            <Text style={{ color: themeColors.text, fontSize: 20, fontWeight: '600' }}>
                                POST
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ContainerBlock>
            </View>
        </KeyboardAvoidingView >
    )
}



const styles = StyleSheet.create({
    container: {
        height,
        top: 0,
        flex: 1,
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
    browseSelectedFilesContainer: {
        position: 'absolute',
        width,
        bottom: 0,
    },
    addMediaPlaceholder: {
        width: '100%',
        height: height / 2,
        borderRadius: 5,
    },
})