import { ScrollView, View } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import ComingSoonComponent from "../../../../Components/__coming__soon";
import { useMemo } from "react";

export default function DashboardHome() {

    const themeColors = useThemeColors()

    return useMemo(() => (
        <View style={{ flex: 1 }}>
            <AccountHeading />
            <ScrollView
                style={{ backgroundColor: themeColors.background2, flex: 1 }}>
                <View style={{}}>
                    <ComingSoonComponent />
                </View>
            </ScrollView>

        </View>
    ), [])
}