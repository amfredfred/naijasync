import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import useKeyboardEvent from "../../../Hooks/useKeyboardEvent";
import { IPostType } from "../../../Interfaces/IPostContext";
import FormBottomTabs from "./BottomForTabs";
import UploadStatusFrom from "./UploadStatus";
import UploadFileForm from "./UploadFile";
import { SpanText } from '../../../Components/Texts';

const { width, height } = Dimensions.get('window');

export default function PostComposer() {
    const [activeTab, setactiveTab] = useState<IPostType['types']>('UPLOAD');
    const [isShowingKeyboard, setisShowingKeyboard] = useState(false);
    const themeColors = useThemeColors();
    useKeyboardEvent({
        onHide: () => setisShowingKeyboard(false),
        onShow: () => setisShowingKeyboard(true),
        dep: null
    });
    const handleOnButtonTabPress = (props: IPostType['types']) => setactiveTab(props);
    return useMemo(() => (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'height' : 'padding'}
            style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.containerInner]}>
                <View style={[styles.spaceBetween, { backgroundColor: themeColors.background2 }]}>
                    <View style={[styles.spaceBetween, { padding: 0, flexGrow: 1, justifyContent: 'flex-start' }]}>
                        <Ionicons
                            onPress={() => { }}
                            name="arrow-back"
                            color={themeColors.text}
                            size={30}
                        />
                        <SpanText style={[{ color: themeColors.text, fontSize: 20, textTransform: 'capitalize', paddingRight: 10 }]}>
                            {activeTab}
                        </SpanText>
                    </View>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={[styles.spaceBetween, styles.roundedButton, { backgroundColor: themeColors.background2 }]}>
                        <SpanText style={[{ color: themeColors.text, opacity: .6, fontSize: 16 }]}>  POST  </SpanText>
                    </TouchableOpacity>
                </View>
                {/*  */}
                <View style={[styles.innerContainer]}>
                    {activeTab === 'STATUS' && <UploadStatusFrom />}
                    {activeTab === 'UPLOAD' && <UploadFileForm />}
                </View>
                <FormBottomTabs {...{ handleOnButtonTabPress, activeTab, hidden: isShowingKeyboard }} />
            </View>
        </KeyboardAvoidingView>
    ), [activeTab, isShowingKeyboard, themeColors]);
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
    roundedButton: {
        height: 30,
        borderRadius: 20,
        justifyContent: 'flex-end',
        overflow: 'hidden'
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
});