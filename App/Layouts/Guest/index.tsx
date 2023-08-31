import { ContainerFlex } from '../../Components/Containers';
import { SpanText } from '../../Components/Texts';
import { Keyboard, ScrollView, StatusBar, View } from "react-native";
import { useEffect, useState } from 'react'
import Header from './Header';
import useKeyboardEvent from '../../Hooks/useKeyboardEvent';
import useThemeColors from '../../Hooks/useThemeColors';


export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const [keyBoardShown, setkeyBoardShown] = useState(false)

    const themeColors = useThemeColors()

    useKeyboardEvent({
        onShow: () => setkeyBoardShown(s => true),
        onHide: () => setkeyBoardShown(s => false)
    })

    return (
        <ContainerFlex>
            {/* <Header /> */}
            <View style={[{ backgroundColor: themeColors.background, flex: 1, paddingTop: StatusBar.currentHeight }]}>
                {children}
            </View>
        </ContainerFlex>
    )
}