import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { SpanText } from '../../../../../../Components/Texts';
import useThemeColors from '../../../../../../Hooks/useThemeColors';
import { formatNumber } from '../../../../../../Helpers';
import { IPostItem } from '../../../../../../Interfaces';
import Animated, { Easing, useSharedValue, withSpring, withTiming, useAnimatedStyle, withRepeat } from 'react-native-reanimated';
import { usePostFormContext } from '../../../../../../Contexts/FormContext';
import { useAuthContext } from '../../../../../../Contexts/AuthContext';

interface ILikeButton {
    post: IPostItem,
    onLikeToggle(id: this['post']['id'], liked: this['post']['liked']): void
}

export default function LikeButton(props: ILikeButton) {
    const [liked, setLiked] = useState(props?.post?.liked);
    const [likeCount, setLikeCount] = useState<number>(props?.post?.likes as number);

    const postContext = usePostFormContext()
    const authContext = useAuthContext()

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePress = () => {
        scale.value = withSpring(1.7, {}, () => {
            scale.value = withSpring(!liked ? 1.3 : 1);
        });
    };

    const themeColors = useThemeColors()

    const handleLikeToggle = () => {
        if (!authContext?.user?.isAuthenticated) {
            return 
        }
        postContext?.methods?.updatePost({ 'liked': !liked, puid: props?.post?.puid } as IPostItem)
        handlePress()
        setLikeCount(c => c = liked ? c -= 1 : c += 1)
        setLiked(!liked);
        props?.onLikeToggle(props?.post?.id, !liked);
    };

    return (

        <TouchableOpacity onPress={handleLikeToggle} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
            opacity: .5
        }}>
            <Animated.View style={animatedStyle}>
                <Ionicons size={14} color={liked ? themeColors?.secondary : themeColors.text} name='heart' />
            </Animated.View>
            <SpanText style={{ color: liked ? themeColors?.secondary : themeColors.text, fontSize: 14 }}>{formatNumber(likeCount)}</SpanText>
        </TouchableOpacity>
    );
};
