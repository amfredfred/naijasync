import { View, StatusBar, StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import { HeadLine } from "../../Components/Texts";
import MenuItem from "../../Components/MenuItem";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Zocial } from "@expo/vector-icons";
import useThemeColors from "../../Hooks/useThemeColors";
import { useNavigation, useRoute } from "@react-navigation/native";
import ThemedModal from "../../Components/Modals";

const { height } = Dimensions.get('window')

export default function FormsHome() {

    const themeColors = useThemeColors()
    const { navigate, canGoBack, goBack, isFocused } = useNavigation()

    const handleGoBack = () => {
        if (canGoBack())
            goBack()

    }


    return (
        <View style={[styles.mainContainer, { backgroundColor: themeColors.background }]}>
            <View style={[styles.absoluteContainer, { backgroundColor: themeColors.background }]}>
                {/* {<View style={[styles.spaceBetween, { height: 20, justifyContent: 'center', backgroundColor: themeColors.background2, width: '100%' }]}>
                    <View style={[styles.contentDescriptionContainerBar, { backgroundColor: themeColors.text }]} />
                </View>} */}
                <View
                    style={{ flexGrow: 1, width: '100%' }}>
                    <View style={[styles.container]}>
                        {/* <HeadLine style={{ textTransform: 'uppercase', padding: 10 }} children={'What are you posting'} /> */}
                        <View style={[styles.routesContainer]}>
                            <MenuItem
                                transparent
                                mini
                                hideIconRight
                                onPress={() => (navigate as any)?.('FormStatusHome')}
                                icon={<FontAwesome5 name='hotjar' size={30} color={themeColors.text} />}
                                title="Status"
                            />
                            <MenuItem
                                transparent
                                hideIconRight
                                icon={<MaterialIcons name='question-answer' size={30} color={themeColors.text} />}
                                title="Question?"
                                description="got a question? ask the community anonymously !!!"
                            />
                            <MenuItem
                                transparent
                                hideIconRight
                                icon={<MaterialIcons name='business' size={30} color={themeColors.text} />}
                                title="Sell Product"
                                description="sell | rent used or new items/properties?"
                            />

                            <MenuItem
                                transparent
                                hideIconRight
                                icon={<MaterialIcons name='article' size={30} color={themeColors.text} />}
                                title="News | Article"
                                description="post news or article, what is happening?"
                            />
                            <MenuItem
                                transparent
                                hideIconRight
                                onPress={() => (navigate as any)?.('FormUploadHome')}
                                icon={<MaterialCommunityIcons name='upload-multiple' size={30} color={themeColors.text} />}
                                title="Upload"
                                description="Upload Video | Music | Photo"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    routesContainer: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 0,
        flexWrap: 'wrap'
    },
    absoluteContainer: {
        width: '100%',
        alignItems: 'center',
        maxHeight: height,
        overflow: 'hidden',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
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