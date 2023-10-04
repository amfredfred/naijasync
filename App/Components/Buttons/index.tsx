import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { Image, TouchableOpacity, Vibration, Dimensions, View } from 'react-native'
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
    active?: boolean,
    onSelect?(title: string): void
}

export type IIconButton = IButton & ({ image?: Image['props'], size?: number } | { icon?: React.ReactNode })
export type IButtonGradient = IIconButton & {
    gradient: LinearGradient['props']['colors'],
    title: string
}


export const Button = (props: IButton & { title: string }) => {
    const { style, title, children, hidden, textStyle, onLongPress, containerStyle, ...otherProps } = props
    const { accent: color, background } = useThemeColors()
    const styled: IButton['style'] = {
        alignItems: 'flex-start',
        width: '100%',
        // flex: 1,
    }

    const onlongpress = (e: any) => {
        Vibration.vibrate(50)
        onLongPress?.(e)
    }

    return hidden ||
        <ContainerBlock style={[containerStyle]}>
            <TouchableOpacity
                onLongPress={onlongpress}
                style={[styled, style]}
                {...otherProps} >
                {children}
                <SpanText
                    numberOfLines={2}
                    hidden={!title}
                    children={title}
                    style={[{ textTransform: 'uppercase', lineHeight: 25, fontWeight: '400' }, textStyle]}
                />
            </TouchableOpacity>
        </ContainerBlock>
}

export const IconButton = (props: IIconButton) => {
    const { style, title, children, hidden, textStyle, onSelect, onPress, active, containerStyle, ...otherProps } = props
    const { accent: color, background2, primary } = useThemeColors()

    const styled: IButton['style'] = {
        borderRadius: 50,
        overflow: 'hidden',
    }

    const styledContainer: IButton['style'] = {
        minHeight: (props as any)?.size ?? 35,
        padding: title ? 2 : 3,
        backgroundColor: active ? color : background2,
        aspectRatio: !title ? 1 : undefined,
        ...(otherProps.variant === 'contained' ? {
            backgroundColor: primary,
            aspectRatio: 1
        } : otherProps.variant === 'outlined' ? {
            borderWidth: 1,
            borderColor: primary,
            aspectRatio: 1
        } : {
            // backgroundColor: title ? background2 : 'transparent',
            // borderWidth: title ? 1 : 0,
            // borderColor: color,
            paddingHorizontal: title ? 15 : 0
        }),
    };

    const handlePress = (e: any) => {
        onPress?.(e)
        onSelect?.(String(title))
    }

    return !hidden ? <TouchableOpacity
        style={[styled, style]}
        onPress={handlePress}
        {...otherProps} >
        <ContainerSpaceBetween justify="center" style={[styledContainer, containerStyle]}>
            <SpanText hidden={!(props as any)?.icon} style={{ opacity: .7 }} children={(props as any)?.icon} />
            {
                (otherProps as any)?.image?.source && (
                    <Image
                        style={[{ width: (props as any)?.size ?? 40, aspectRatio: 1 }]}
                        {...(otherProps as any).image}
                    />
                )
            }
            <SpanText
                hidden={!title}
                children={title}
                style={[{ textTransform: 'capitalize', paddingRight: (props as any).icon ? 5 : 0, fontSize: 13 }, textStyle]} />
        </ContainerSpaceBetween>
    </TouchableOpacity> : null
}

export const ButtonGradient = (props: IButtonGradient) => {
    const { background2: color } = useThemeColors()
    const { gradient, children, title, containerStyle, ...otherProps } = props
    const { width, height } = Dimensions.get('window')

    const containerStyled: LinearGradient['props']['style'] = {
        borderRadius: 5,
        padding: 10,
        minWidth: width / 3.36,
        maxHeight: width / 5
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={gradient} style={[containerStyled, containerStyle]}>
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
                    style={{ textTransform: 'capitalize', fontSize: 20 }}
                    hidden={!title}
                    children={title} />
            </TouchableOpacity>
        </LinearGradient>
    )

}

export const FancyButton = (props: IButton) => {
    const themeColors = useThemeColors()
    const { children, title, containerStyle, textStyle, style, ...otherProps } = props

    const containerStyled: IContainer['style'] = {
        overflow: 'hidden',
        backgroundColor: themeColors.background2,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        shadowColor: themeColors.text,
    }

    const buttonStyled: IButton['style'] = {
        padding: 7,
        paddingHorizontal: 12, 
    }

    return (
        <TouchableOpacity {...otherProps} style={[containerStyled, containerStyle]}>
            <View  style={[buttonStyled, style]} >
                <SpanText
                    style={[{ textTransform: 'capitalize', fontSize: 18 }, textStyle]}
                    hidden={!title}
                    children={title} />
            </View>
        </TouchableOpacity>
    )

}