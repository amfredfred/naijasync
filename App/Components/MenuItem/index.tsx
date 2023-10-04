import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SpanText } from "../Texts";
import { IconButton } from "../Buttons";
import useThemeColors from "../../Hooks/useThemeColors";

interface IMenuItem {
    title?: string
    onPress?(): void
    description?: string,
    icon?: React.ReactNode,
    hideIconRight?: React.ReactNode
    transparent?: boolean
    mini?: boolean
}

export default function MenuItem(item: IMenuItem) {


    const themeColors = useThemeColors()

    return (
        <View key={item?.title?.trim() + item?.description?.trim()} style={[styles.menuItemContainer, {
            width: item?.mini ? '25%' : undefined,
            backgroundColor: item?.transparent ? 'transparent' : themeColors.background2
        }]}>
            <TouchableOpacity key={item.title.trim()} onPress={item.onPress}>
                <View style={[styles.spaceBetween]}>
                    <View style={{ flexDirection: 'row', gap: 13, paddingLeft: 0, backgroundColor: 'transparent' }}>
                        {item?.icon && item.icon}
                        <View style={{ justifyContent: 'center' }}>
                            <SpanText
                                children={item.title}
                                style={{ fontSize: 17, opacity: .6 }} />
                            {(item?.description && !item.mini) && (<SpanText
                                children={item?.description}
                                style={{ fontSize: 12, opacity: .4 }} />
                            )}
                        </View>
                    </View>
                    {!item?.hideIconRight && <IconButton
                        containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
                        icon={<Ionicons name="chevron-forward" size={30} />}
                        style={[styles.menuItemIcon]} />}
                </View>
            </TouchableOpacity>
        </View>
    )

}


const styles = StyleSheet.create({
    menuItemContainer: {
        borderRadius: 5,
        marginVertical: 2,
        flexGrow:1
    },
    menuItem: {
        height: 45,
        flexDirection: 'row',
        gap: 15
    },
    menuItemIcon: {
        width: 30,
        backgroundColor: 'transparent'
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
})