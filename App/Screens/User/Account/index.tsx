import { View } from 'react-native'
import { SpanText } from '../../../Components/Texts'
import useThemeColors from '../../../Hooks/useThemeColors'

export default function Account() {

    const themeColors = useThemeColors()

    return (
        <View>
            <SpanText>
                Account Home
            </SpanText>
        </View>
    )
}