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
    empty?: boolean
    stretched?: boolean
    explorer?: boolean

    id?: string,
    ownerId?: string, // User who owns the post
    title?: string,
    description?: string,
    fileUrl?: string,
    thumbnailUrl?: string,
    views?: string,
    downloads?: string,
    likes?: string,
    duration?: string, // in seconds
    mimeType?: string,
    sourceQualities?: string, // JSON array of quality options
    locationView?: string, //?:string Location where it can be viewed
    locationDownload?: string, // Location where it can be downloaded
    tags?: string,
    ratings?: string, // Average rating
    price?: string,
    rewards?: string,
    downloadable?: string, // Is the file downloadable?
    playtime?: string
    fileType?: string
    postSlug?: string
    updatedAt?: string
    createdAt?: string
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