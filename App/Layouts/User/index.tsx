import { ContainerFlex } from "../../Components/Containers";
import { Keyboard, ScrollView } from "react-native";
import { SpanText } from "../../Components/Texts";
import { useEffect, useState } from 'react'
import Header from "./Header";
import Navigation from "./Navigation";


export default function UserLayout({ children }: { children: React.ReactNode }) {

    const [keyBoardShown, setkeyBoardShown] = useState(false)
    useEffect(() => {

        const keyboardshown = Keyboard.addListener('keyboardDidShow', () => setkeyBoardShown(s => true))
        const keyboardhidden = Keyboard.addListener('keyboardDidHide', () => setkeyBoardShown(s => false))

        return () => {
            keyboardshown.remove()
            keyboardhidden.remove()
        }
    }, [])

    return (
        <ContainerFlex>
            <Header  />
            {children}
            {/* <Navigation /> */}
        </ContainerFlex>
    )
}
