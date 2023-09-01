import { IAppDataContext } from ".";

export type IAuthContextData = {
    user: {
        isAuthenticated?: boolean,
        profileUri?: string
        accessToken?: string;
        searchRequestValue?: string
        hasSkippedAuthentication?: boolean
        person: "isAuthenticated" | "isOffline" | "isNew" | "hasSkippedAuthentication",
    }
}
export type IAuthContextMethods = {
    register?(props:IAppDataContext['authing']): Promise<boolean>
    login?(props: IAppDataContext['authing']): Promise<boolean>
    logout?(): Promise<boolean>
    confirmNumber?(): Promise<boolean>
    skipAuth?(): void
    skipToOnboard?():void
}