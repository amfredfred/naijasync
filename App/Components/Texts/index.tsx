import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { View, Text } from 'react-native'

export type ISpanText = Text['props'] & IThemedComponent

export const SpanText = (props: ISpanText) => {
    const { hidden, style, ...otherProps } = props
    const { text } = useThemeColors()

    const styles: ISpanText['style'] = {
        color: text,
        fontWeight: '500',
        fontSize: 18,
        // fontFamily: 'Montserrat_500Medium',
        textAlignVertical: 'center',
    }

    return hidden || <Text style={[styles, style]} {...otherProps} />
}

export const HeadLine = (props: ISpanText) => {
    const { hidden, style, ...otherProps } = props

    const styles: ISpanText['style'] = {
        textTransform: 'capitalize',
        fontWeight: '900',
    }

    return hidden || <SpanText hidden={hidden} style={[styles, style]} {...otherProps} />
}