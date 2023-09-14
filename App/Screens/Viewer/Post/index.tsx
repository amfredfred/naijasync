import { useEffect, useMemo, useState, createRef } from "react";
import ThemedModal from "../../../Components/Modals";
import { IPostItem } from "../../../Interfaces";
import { ScrollView, StyleSheet, View, useWindowDimensions, Animated as RNAnimated } from "react-native";
import ExplorerPostItemWrapper from "../../Explorer/Wrapper";
import ProfileAvatar from "../../../Components/ProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "../../../Components/Buttons";
import useThemeColors from "../../../Hooks/useThemeColors";
import ImageViewer from "./Image";
import { REQUESTS_API } from "@env";
import LikeButton from "../../__/PostsList/__/PostItem/Like";
import PostExplorerFooting from "../../Explorer/Wrapper/Footing";
import usePostForm from "../../../Hooks/usePostForms";

import React, { useRef } from 'react';

import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useSharedValue,
    withSpring,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    withDecay,
    useDerivedValue,
} from 'react-native-reanimated';

type IPostViewer = IPostItem & {
    onClose?(): void
}

export default function PostViewer(post: IPostViewer) {

    const { onClose, onPress } = post
    const { height } = useWindowDimensions()
    const { } = useNavigation()
    const themeColors = useThemeColors()
    const postForm = usePostForm()

    const [intere, setintere] = useState(true)


    const [panEnabled, setPanEnabled] = useState(false);
    const scale = useRef(new RNAnimated.Value(1)).current;
    const translateX = useRef(new RNAnimated.Value(0)).current;
    const translateY = useRef(new RNAnimated.Value(0)).current;

    const pinchRef = createRef();
    const panRef = createRef();

    const onPinchEvent = RNAnimated.event([{
        nativeEvent: { scale }
    }],
        { useNativeDriver: true });

    const onPanEvent = RNAnimated.event([{
        nativeEvent: {
            translationX: translateX,
            translationY: translateY
        }
    }],
        { useNativeDriver: true });

    const handlePinchStateChange = ({ nativeEvent }) => {
        // enabled pan only after pinch-zoom
        if (nativeEvent.state === State.ACTIVE) {
            setPanEnabled(true);
        }

        // when scale < 1, reset scale back to original (1)
        const nScale = nativeEvent.scale;
        if (nativeEvent.state === State.END) {
            if (nScale < 1) {
                RNAnimated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true
                }).start();
                RNAnimated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true
                }).start();
                RNAnimated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true
                }).start();

                setPanEnabled(false);
            }
        }
    };


    const onRequestClose = () => {
        onClose?.()
    }

    useEffect(() => {
        postForm?.methods?.updatePost({ 'views': 1, puid: post?.puid })
        console.log('reloaded')
    }, [])

    const RenderPost = () => {
        switch (post?.postType) {
            case 'UPLOAD': {
                switch (post?.fileType) {
                    case 'image':
                        return <ImageViewer source={`${REQUESTS_API}${post?.fileUrl}`} />
                    default:
                        break;
                }

            }
            default:
                break;
        }
    }

    const postHeading = (
        <View style={[styles?.viewerHeading]}>
            <IconButton
                onPress={onRequestClose}
                icon={<Ionicons size={30} name='arrow-back' />}
            />
            <ProfileAvatar {...post?.owner} />
        </View>
    )

    const postContent = (
        <ScrollView style={[styles.postContent]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ maxHeight: '100%', flexGrow: 1 }}>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchEvent}
                simultaneousHandlers={[panRef]}
                onHandlerStateChange={handlePinchStateChange}  >
                <RNAnimated.View
                    style={[{ flexGrow: 1, transform: [{ scale }, { translateX }, { translateY }] }]}>
                    {RenderPost()}
                </RNAnimated.View>
            </PinchGestureHandler>
        </ScrollView>
    )

    const posFooting = (
        <View style={[styles.posFooting]}>
            <PostExplorerFooting {...post} />
        </View>
    )

    return useMemo(() => (
        <ThemedModal
            hideBar
            animationType='fade'
            onRequestClose={onRequestClose}
            visible={Boolean(post?.puid)} >
            <View style={{ backgroundColor: themeColors.background, height }}>
                {postHeading}
                {postContent}
                {posFooting}
            </View>
        </ThemedModal>
    ), [post?.puid])
}

const styles = StyleSheet.create({
    viewerHeading: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    postContent: {
        flex: 1,
        width: '100%',
    },
    posFooting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})