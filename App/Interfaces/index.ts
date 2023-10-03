import { Axios, AxiosHeaderValue, AxiosHeaders, AxiosPromise } from 'axios'
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
    caption?: string
    onPress?(props: this): void

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
    rewards?: string | number,
    downloadable?: string,
    playtime?: string
    fileType?: string
    postSlug?: string
    updatedAt?: string
    createdAt?: string
    puid?: string
    type?: IMediaType
    postType?: IPostType['types']

    likes?: number | string
    liked?: boolean
}

// Interface for a list slider component
export interface IListSlider {
    children?: React.ReactNode
    items: IPostItem[]
    headline?: React.ReactNode
    screen?: 'video' | 'audio' | 'image'
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



// interface EndPoints
export interface IEndPoints {
    search: string
    /** @description the publication endpoint is used to create/delete/update and view posts/post */
    publication: string,
    /** @description when a post is viewed, this endpoint is used to increment the view in database */
    postViewed: string
    /** @description when a post is liked/disliked, this endpoint is used to toggle this action */
    postReacted: string
    /** @description when a user/post earn reward by watching rewarded ads, this endpoint is used to update this action */
    rewardEarned: string
    /** @description this endpoint is used to register new user */
    register: string
    /** @description this endpoint is used to login a user using email/username/phone and his/her password */
    login: string
    /** @description this endpoint is used to fetch user data using his/her API TOKEN, */
    accountInfo: string
    /** @description intends to fetch the current user's posts using his/her API TOKEN, */
    accountPosts: string
    /** @description intends to update the current user's accountwith a POST method and data passed, see ./iAuthContext->IAuthContextData['user']['account'] */
    accountUpdate: string
    /** 
     * @description intends to find a user based on email/username/phone passed using a GET method
     * @returns ['exists' => true | false, 'account'=> /iAuthContext->IAuthContextData['user']['account'] | null ]
    */
    accountExists: string
    // 
    logout: string
    /** @description intends to fetch the current system configurations managed by super admin*/
    sysConfigs: string
    // 
    requestUrl(_path?: string): string
    // 
    usePutMethod(url: string, data?: { [key: string]: string | number | Object }, headers?:  AxiosHeaders): AxiosPromise
    useGetMethod: this['usePutMethod']
    usePostMethod: this['usePutMethod']
    useDeleteMethod: this['usePutMethod']
}