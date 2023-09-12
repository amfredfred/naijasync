import { KeyboardAvoidingView, ScrollView } from "react-native";
import AccountHeading from "../../../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../../../Hooks/useThemeColors";
import ComingSoonComponent from "../../../../../../Components/__coming__soon";

export default function UpdateFundsRequestsSettings() {

    const themeColors = useThemeColors()

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: themeColors.background, padding: 10 }}>
            <AccountHeading />
            <ScrollView
                style={{ paddingTop: 10 }}
                contentContainerStyle={{ gap: 10 }}>
                <ComingSoonComponent />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}