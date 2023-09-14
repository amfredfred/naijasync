import { View } from "react-native";
import ThemedModal, { IThemedmodal } from "../../../Components/Modals";
import { IPostItem } from "../../../Interfaces";
import ProfileAvatar from "../../../Components/ProfileAvatar";
import { useAuthContext } from "../../../Contexts/AuthContext";
import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import MenuItem from "../../../Components/MenuItem";
import { ContainerSpaceBetween } from "../../../Components/Containers";
import { IconButton } from "../../../Components/Buttons";

export default function PostItemMenu(props: IPostItem & IThemedmodal) {

    const authContext = useAuthContext()
    const themeColors = useThemeColors()

    //
    const postPrivateMenuItem = [
        {
            title: `Edits`,
            onPress: () => null,
            icon: <AntDesign size={30} name='edit' color={themeColors?.text} />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Delete`,
            onPress: () => null,
            icon: <AntDesign size={30} name='delete' color={themeColors?.error} />,
            description: 'Allow/Disallow accounts to request funds from you'
        },
        {
            title: `Share`,
            onPress: () => { },
            icon: <AntDesign size={30} name='sharealt' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];

    const postPublicMenuItem = [
        {
            title: `Copy Link`,
            hideIconRight: true,
            onPress: () => null,
            icon: <Ionicons size={30} name='copy' color={themeColors?.text} />,
            description: ''
        },
        {
            title: `Report post`,
            onPress: () => { },
            icon: <Octicons size={30} name='report' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];

    const postWhenNotownerMenuItem = [
        {
            title: `Gifting (Comign soon)`,
            hideIconRight: true,
            onPress: () => null,
            icon: <Ionicons size={30} name='gift' color={themeColors?.text} />,
            description: `Points empower better content sharing!!`
        },
        {
            title: `Share`,
            hideIconRight: true,
            onPress: () => { },
            icon: <AntDesign size={30} name='sharealt' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        }
    ];

    return (
        <ThemedModal animationType='fade'   {...props}>
            <ContainerSpaceBetween>
                <View />
                <ProfileAvatar {...props?.owner} />
            </ContainerSpaceBetween>
            <View
                children={postPublicMenuItem.map((item, index) => <MenuItem key={index} {...item} />)}
                style={{ padding: 5, backgroundColor: themeColors.background2, margin: 10, borderRadius: 10 }} />
            {props?.owner?.userId !== authContext?.user?.account?.userId && <View
                children={postWhenNotownerMenuItem.map((item, index) => <MenuItem key={index} {...item} />)}
                style={{ padding: 5, backgroundColor: themeColors.background2, margin: 10, borderRadius: 10 }} />}
            {
                props?.owner?.userId === authContext?.user?.account?.userId && <ContainerSpaceBetween
                    children={postPrivateMenuItem.map((item, index) => (<IconButton key={index} onPress={() => null} containerStyle={{ padding: 10 }} icon={item.icon} />))}
                    style={{ margin: 10, borderRadius: 10 }}
                />
            }
        </ThemedModal>
    )
}