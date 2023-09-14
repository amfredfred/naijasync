import { useState } from "react";
import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { View, Text } from 'react-native'

export type ISpanText = Text['props'] & IThemedComponent
export type ITextExpandable = ISpanText & {

}


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

export const TextExpandable = (props: ITextExpandable) => {
    const [isExpanaded, setisExpanaded] = useState(false)
    const handleOnPressIn = (d) => {
        setisExpanaded(s => !s)
        props?.onPress?.(d)
    }
    return (
        <SpanText
            ellipsizeMode="tail"
            selectable
            textBreakStrategy="highQuality" 
            numberOfLines={isExpanaded ? undefined : 3} {...props} onPress={handleOnPressIn}
            style={[{ fontSize: 14,fontWeight:'200', lineHeight:18 }, props?.style]}
        
        />
    )

}