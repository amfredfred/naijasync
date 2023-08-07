import useThemeColors from "../../Hooks/useThemeColors";
import { IApp, IThemedComponent } from "../../Interfaces";
import { View, ScrollView, ActivityIndicator, useWindowDimensions, Image } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export type IContainer = View['props'] & IThemedComponent
export type IScrollContainer = ScrollView['props'] & IThemedComponent
export type ContainerSpaceBetween = IContainer & {
    justify?: 'flex-start' | 'center' | 'space-between' | 'flex-end'
    align?: 'center' | 'baseline'
}

export const ContainerFlex = (props: IContainer) => {
    const { style, hidden, ...otherProps } = props
    const { background } = useThemeColors()
    const styles: IContainer['style'] = {
        backgroundColor: background,
        flex: 1
    }
    return hidden || <View style={[styles, style]} {...otherProps} />
}

export const ContainerBlock = (props: IContainer) => {
    const { style, hidden, ...otherProps } = props
    const { background2 } = useThemeColors()
    const styles: IContainer['style'] = {
        backgroundColor: background2,
        padding: 10,
    }
    return hidden || <View style={[styles, style]} {...otherProps} />
}

export const ContainerSpaceBetween = (props: ContainerSpaceBetween) => {
    const { style, hidden, justify = 'space-between', align = 'center', ...otherProps } = props
    const { background2 } = useThemeColors()
    const styles: IContainer['style'] = {
        backgroundColor: background2,
        padding: 10,
        justifyContent: justify,
        alignItems: align,
        flexDirection: 'row',
        maxWidth: '100%',
        overflow: 'hidden'
    }
    return hidden || <View style={[styles, style]} {...otherProps} />
}

export const ScrollContainer = (props: IScrollContainer) => {
    const { children, hidden, style, ...otherProps } = props
    const styled: IScrollContainer['style'] = {

    }

    return hidden || (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={[styled, style]}
            children={
                <ContainerBlock
                    hidden={hidden}
                    style={{ padding: 0 }}
                    children={children}
                />
            }
            {...otherProps}
        />
    )
}

export const Overlay = (props: ActivityIndicator['props'] & IThemedComponent & { imageProps?: Image['props'], imageSource?: string }) => {
    const { hidden, imageProps, imageSource } = props
    const { width } = useWindowDimensions()
    const styled: View['props']['style'] = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    }

    return hidden || <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styled]}>
        {!imageSource ||
            <Animated.Image
                entering={FadeIn}
                exiting={FadeOut}
                style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                resizeMethod="resize"
                resizeMode="cover"
                source={{ uri: imageSource }}
                {...imageProps}
            />
        }
        <ActivityIndicator size={50} color={'red'} style={{ zIndex: 2 }} />
    </Animated.View >

}