import useThemeColors from "../../../Hooks/useThemeColors";
import { useState, useRef, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import useKeyboardEvent from "../../../Hooks/useKeyboardEvent";
import { StyleSheet, Dimensions, StatusBar, View, KeyboardAvoidingView, Platform, Text, BackHandler } from 'react-native'
import { Ionicons } from "@expo/vector-icons";


import { useSharedValue } from 'react-native-reanimated'
import { getMediaType, getTags } from "../../../Helpers";
import { IPostFormComponent, IPostFormMethods, IPostType } from "../../../Interfaces/IPostContext";
import useLinkPreview from "../../../Hooks/useLinkPreview";
import useTimeout from "../../../Hooks/useTimeout";
import { useMediaPlaybackContext } from "../../Statics/MediaViewer/Context";
import FormBottomTabs from "./__/BottomForTabs";
import UploadStatusFrom from "./__/UploadStatus";
import UploadFileForm from "./__/UploadFile";

const { width, height } = Dimensions.get('window')
export default function PostsForm(props: IPostFormComponent) {

    const [activeTab, setactiveTab] = useState<IPostType['types']>('UPLOAD');
    const { setMedia } = useMediaPlaybackContext()
    const { showForm, setData } = props

    const [shouldFetchPreview, setshouldFetchPreview] = useState(false)
    const [isShowingKeyboard, setisShowingKeyboard] = useState(false)
    const [isMediaFilesExpanded, setisMediaFilesExpanded] = useState(true)
    const [isEditorFocused, setisEditorFocused] = useState(false)
    const themeColors = useThemeColors()

    const [sessionValues, setsessionValues] = useState<{
        files?: { uri: string, size: number, name: string }
        thumbnail?: string
        importedLink?: string
        description?: string
        title?: string,
        tags?: [],
        video?: string
        audio?: string
        fileType?: string
    }>({})

    const LinkPreview = useLinkPreview({
        url: sessionValues?.importedLink,
        dep: sessionValues?.importedLink,
        enabled: Boolean(sessionValues?.importedLink && activeTab === 'IMPORT' && shouldFetchPreview),
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
                audio: props?.firstAudio,
                fileType: foundAudio ?? foundVideo ?? null
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
            showForm(null, null)
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
            setData('tags', hashTags)
        }
        setsessionValues(S => ({ ...S, [key]: payload }))
        setData(key, payload)
    }

    const handleTextEditorContainerScrolled = () => {
        setisMediaFilesExpanded(false)
    }

    const handleOnButtonTabPress = (props: IPostType['types']) => {
        setsessionValues(S => ({}))
        setactiveTab(props)
    }



    const FormHeader = (
        <View style={[styles.spaceBetween, { backgroundColor: themeColors.background2 }]}>
            <View style={[styles.spaceBetween, { padding: 0, flexGrow: 1, justifyContent: 'flex-start' }]}>
                <Ionicons
                    onPress={() => methods?.showForm(null, null)}
                    name="arrow-back"
                    color={themeColors.text} size={30}
                />
                <Text style={[styles.textStyle, { color: themeColors.text, fontSize: 20, textTransform: 'capitalize', paddingRight: 10 }]}>
                    {activeTab}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => { }}
                style={[styles.spaceBetween, styles.roundedButton, { backgroundColor: themeColors.background2 }]}>
                <Text style={[styles.textStyle, { color: themeColors.text, opacity: .6, fontSize: 16 }]}>  POST  </Text>
            </TouchableOpacity>
        </View>
    )


    const FilesFromImportLink = (
        <View style={[styles.spaceBetween, {
            height: 40,
            backgroundColor: 'red',
        }]}>
            <Text
                style={[styles.textStyle, { color: themeColors.text, textTransform: 'uppercase', }]}>Preiview {sessionValues?.fileType} </Text>
            <TouchableOpacity
                style={{}} >
                <Ionicons
                    style={{ fontSize: 30, color: themeColors.text }}
                    onPress={() => setMedia({
                        sources: [sessionValues?.audio ?? sessionValues?.video],
                        previewing: true
                    })}
                    name="play"
                />
            </TouchableOpacity>
        </View>
    )



    if (props.hidden) return null


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'height' : 'padding'}
            style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.containerInner]}>
                {FormHeader}
                <View style={[styles.innerContainer]}>
                    {activeTab === 'STATUS' && <UploadStatusFrom  {...props} />}
                    {activeTab === 'UPLOAD' && <UploadFileForm {...props} />}

                </View>
                <FormBottomTabs {...{ handleOnButtonTabPress, activeTab, hidden: isShowingKeyboard }} />
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
        flexGrow: 1,
        flex: 1
    },
    innerContainer: {
        flex: 1
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
    postTypeList: {
        backgroundColor: 'red',
    },
    postTypeButton: {
        alignItems: 'center'
    },
    postTypeButtonIcon: {
        backgroundColor: 'green',
        borderRadius: 50,
        fontSize: 30,
        aspectRatio: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 6,
    },
    postTypeListContainer: {
        elevation: 50,
        marginTop: 10,
        shadowColor: 'red',
        zIndex: 4,
        borderTopColor: 'gren',
        borderTopWidth: StyleSheet.hairlineWidth
    }
})