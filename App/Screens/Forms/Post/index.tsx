import useThemeColors from "../../../Hooks/useThemeColors";
import { useMemo, useState, } from 'react'
import { TouchableOpacity } from 'react-native'
import useKeyboardEvent from "../../../Hooks/useKeyboardEvent";
import { StyleSheet, Dimensions, StatusBar, View, KeyboardAvoidingView, Platform, Text } from 'react-native'
import { Ionicons } from "@expo/vector-icons";

import { IPostContext, IPostType } from "../../../Interfaces/IPostContext";
import { useMediaPlaybackContext } from "../../Statics/MediaViewer/Context";
import FormBottomTabs from "./BottomForTabs";
import UploadStatusFrom from "./UploadStatus";
import UploadFileForm from "./UploadFile";

const { width, height } = Dimensions.get('window')
export default function PostComposer() {

    const [activeTab, setactiveTab] = useState<IPostType['types']>('UPLOAD');
    const { setMedia } = useMediaPlaybackContext()

    const [isShowingKeyboard, setisShowingKeyboard] = useState(false)
    const themeColors = useThemeColors()

    useKeyboardEvent({
        onHide: () => setisShowingKeyboard(false),
        onShow: () => setisShowingKeyboard(true),
        dep: null
    })

    const handleOnButtonTabPress = (props: IPostType['types']) => setactiveTab(props)


    const FormHeader = (
        <View style={[styles.spaceBetween, { backgroundColor: themeColors.background2 }]}>
            <View style={[styles.spaceBetween, { padding: 0, flexGrow: 1, justifyContent: 'flex-start' }]}>
                <Ionicons
                    onPress={() => { }}
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

    console.log('MAINN RERENDERED', activeTab)

    return useMemo(() => (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'height' : 'padding'}
            style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.containerInner]}>
                {FormHeader}
                <View style={[styles.innerContainer]}>
                    {activeTab === 'STATUS' && <UploadStatusFrom />}
                    {activeTab === 'UPLOAD' && <UploadFileForm />}
                </View>
                <FormBottomTabs {...{ handleOnButtonTabPress, activeTab, hidden: isShowingKeyboard }} />
            </View>
        </KeyboardAvoidingView>
    ), [])
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