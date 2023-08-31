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
    register?(): Promise<boolean>
    login?(): Promise<boolean>
    logout?(): Promise<boolean>
    confirmNumber?(): Promise<boolean>
    skipAuth?(): void
    skipToOnboard?():void
}