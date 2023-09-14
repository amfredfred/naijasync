import { useState } from "react";
import { IconButton } from "../../../Components/Buttons";
import useThemeColors from "../../../Hooks/useThemeColors";
import { IPostItem } from "../../../Interfaces";
import { useAuthContext } from "../../../Contexts/AuthContext";
import { IAuthContextData } from "../../../Interfaces/iAuthContext";
import { formatNumber } from "../../../Helpers";

export default function FollowButton(props: IAuthContextData['user']['account']) {

    const themeColors = useThemeColors()

    const [followed, setFollowed] = useState(props?.followed);
    const [followersCount, setFollowersCount] = useState<number>(props?.followers as number);

    const authContext = useAuthContext()

    const handleFollowToggle = () => {
        if (authContext?.user?.isAuthenticated) {
            setFollowersCount(c => c = followed ? c -= 1 : c += 1)
            setFollowed(!followed);
        }
        authContext?.updateAccount({ 'followed': !followed, 'userId': props?.userId })
    };

    return (
        <IconButton
            onPress={handleFollowToggle}
            textStyle={{ textTransform: 'capitalize' }}
            containerStyle={{ backgroundColor: themeColors.error }}
            title={`Follow ${formatNumber(followersCount ?? 0)}`}
        />
    )
}