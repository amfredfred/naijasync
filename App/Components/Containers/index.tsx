import useColorSchemes from "../../Hooks/useColorSchemes";
import { IApp, IThemedComponent } from "../../Interfaces";
import { View, ScrollView } from 'react-native'

export type IContainer = View['props'] & IThemedComponent
export type IScrollContainer = ScrollView['props'] & IThemedComponent
export type ContainerSpaceBetween = IContainer & {
    justify?: 'flex-start' | 'center' | 'space-between' | 'flex-end'
    align?: 'center' | 'baseline'
}

export const ContainerFlex = (props: IContainer) => {
    const { style, hidden, ...otherProps } = props
    const { background } = useColorSchemes()
    const styles: IContainer['style'] = {
        backgroundColor: background,
        flex: 1
    }
    return hidden || <View style={[styles, style]} {...otherProps} />
}

export const ContainerBlock = (props: IContainer) => {
    const { style, hidden, ...otherProps } = props
    const { background2 } = useColorSchemes()
    const styles: IContainer['style'] = {
        backgroundColor: background2,
        padding: 10,
    }
    return hidden || <View style={[styles, style]} {...otherProps} />
}

export const ContainerSpaceBetween = (props: ContainerSpaceBetween) => {
    const { style, hidden, justify = 'space-between', align='center', ...otherProps } = props
    const { background2 } = useColorSchemes()
    const styles: IContainer['style'] = {
        backgroundColor: background2,
        padding: 10,
        justifyContent: justify,
        alignItems: align,
        flexDirection:'row'
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