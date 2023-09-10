import { IAppDataContext } from ".";

export type IAuthContextData = {
    isShowingMiniAuthForm?: boolean
    isBusy?: boolean
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
            profilePics?: {
                name: string,
                uri: string,
                type: string
            }[]
            bio?: string
            gender?: "MALE" | "FEMALE" | "UNKNOWN"
            profileCoverPics?: {
                name: string,
                uri: string,
                type: string
            }[]
            username?: string
            fullName?: string
            following?: number
            followers?: number
        }
    }
}
export type IAuthContextMethods = {
    register?(props: IAppDataContext['authing']): void
    login?(props: IAppDataContext['authing']): void
    logout?(): void
    confirmNumber?(): Promise<boolean>
    skipAuth?(): void
    skipToOnboard?(): void
    showMiniAuthForm?(prop: boolean): void
    updateAccount?(props: IAuthContextData['user']['account']): void
}