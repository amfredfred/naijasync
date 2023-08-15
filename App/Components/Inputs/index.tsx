import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { TextInput } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween, IContainer } from "../Containers";
import { IconButton } from "../Buttons";
import { Ionicons } from "@expo/vector-icons";
import { View } from 'react-native'
import { SpanText } from "../Texts";


export type ITextInput = TextInput['props'] & IThemedComponent & {
    containerStyle?: IContainer['style']
    title?: React.ReactNode
    variant?: "search" | "password",
    isFocused?: boolean
}

export type IProgressBar = {
    statusText?: React.ReactNode
    filled: number,
    severity?: "error" | "success" | "warning",
    barStyle?: View['props']['style']
} & IThemedComponent


export const InputText = (props: ITextInput) => {
    const colors = useThemeColors()

    const { hidden, variant, style, containerStyle, ...otherProps } = props

    const inputStyle: ITextInput['style'] = {
        flexGrow: 1,
        color: colors?.text,
        width: '80%',
        flex: 1,
        fontFamily: 'Montserrat_500Medium',
    }

    const containerStyles: ITextInput['containerStyle'] = {
        backgroundColor: colors.background2,
        padding: 0,
        gap: 5,
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
                containerStyle={{ backgroundColor: 'transparent' }}
                icon={<Ionicons size={30} name="search" />} />
            <TextInput
                style={[inputStyle, style]}
                placeholderTextColor={colors.text}
                {...otherProps}
            />
        </ContainerSpaceBetween>
    )
}

export const ProgressBar = (props: IProgressBar) => {
    const { statusText, filled, severity, barStyle } = props
    const colors = useThemeColors()

    const barStyled: IContainer['style'] = {
        minWidth: '100%',
        maxWidth: '100%',
        height: 10,
        minHeight: 10,
        maxHeight: 10,
        borderRadius: 50,
        position: 'relative',
        backgroundColor: 'green',
        padding:10
    }

    const fillerStyled: IContainer['style'] = {
        width: String(filled) + "%" as any,
        height: '100%',
        borderRadius: 50,
        backgroundColor: severity === 'error' ? colors.error : severity === 'success' ? colors.sucess : severity === 'warning' ? colors.warning : colors.primary
    }

    const statusTextStyled: TextInput['props']['style'] = {
        position: 'absolute',
        top: -20,
        zIndex: 10,
        padding: 2,
        borderRadius: 50,
        // fontSize: 10,
        // backgroundColor: severity === 'error' ? colors.error : severity === 'success' ? colors.sucess : severity === 'warning' ? colors.warning : colors.secondary,
        // paddingHorizontal: 6,
        right: 0
    }


    return (
        <View
            style={[barStyled, barStyle]}
            children={
                <>
                    <SpanText style={[statusTextStyled]} children={statusText ?? (filled + "%")} />
                    <View style={fillerStyled} />
                </>}
        />
    )

}