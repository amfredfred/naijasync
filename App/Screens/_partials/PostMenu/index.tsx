import { View, Alert, ToastAndroid, Platform } from "react-native";
import ThemedModal, { IThemedmodal } from "../../../Components/Modals";
import { IPostItem } from "../../../Interfaces";
import ProfileAvatar from "../../../Components/ProfileAvatar";
import { useAuthContext } from "../../../Contexts/AuthContext";
import { AntDesign, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import useThemeColors from "../../../Hooks/useThemeColors";
import MenuItem from "../../../Components/MenuItem";
import { ContainerSpaceBetween } from "../../../Components/Containers";
import { IconButton } from "../../../Components/Buttons";
import { getMediaType } from "../../../Helpers";
import useMediaLibrary from "../../../Hooks/useMediaLibrary";
import { REQUESTS_API } from "@env";
import usePostForm from "../../../Hooks/usePostForms";
import { useNavigation } from "@react-navigation/native";




export default function PostItemMenu(props: IPostItem & IThemedmodal) {

    const authContext = useAuthContext()
    const themeColors = useThemeColors()
    const postForm = usePostForm()
    const fileType = getMediaType(props?.fileUrl)
    const mediaLibContext = useMediaLibrary()
    const navigation = useNavigation()

    const handleDownloadItem = () => {
        // mediaLibContext?.createDownload(`${REQUESTS_API}${props?.fileUrl}`, `${props?.puid}.${props?.fileUrl?.split('.')[1]}`)
    }

    const handleOnDeleteButtonPresss = () => {
        props?.onRequestClose?.(null)
        Alert?.alert(
            "Delete Post",
            'Are you sure you want to delete this post?',
            [{
                isPreferred: true,
                text: 'No',
                onPress: () => null,
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => {
                    postForm?.methods?.deletePost(props)
                    if (Platform?.OS === 'android') {
                        ToastAndroid?.BOTTOM
                        ToastAndroid.show('The post will be deleted...', 2000)
                    }
                },
                style: 'destructive'
            }]
        )
    }

    //
    const postPrivateMenuItem = [
        {
            title: `Edit`,
            onPress: () => {
                props?.onRequestClose?.(null);
                (navigation?.navigate as any)?.("PostComposer", { post: props, formMode: "edit" })
            },
            icon: <AntDesign size={30} name='edit' color={themeColors?.text} />,
            description: ''
        },
        {
            title: `Delete`,
            onPress: handleOnDeleteButtonPresss,
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
            title: `Report post  (coming soon)`,
            onPress: () => { },
            icon: <Octicons size={30} name='report' color={themeColors?.text} />,
            description: 'You can report this post if you find it inappropriate.'
        },
        {
            title: `Download ${fileType} (coming soon)`,
            hideIconRight: true,
            onPress: handleDownloadItem,
            icon: <MaterialCommunityIcons size={30} name='download' color={themeColors?.text} />,
            description: `Donwload ${fileType} for access offline.`
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
            {
                props?.owner?.userId !== authContext?.user?.account?.userId && <View
                    children={postWhenNotownerMenuItem.map((item, index) => <MenuItem key={index} {...item} />)}
                    style={{ padding: 5, backgroundColor: themeColors.background2, margin: 10, borderRadius: 10 }} />
            }
            {
                props?.owner?.userId === authContext?.user?.account?.userId && <ContainerSpaceBetween
                    children={postPrivateMenuItem.map((item, index) => (<IconButton key={index} onPress={item?.onPress} containerStyle={{ padding: 10 }} icon={item.icon} />))}
                    style={{ margin: 10, borderRadius: 10 }}
                />
            }
        </ThemedModal>
    )
}