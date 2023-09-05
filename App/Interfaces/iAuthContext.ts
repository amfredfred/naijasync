import { IAppDataContext } from ".";

export type IAuthContextData = {
    isShowingMiniAuthForm?: boolean
    user: {
        isAuthenticated?: boolean,
        profileUri?: string
        accessToken?: string;
        searchRequestValue?: string
        person: "isAuthenticated" | "isOffline" | "isNew" | "hasSkippedAuthentication",

        email?: string
        name?: string
        isEmailVerified?: boolean

        account?: {
            id?: number
            userId?: number
            points?: number
            bankAccountBalance?: number
            profilePics?: string[]
            bio?: string
            gender?: "MALE" | "FEMALE" | "UNKNOWN"
            profileCoverPics?: string[]
            username?: string
            fullName?: string
            following?: number
            followers?: number
        }
    }
}
export type IAuthContextMethods = {
    register?(props: IAppDataContext['authing']): Promise<boolean>
    login?(props: IAppDataContext['authing']): Promise<boolean>
    logout?(): Promise<boolean>
    confirmNumber?(): Promise<boolean>
    skipAuth?(): void
    skipToOnboard?(): void
    showMiniAuthForm?(prop: boolean): void
}