import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { Image, TouchableOpacity, Vibration, Dimensions } from 'react-native'
import { ContainerBlock, ContainerSpaceBetween, IContainer } from "../Containers";
import { ISpanText, SpanText } from "../Texts";
import { LinearGradient } from 'expo-linear-gradient';

export type IBUttonContainer = IContainer
export type IButton = TouchableOpacity['props'] & IThemedComponent & {
    containerStyle?: ContainerSpaceBetween['style']
    textStyle?: ISpanText['style']
    title?: React.ReactNode
    color?: "primary" | "secondary"
    variant?: "outlined" | "contained"
    severity?: "error" | "success" | "warning" | "info"
}

export type IIconButton = IButton & ({ image: Image['props'], size?: number } | { icon: React.ReactNode })
export type IButtonGradient = IIconButton & {
    gradient: LinearGradient['props']['colors'],
    title: string
}


export const Button = (props: IButton & { title: string }) => {
    const { style, title, children, hidden, onLongPress, containerStyle, ...otherProps } = props
    const { accent: color, background } = useThemeColors()
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

export const IconButton = (props: IIconButton) => {
    const { style, title, children, hidden, ...otherProps } = props
    const { accent: color, background, primary } = useThemeColors()

    const styled: IButton['style'] = {
        borderRadius: 50,
        overflow: 'hidden',
    }

    const styledContainer: IButton['style'] = {
        minHeight: (props as any)?.size ?? 35,
        borderRadius: 50,
        aspectRatio: 1,
        padding: 2,
        ...(otherProps.variant === 'contained' ? {
            backgroundColor: primary,
        } : otherProps.variant === 'outlined' ? {
            borderWidth: 1,
            borderColor: primary,
        } : { backgroundColor: 'transparent' }),
    };

    return !hidden ? <TouchableOpacity
        style={[styled, style]}
        {...otherProps} >
        <ContainerSpaceBetween justify="center" style={[styledContainer]}>
            <SpanText hidden={!(props as any)?.icon} style={{ color }} children={(props as any)?.icon} />
            {
                (otherProps as any)?.image?.source && (
                    <Image
                        style={[{ width: (props as any)?.size ?? 40, aspectRatio: 1 }]}
                        {...(otherProps as any).image}
                    />
                )
            }
        </ContainerSpaceBetween>
    </TouchableOpacity> : null
}

export const ButtonGradient = (props: IButtonGradient) => {
    const { background2: color } = useThemeColors()
    const { gradient, children, title, ...otherProps } = props
    const { width, height } = Dimensions.get('window')

    const containerStyle: LinearGradient['props']['style'] = {
        borderRadius: 5,
        padding: 10,
        minWidth: width / 3.36,
        maxHeight: width / 5
    }


    return (
        <LinearGradient colors={gradient} style={[containerStyle]}>
            <TouchableOpacity {...otherProps}>
                <SpanText
                    hidden={!(props as any)?.icon}
                    style={{ color }}
                    children={(props as any)?.icon} />
                {
                    (otherProps as any)?.image?.source && (
                        <Image
                            style={[{ width: (props as any)?.size ?? 30, aspectRatio: 1 }]}
                            {...(otherProps as any).image}
                        />
                    )
                }
                <SpanText
                    style={{ textTransform: 'capitalize', color }}
                    hidden={!title}
                    children={title} />
            </TouchableOpacity>
        </LinearGradient>
    )

}