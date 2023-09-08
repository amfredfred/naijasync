import * as Library from 'expo-media-library'
import Animated, { SlideInDown, SlideInLeft, SlideOutLeft, SlideOutUp } from 'react-native-reanimated'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useRef, useState, useEffect } from 'react'
import { SpanText } from '../../../../Components/Texts'

const { height, width } = Dimensions.get('window')

export default function UploadStatusFrom() {
    const [libpermission, requestLibPermission] = Library.usePermissions()
    const [mediaFiles, setMediaFiles] = useState<Library.AssetInfo[]>([])

    const richText = useRef()
    const themeColors = useThemeColors()

    const MediLibrary = (
        <Animated.View>
            <Text>
                STATUS SCREEN
            </Text>
        </Animated.View>
    )

    const gesture = Gesture.Pan()



    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.constainer, {}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, padding: 10, alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'red', width: 40, aspectRatio: 1, borderRadius: 50 }}>

                </View>
                <RichEditor
                    style={[styles.textEditoContainer]}
                    editorStyle={{ ...styles.textEditor, color: themeColors.text, backgroundColor: themeColors.background2 }}
                    textZoom={120}
                    ref={richText}
                    placeholder={"What is up fred?"}
                    onChange={null}
                    allowsLinkPreview
                    disabled
                    onScroll={null}
                    pasteAsPlainText
                    showsHorizontalScrollIndicator={false}
                    useWebView2
                    javaScriptEnabled={false}
                    // initialContentHTML={sessionValues?.description}
                    collapsable
                    geolocationEnabled
                />
            </View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.mediaExplorerContainer, { backgroundColor: themeColors.background2 }]}>
                    <Animated.ScrollView>
                        <SpanText>
                            COMIGN SOON !!!
                        </SpanText>
                    </Animated.ScrollView>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        position: 'relative',
        flexGrow: 1
    },
    mediaExplorerContainer: {
        height: 80,
        width: '100%',
        flexGrow: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    textEditoContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        minHeight: 100,
        justifyContent: 'center',
        flexGrow: 1,
        maxHeight: height / 3
    },
    textEditor: {

    }
})