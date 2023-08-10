import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";
import { StatusBar } from 'react-native'
import useThemeColors from "../../../Hooks/useThemeColors";
import { IconButton } from "../../../Components/Buttons";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { InputText } from "../../../Components/Inputs";
import { useDataContext } from "../../../Contexts/DataContext";

export default function Heade() {
    const { headerBackgorund: HBG,background } = useThemeColors()
    const { states:NS } = useDataContext()
    const [QueryText, setQueryText] = useState<string>()

    const onSearchInputTextChange = (text: string) => {
        setQueryText(text)
        console.log(text)
    }

    return (
        <ContainerBlock
            style={{
                paddingTop: StatusBar.currentHeight + (NS?.states?.isHeaderHidden ? 0 : 10),
                paddingBottom: NS?.states?.isHeaderHidden ? 0 : 10,
                // backgroundColor: NS?.states?.isHeaderHidden ? background: HBG
            }}   >
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