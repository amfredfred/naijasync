import { ContainerBlock } from "../../../Components/Containers";

import { StatusBar } from 'react-native'

export default function Header() {

    return (
        <ContainerBlock style={{ marginTop: StatusBar.currentHeight, backgroundColor: 'red', height: 45 }}>

        </ContainerBlock>
    )
}