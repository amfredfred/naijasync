import { TouchableOpacity } from 'react-native'

export interface IThemedComponent {
    hidden?: null | boolean
}

export interface IHeader {
    hidden?: boolean,
    headerToggle?(p: ((s: boolean) => void)): void
}

export interface ITheme {
    light: {
        background: string
        headerBackgorund: string
        textColor: string
        headlineColor: string
        primaryColor: string
        secondaryColor: string
        accentColor: string
        sucessColor: string
        errorColor: string
        warningColor: string
        elevation: number
        borderRadius: number
        background2: string
        opacity: number
    }
    dark: {
        background: string
        headerBackgorund: string
        textColor: string
        headlineColor: string
        primaryColor: string
        secondaryColor: string
        accentColor: string
        sucessColor: string
        errorColor: string
        warningColor: string
        elevation: number
        borderRadius: number
        background2: string
        opacity: number
    }
}

export type IPostItem = {
    caption: string
    thumb: string
    src: string
    index?: number
} & ({
    type: 'video'
} | {
    type: 'audio'
})

export interface IListSlider {
    children?: React.ReactNode
    items: IPostItem[]
    headline?: React.ReactNode
}

export interface IApp {
    themeColors: ITheme
}