import useColorSchemes from "../../Hooks/useColorSchemes";
import { IApp, IThemedComponent } from "../../Interfaces";
import { View, Text } from 'react-native'

export type ISpanText = Text['props'] & IThemedComponent

export const SpanText = (props: ISpanText) => {
    const { hidden, style, ...otherProps } = props
    const { textColor } = useColorSchemes()

    const styles: ISpanText['style'] = {
        color: textColor,
        fontWeight: '500',
        fontSize: 18
    }

    return hidden || <Text style={[styles, style]} {...otherProps} />
}

export const HeadLine = (props: ISpanText) => {
    const { hidden, style, ...otherProps } = props

    const styles: ISpanText['style'] = {
        textTransform: 'capitalize',
        fontWeight: '900',
        paddingHorizontal: 5,
    }

    return hidden || <SpanText hidden={hidden} style={[styles, style]} {...otherProps} />
}