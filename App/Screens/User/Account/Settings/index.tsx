import { ScrollView, View } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import { useMemo } from "react";

export default function SettingsHome() {

    const themeColors = useThemeColors()


    return useMemo(() => (
        <View style={{ flex: 1 }}>
            <AccountHeading />

            <ScrollView style={{ backgroundColor: themeColors.background2, flex: 1 }}>
                <View style={{ height: 2000, borderBottomWidth: 50 }}>

                </View>
            </ScrollView>

        </View>
    ), [])
}