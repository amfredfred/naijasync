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

    return hidden || <Text
        style={[styles, style]}
        {...otherProps}
        ellipsizeMode="tail"
    >
        {props.children}
    </Text>
}

export const HeadLine = (props: ISpanText) => {
    const { hidden, style, ...otherProps } = props

    const styles: ISpanText['style'] = {
        textTransform: 'capitalize',
        fontWeight: '900',
    }

    return hidden || <SpanText hidden={hidden} style={[styles, style]} {...otherProps} />
}
export const TextExpandable = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    let pressTimeout;

    const handleOnPress = () => {
        // Check the press duration to determine if it's a long-press or a short press
        pressTimeout = setTimeout(() => {
            // Long press (do nothing)
        }, 200); // Adjust the duration as needed

        setIsExpanded(!isExpanded);
        props?.onPress?.();
    };

    const handleOnLongPress = () => {
        // Clear the pressTimeout to prevent toggling on long-press
        clearTimeout(pressTimeout);
        // Handle long-press here, or leave it empty if you don't want to do anything
    };

    return (
        <SpanText
            hidden={typeof props.children !== 'string'}
            ellipsizeMode="tail"
            selectable
            textBreakStrategy="highQuality"
            numberOfLines={isExpanded ? undefined : 3}
            onPress={handleOnPress}
            onLongPress={handleOnLongPress} // Handle long-press here
            style={[{
                fontSize: 14, fontWeight: '200', lineHeight: 18,
                marginVertical:6
            }, props?.style]}
        >
            {props.children}
        </SpanText>
    );
}