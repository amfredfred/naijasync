import { ScrollView, View } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import ComingSoonComponent from "../../../../Components/__coming__soon";
import { useMemo } from "react";

export default function FinanceHome() {

    const themeColors = useThemeColors()


    return useMemo(() => (
        <View style={{  backgroundColor: themeColors.background, flex: 1 }}>
            <AccountHeading />

            <ScrollView style={{flex: 1 }}>
                <View style={{}}>
                    <ComingSoonComponent />
                </View>
            </ScrollView>

        </View>
    ), [])
}