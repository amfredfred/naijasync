import { View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import useThemeColors from '../../../Hooks/useThemeColors'
import { Ionicons } from '@expo/vector-icons'
import { SpanText } from '../../../Components/Texts'

import Accounticon from '../../../../assets/icons/color-mode-icon.png'
import DashboardIcon from '../../../../assets/icons/dashboard-icon.png'
import SettingIcon from '../../../../assets/icons/settings-icon.png'
import NairaIcon from '../../../../assets/icons/naira-icon.png'


export default function AccountTabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {

    const themeColors = useThemeColors()

    const routeImages = [
        { title: 'account', inactiveImage: Accounticon, activeImage: Accounticon },
        { title: 'dashboard', inactiveImage: DashboardIcon, activeImage: DashboardIcon },
        { title: 'wallet', inactiveImage: NairaIcon, activeImage: NairaIcon },
        { title: 'settings', inactiveImage: SettingIcon, activeImage: SettingIcon },
    ]

    return (
        <ScrollView
            style={{ maxHeight: 55, borderTopColor: themeColors.background2, borderTopWidth: 1 }}
            horizontal
            contentContainerStyle={[styles.spaceBeteen, { backgroundColor: themeColors.background }]}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;


                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={label}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ alignItems: 'center', paddingHorizontal: 5, paddingVertical: 7 }}
                    >
                        <View style={[styles.spaceBeteen, { borderRadius: 5, padding: 7, backgroundColor: isFocused ? themeColors.accent : themeColors.background2, }]}>
                            <View >
                                <Image
                                    source={isFocused ? routeImages.find(image => image.title === options.tabBarBadge)?.activeImage
                                        : routeImages.find(image => image.title === options.tabBarBadge)?.inactiveImage
                                    }
                                    style={{ height: 25, aspectRatio: 1, padding: 5 }}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                />
                            </View>
                            {
                                index !== 0 && (
                                    <SpanText style={{ fontSize: 16 }}>
                                        {label}
                                    </SpanText>
                                )
                            }
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    spaceBeteen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
})