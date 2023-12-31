import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { StyleSheet, ScrollView, TouchableOpacity, Text, useColorScheme } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Zocial } from '@expo/vector-icons'
import useThemeColors from '../../../../Hooks/useThemeColors'
import { IPostType } from '../../../../Interfaces/IPostContext'
import { IThemedComponent } from '../../../../Interfaces'
import * as Animatable from 'react-native-animatable'

export interface IFormBottomTabs extends IThemedComponent {
    handleOnButtonTabPress(props: IPostType['types']): void,
    activeTab: IPostType['types'],
    hidden?: boolean
}

export default function FormBottomTabs(props: IFormBottomTabs) {
    const { handleOnButtonTabPress: bottomTabPress, activeTab, hidden } = props
    const themeColors = useThemeColors()
    const handleOnButtonTabPress = (props: IPostType['types']) => {
        // do some more stuff
        bottomTabPress?.(props)
    }

    if (hidden) return null

    return (
        <Animated.View
            style={[styles.postTypeListContainer]}
            exiting={SlideOutDown}
            entering={SlideInDown}>
            <ScrollView
                horizontal
                contentContainerStyle={[styles.spaceBetween, {   paddingHorizontal: 10, width: '100%', gap: 10 }]}
                style={[styles.postTypeList, {backgroundColor:themeColors.background2  }]}>
                <TouchableOpacity
                    onPress={() => handleOnButtonTabPress("IMPORT")}
                    style={[styles.postTypeButton]}   >
                    <MaterialCommunityIcons
                        style={[styles.postTypeButtonIcon, { backgroundColor: activeTab === 'IMPORT' ? 'transparent' : themeColors.background2, color: themeColors.text }]}
                        name='link' />
                    {/* <Text style={[{ color: themeColors.text }]}>
                        link
                    </Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleOnButtonTabPress("ARTICLE")}
                    style={[styles.postTypeButton]}   >
                    <MaterialIcons
                        style={[styles.postTypeButtonIcon, { backgroundColor: activeTab === 'ARTICLE' ? 'transparent' : themeColors.background2, color: themeColors.text }]}
                        name='article' />
                    {/* <Text style={[{ color: themeColors.text }]}>
                        Article
                    </Text> */}
                </TouchableOpacity>
             
                <Animatable.View
                
                >
                    <TouchableOpacity
                        onPress={() => handleOnButtonTabPress("STATUS")}
                        style={[styles.postTypeButton]}   >
                        <FontAwesome5
                            style={[styles.postTypeButtonIcon, { backgroundColor: activeTab === 'STATUS' ? 'transparent' : themeColors.background2, color: themeColors.text }]}
                            name='hotjar' />
                        {/* <Text style={[{ color: themeColors.text }]}>
                        Status
                    </Text> */}
                    </TouchableOpacity>
                </Animatable.View>

                <TouchableOpacity
                    onPress={() => handleOnButtonTabPress('UPLOAD')}
                    style={[styles.postTypeButton]}   >
                    <MaterialCommunityIcons
                        style={[styles.postTypeButtonIcon, { backgroundColor: activeTab === 'UPLOAD' ? 'transparent' : themeColors.background2, color: themeColors.text }]}
                        name='upload-multiple' />
                    {/* <Text style={[{ color: themeColors.text }]}>
                        Upload
                    </Text> */}
                </TouchableOpacity>
            </ScrollView>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    spaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        'justifyContent': 'space-between',
        gap: 10,
        position: 'relative',
    },
    postTypeList: {
        
    },
    postTypeButton: {
        alignItems: 'center'
    },
    postTypeButtonIcon: {
        backgroundColor: 'green',
        borderRadius: 50,
        fontSize: 30,
        aspectRatio: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 6,
    },
    postTypeListContainer: { 
        zIndex: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius:20,
        overflow:'hidden'
        // paddingHorizontal: 10,
        // paddingBottom: 10,
    }
})