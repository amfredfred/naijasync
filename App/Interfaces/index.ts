import { IPostType } from './IPostContext'
import { IAuthContextData } from './iAuthContext'
import { IStorageItems, IStorageMethods } from './iUseStorage'

// Interface for themed components
export interface IThemedComponent {
    hidden?: null | boolean
}

// Enumeration for different types of media
export enum IMediaType {
    Video = 'video',
    Audio = 'audio',
    Image = 'image',
    Document = 'document',
    Archive = 'archive',
    Other = 'other',
}

// Interface for defining color schemes
export interface IColors {
    background: string
    headerBackground: string
    text: string
    headline: string
    primary: string
    secondary: string
    accent: string
    success: string
    error: string
    warning: string
    background2: string
}

// Interface for defining themes
export interface ITheme {
    light: IColors
    dark: IColors
}

// Interface for individual post items
export interface IPostItem {
    caption: string
    thumb: string
    src: string
    index?: number
    empty?: boolean
    stretched?: boolean
    explorer?: boolean
    onPress(props: this): void

    // Additional post metadata
    id?: string,
    owner?: IAuthContextData['user']['account'],
    title?: string,
    description?: string,
    fileUrl?: string,
    thumbnailUrl?: string,
    views?: string | number,
    downloads?: string,
    duration?: string,
    mimeType?: string,
    sourceQualities?: {
        original: {
            size: number;
            path: string;
            name: string;
            format: string;
            duration: {
                formatted: string;
                playtime: number;
            }
        }
    }
    locationView?: string,
    locationDownload?: string,
    tags?: string[],
    ratings?: string,
    price?: string,
    rewards?: string,
    downloadable?: string,
    playtime?: string
    fileType?: string
    postSlug?: string
    updatedAt?: string
    createdAt?: string
    puid?: string 
    type: IMediaType
    postType: IPostType['types']

    likes?: number | string
    liked?:boolean
}

// Interface for a list slider component
export interface IListSlider {
    children?: React.ReactNode
    items: IPostItem[]
    headline?: React.ReactNode
}

export interface IAuth {
    stage?: "landing" | "register" | "login" | "confirmPhone" | "confirmPassword";
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    referralCode?: string;
}
export interface IAppStates {
    inAuthState?: boolean;
    isHeaderHidden?: boolean
    isNavigationTabsHiddeh?: boolean
}
export interface IUser {
    isAuthenticated?: boolean;
    accessToken?: string;
}

// Interface for the overall app context
export interface IApp {
    themeColors: ITheme
}

// Type for the app's data context
export type IAppDataContext = IStorageItems
export type IAppDataContextMethods = IStorageMethods