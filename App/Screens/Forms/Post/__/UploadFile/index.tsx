import PagerView from "react-native-pager-view";
import { Image, TouchableOpacity, View, Text, Dimensions, StyleSheet, TextInput, ImageBackground } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "../../../../../Hooks/useThemeColors";

import UploadIcon from '../../../../../../assets/upload-icon.png'
import ImportIcon from '../../../../../../assets/import-icon.png'
import AddImageIcn from '../../../../../../assets/upload-image-icon.png'
import DeleteIcon from '../../../../../../assets/delete-icon.png'

import { useState } from 'react'
import Animated, { SlideInDown, SlideOutDown, SlideOutUp } from 'react-native-reanimated'
import * as Library from 'expo-media-library'
import { SpanText } from "../../../../../Components/Texts";
import { usePostFormContext } from "../../../../../Contexts/FormContext";
import { IPostContext } from "../../../../../Interfaces/IPostContext";
import * as FilePicker from 'expo-document-picker'

const { height, width } = Dimensions.get('window')

export default function UploadFileForm() {

    const themeColors = useThemeColors()
    const { methods, states } = usePostFormContext()
    const [sessionValues, setsessionValues] = useState<IPostContext>({ postType: 'UPLOAD' })

    const handlePickDocument = async () => {
        let [type, multiple] = [[], false]
        try {
            const pickedItems = await FilePicker.getDocumentAsync({
                multiple,
                type,
            })
            if (!pickedItems.canceled) {
                setsessionValues(S => ({
                    ...S, files: {
                        uri: pickedItems.assets?.[0]?.uri,
                        size: pickedItems.assets?.[0]?.size,
                        name: pickedItems.assets?.[0]?.name
                    }
                }))
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

    const handelRemoveMediaFromSelection = () => {
        setsessionValues(S => ({ ...S, files: null }))
    }


    const PostsTitle = (
        <View style={[styles.textInputContainner, { backgroundColor: themeColors.background2 }]}>
            <TextInput
                style={[styles.textInput, { color: themeColors.text }]}
                placeholder={null ?? "Title"}
                value={null}
                numberOfLines={2}
                onChangeText={null}
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
                onChangeText={null}
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
                        <Animated.Image
                            entering={SlideInDown}
                            exiting={SlideOutDown}
                            style={{ width: '100%', height: (height / 3) - 50 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                            source={{ uri: sessionValues?.thumbnail }}
                        />
                        <View style={[styles.spaceBetween, {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderTopEndRadius: 10,
                            borderTopLeftRadius: 10,
                            height: 50
                        }]}>
                            <TouchableOpacity
                                onPress={() => null}
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


    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutUp}
            style={[styles.constainer, {}]}>
            {sessionValues.file && ThumbPreviewer}
            <View style={[styles.spaceBetween, { flex: 1, justifyContent: 'center' }]}>
                <TouchableOpacity
                    onPress={handlePickDocument}   >
                    <Image
                        source={UploadIcon}

                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}



const styles = StyleSheet.create({
    constainer: {
        position: 'relative',
        height: '100%',
        padding: 10
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
})