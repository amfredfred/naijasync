import { IStorageItems, IStorageMethods } from './iUseStorage'

export interface IThemedComponent {
    hidden?: null | boolean
}

export interface IColors {
    background: string
    headerBackgorund: string
    text: string
    headline: string
    primary: string
    secondary: string
    accent: string
    sucess: string
    error: string
    warning: string
    background2: string
}
export interface ITheme {
    light: IColors
    dark: IColors
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

export type IAppDataContext = IStorageItems
export type IAppDataContextMethods = IStorageMethods