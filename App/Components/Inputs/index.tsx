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
        // fontFamily: 'Montserrat_500Medium',
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
    const { statusText, filled, severity, barStyle, hidden } = props
    const colors = useThemeColors()

    const barStyled: IContainer['style'] = {
        minWidth: '100%',
        maxWidth: '100%',
        height: 3,
        minHeight: 3,
        maxHeight: 3,
        position: 'relative',
        zIndex: 10
    }

    const fillerStyled: IContainer['style'] = {
        width: String(filled) + "%" as any,
        // height: '100%',
        height: 4,
        minHeight: 4,
        maxHeight: 4,
        backgroundColor: severity === 'error' ? colors.error : severity === 'success' ? colors.success : severity === 'warning' ? colors.warning : colors.primary
    }

    const statusTextStyled: TextInput['props']['style'] = {
        position: 'absolute',
        zIndex: 10,
        padding: 2,
        fontSize: 6,
        backgroundColor: severity === 'error' ? colors.error : severity === 'success' ? colors.success : severity === 'warning' ? colors.warning : colors.primary,
        paddingHorizontal: 5,
        right: 0,
        borderRadius: 50,
        transform: [
            { translateY: -4 }
        ]
    }

    if (hidden) return null

    return (
        <View
            style={[barStyled, barStyle]}
            children={<View
                children={<SpanText style={[statusTextStyled]} children={statusText ?? (filled + "%")} />}
                style={fillerStyled} />
            }
        />
    )

}