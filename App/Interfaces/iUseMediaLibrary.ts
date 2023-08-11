import { PermissionResponse } from "expo-media-library"

export interface IUseMediaLibrary {
    createDownload(url: string, filename: string): void
    downloadProgreess: {
        expected: string,
        written: string
        percent: string
    }
    downloadMessage: {
        isErorr?: boolean,
        message?: string
    }
    libPermision: PermissionResponse,
    downloadStataus: "paused" | "finished" | "canceled" | "erorred" | "idle" |"downloading"
    handleLibPermisionsRequest(): void,
    pauseDownload(): void
    cancelDownload(): void
    resumeDownload(): void
}