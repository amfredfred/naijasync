import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";

import { StatusBar } from 'react-native'
import { HeadLine, SpanText } from "../../../Components/Texts";
import useColorSchemes from "../../../Hooks/useColorSchemes";
import { TextInput } from "react-native";
import { IconButton } from "../../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { IHeader } from "../../../Interfaces";
import { useState } from "react";

export default function Header(props: IHeader) {
    const [isHeaderHidden, setisHeaderHidden] = useState(false)
    const { hidden, headerToggle } = props
    const { headerBackgorund: backgroundColor } = useColorSchemes()

    const ToggleHeader = () => headerToggle((s) => setisHeaderHidden(s))

    console.log(hidden)
    return (
        <ContainerBlock style={{ paddingTop: StatusBar.currentHeight + 10, paddingBottom: hidden ? 0 : 20, backgroundColor }}>
            <ContainerSpaceBetween hidden={hidden} style={{ padding: 0 }}>
                <HeadLine children="NaijaSync" style={{ padding: 0, paddingHorizontal: 0 }} />
                <ContainerSpaceBetween style={{ padding: 0 }}>
                    <IconButton>
                        <Ionicons size={20} name="search" />
                    </IconButton>
                </ContainerSpaceBetween>
            </ContainerSpaceBetween>
        </ContainerBlock>
    )
}