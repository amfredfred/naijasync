import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { TextInput } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween, IContainer } from "../Containers";
import { IconButton } from "../Buttons";
import { Ionicons } from "@expo/vector-icons";

export type ITextInput = TextInput['props'] & IThemedComponent & {
    containerStyle?: IContainer['style']
    title?: React.ReactNode
    color?: "primary" | "secondary"
    variant?: "search" | "password"
    severity?: "error" | "success" | "warning" | "info"
}

export const InputText = (props: ITextInput) => {
    const colors = useThemeColors()

    const { hidden, variant, style, containerStyle, ...otherProps } = props

    const inputStyle: ITextInput['style'] = {
        flexGrow: 1,
        backgroundColor: 'pink',
        maxWidth: '80%',
        flex: 1
    }

    const containerStyles: ITextInput['containerStyle'] = {
        backgroundColor: colors.background2,
        marginRight: 10,
        padding: 0,
        flexGrow: 1,
        ...(
            variant == 'search' ? {
                borderRadius: 50,
            } : variant == 'password' ? {

            } : null
        )
    }


    return (
        <ContainerSpaceBetween hidden={hidden} style={[containerStyles, containerStyle]} justify="flex-start">
            <IconButton
                icon={<Ionicons size={25} name="search" />} />
            <TextInput
                style={[inputStyle, style]}
                {...otherProps}
            />
        </ContainerSpaceBetween>
    )
}