import { ContainerBlock, ContainerSpaceBetween } from "../../../Components/Containers";

import { StatusBar } from 'react-native'
import { SpanText } from "../../../Components/Texts";
import useColorSchemes from "../../../Hooks/useColorSchemes";

export default function Header() {

    const { headerBackgorund: backgroundColor } = useColorSchemes()

    return (
        <ContainerBlock style={{ paddingTop: StatusBar.currentHeight, backgroundColor }}>
            <ContainerSpaceBetween>
                <SpanText>
                    HEY
                </SpanText>
            </ContainerSpaceBetween>
        </ContainerBlock>
    )
}