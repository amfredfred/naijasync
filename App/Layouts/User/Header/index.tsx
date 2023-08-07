import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";

import { StatusBar } from 'react-native'
import { HeadLine, SpanText } from "../../../Components/Texts";
import useThemeColors from "../../../Hooks/useThemeColors";
import { TextInput } from "react-native";
import { IconButton } from "../../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import useStorage from "../../../Hooks/useStorage";
import { InputText } from "../../../Components/Inputs";

export default function Heade() {
    const { headerBackgorund: backgroundColor } = useThemeColors()
    const { NaijaSync: NS, method } = useStorage("@NaijaSync")

    return (
        <ContainerBlock
            style={{ paddingTop: StatusBar.currentHeight + 10, paddingBottom: NS?.states?.isHeaderHidden ? 0 : 20, backgroundColor }}
        >
            <ContainerSpaceBetween hidden={NS?.states?.isHeaderHidden} style={{ padding: 0, gap: 10 }}>
                {/* <HeadLine children="NaijaSync" style={{ padding: 0, textTransform: 'uppercase', paddingHorizontal: 0 }} /> */}
                <IconButton
                    variant="contained"
                    icon={<Ionicons size={30} name="search" />} />

                <InputText
                    placeholder="search songs, movies, and news"
                    variant="search"
                    style={{ color: 'red' }}
                    value="search songs, movies, and news search songs, movies, and news search songs, movies, and news"
                />
            </ContainerSpaceBetween>
        </ContainerBlock>
    )
}