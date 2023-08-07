import useColorSchemes from "../../Hooks/useColorSchemes";
import { IApp, IThemedComponent } from "../../Interfaces";
import { TouchableOpacity, Vibration } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween, IContainer } from "../Containers";
import { SpanText } from "../Texts";

export type IBUttonContainer = IContainer
export type IButton = TouchableOpacity['props'] & IThemedComponent & { containerStyle?: ContainerSpaceBetween['style'] }

export const Button = (props: IButton & { title: string }) => {
    const { style, title, children, hidden, onLongPress, containerStyle, ...otherProps } = props
    const { accentColor: color, background } = useColorSchemes()
    const styled: IButton['style'] = {
        flexGrow: 1,
        borderRadius: 10,
    }

    const onlongpress = (e: any) => {
        Vibration.vibrate(50)
        onLongPress?.(e)
    }

    return hidden || <TouchableOpacity
        onLongPress={onlongpress}
        style={[styled, style]}
        {...otherProps} >
        <ContainerBlock style={[containerStyle]}>
            {children}
        </ContainerBlock>
    </TouchableOpacity>
}


export const IconButton = (props: IButton) => {
    const { style, children, hidden, ...otherProps } = props
    const { accentColor: color, background } = useColorSchemes()

    const styled: IButton['style'] = {
        aspectRatio: 1 / 1,
        borderRadius: 50,
        width: 35,
        backgroundColor: background
    }

    return hidden || <TouchableOpacity
        style={[styled, style]}
        {...otherProps} >
        <ContainerSpaceBetween justify="center">
            <SpanText style={{ color  }} children={children} />
        </ContainerSpaceBetween>
    </TouchableOpacity>
}