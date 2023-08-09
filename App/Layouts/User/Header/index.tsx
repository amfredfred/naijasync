import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";

import { StatusBar } from 'react-native'
import { HeadLine, SpanText } from "../../../Components/Texts";
import useThemeColors from "../../../Hooks/useThemeColors";
import { TextInput } from "react-native";
import { IconButton } from "../../../Components/Buttons";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { InputText } from "../../../Components/Inputs";
import { useDataContext } from "../../../Contexts/DataContext";

export default function Heade() {
    const { headerBackgorund: backgroundColor } = useThemeColors()
    const { states:NS } = useDataContext()
    const [QueryText, setQueryText] = useState<string>()

    const onSearchInputTextChange = (text: string) => {
        setQueryText(text)
        console.log(text)
    }

    console.log(NS)

    return (
        <ContainerBlock
            style={{ paddingTop: StatusBar.currentHeight + 10, paddingBottom: NS?.states?.isHeaderHidden ? 0 : 10, backgroundColor }}   >
            <ContainerSpaceBetween hidden={NS?.states?.isHeaderHidden} style={{ padding: 0, gap: 10 }}>
                <IconButton
                    icon={<FontAwesome size={30} name="sliders" />} />

                <InputText
                    placeholder="Search songs, movies, and news"
                    variant="search"
                    onChangeText={onSearchInputTextChange}
                    value={QueryText}
                />
            </ContainerSpaceBetween>
        </ContainerBlock>
    )
}