import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { SpanText } from '../../../../Components/Texts';
import useThemeColors from '../../../../Hooks/useThemeColors';
import { formatNumber } from '../../../../Helpers';
import { IPostItem } from '../../../../Interfaces';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useAuthContext } from '../../../../Contexts/AuthContext';
import usePostForm from '../../../../Hooks/usePostForms';

interface ILikeButton {
    post: IPostItem,
    onLikeToggle(id: this['post']['id'], liked: this['post']['liked']): void
}

export default function LikeButton(props: ILikeButton) {
    const [liked, setLiked] = useState(props?.post?.liked);
    const [likeCount, setLikeCount] = useState<number>(props?.post?.likes as number);

    const postContext = usePostForm()
    const authContext = useAuthContext()

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${scale.value}deg` }],
        };
    });

    const handlePress = () => {
        scale.value = withSpring(1, {}, () => {
            scale.value = withSpring(!liked ? 45 : 1);
        });
    };

    const themeColors = useThemeColors()

    const handleLikeToggle = () => {
        if (authContext?.user?.isAuthenticated) {
            handlePress()
            setLikeCount(c => c = liked ? c -= 1 : c += 1)
            setLiked(!liked);
            props?.onLikeToggle?.(props?.post?.id, !liked);
        }
        postContext?.methods?.postReact(!liked, props?.post?.puid)
    };

    return (

        <TouchableOpacity onPress={handleLikeToggle} style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            minWidth: 25,
        }}>
            <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
                <AntDesign
                    style={{}}
                    size={13} color={liked ? 'red' : themeColors.text} name={liked ? 'heart' : 'hearto'} />
            </Animated.View>
            <SpanText style={{ color: liked ? 'red' : themeColors.text, fontSize: 15 }}>{formatNumber(likeCount)}</SpanText>
        </TouchableOpacity>
    );
};
