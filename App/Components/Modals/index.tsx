import { Dimensions, Modal, ScrollView, StyleSheet, View } from "react-native";
import useThemeColors from "../../Hooks/useThemeColors";

export type IThemedmodal = Modal['props'] & {
    hideBar?: boolean
}
const { height, width } = Dimensions.get('window')

export default function ThemedModal(modalprops: IThemedmodal) {
    const { children, hideBar = false, ...otherModalProps } = modalprops

    const themeColors = useThemeColors()

    return (
        <Modal
            statusBarTranslucent
            transparent
            {...otherModalProps}>
            <View style={[styles.mainContainer]}>
                <View style={[styles.absoluteContainer, { backgroundColor: themeColors.background, borderTopLeftRadius: hideBar ? 0 : 20, borderTopRightRadius: hideBar ? 0 : 20 }]}>
                    {hideBar || <View style={[styles.spaceBetween, { height: 20, justifyContent: 'center', backgroundColor: themeColors.background2, width: '100%' }]}>
                        <View style={[styles.contentDescriptionContainerBar, { backgroundColor: themeColors.text }]} />
                    </View>}
                    <View
                        style={{ flexGrow: 1, width: '100%'}}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    absoluteContainer: {
        width: '100%',
        alignItems: 'center',
        maxHeight: height,
        overflow: 'hidden'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        padding: 6,
        gap: 10
    },
    contentDescriptionContainerBar: {
        width: 60,
        height: 5,
        borderRadius: 50,
    },
})