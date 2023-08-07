import { ContainerBlock } from "../../../Components/Containers";

import { StatusBar } from 'react-native'
import { IHeader } from "../../../Interfaces";

export default function Header(props: IHeader) {
    const {hidden} =props

    return (
        <ContainerBlock hidden={hidden} style={{ marginTop: StatusBar.currentHeight, backgroundColor: 'red', height: 45 }}>

        </ContainerBlock>
    )
}