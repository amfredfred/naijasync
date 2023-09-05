import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import useThemeColors from '../../../Hooks/useThemeColors'
import { Ionicons } from '@expo/vector-icons'
import { SpanText } from '../../../Components/Texts'

import Accounticon from '../../../../assets/icons/account-icon.png'
import DashboardIcon from '../../../../assets/icons/dashboard-icon.png'
import SettingIcon from '../../../../assets/icons/setting-icon.png'


export default function AccountTabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {

    const themeColors = useThemeColors()

    const routeImages = [
        { title: 'account', inactiveImage: Accounticon, activeImage: Accounticon },
        { title: 'dashboard', inactiveImage: DashboardIcon, activeImage: DashboardIcon },
        { title: 'message-circle', inactiveImage: '', activeImage: '' },
        { title: 'wallet', inactiveImage: '', activeImage: '' },
        { title: 'settings', inactiveImage: '', activeImage: '' },
    ]

    return (
        <View style={[styles.spaceBeteen, { backgroundColor: themeColors.background, height: 50, paddingHorizontal: 20 }]}>
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
                        style={{ alignItems: 'center', paddingHorizontal: 5, paddingVertical: 7  }}
                    >

                        <Image
                            source={isFocused ? routeImages.find(image => image.title === options.tabBarBadge)?.activeImage
                                : routeImages.find(image => image.title === options.tabBarBadge)?.inactiveImage
                            }
                            style={{ height: 27, aspectRatio: 1 }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />

                        <SpanText style={{ opacity: isFocused ? .5 : 1, fontSize: 14, marginTop: 2 }}>
                            {label}
                        </SpanText>
                    </TouchableOpacity>
                );
            })}
        </View>
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