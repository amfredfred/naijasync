import { PermissionResponse } from "expo-media-library"

export interface IUseMediaLibrary {
    createDownload(url: string, filename: string, fileType: "video" | "audio", directory?: string): void
    downloadProgreess: {
        expected: string,
        written: string
        percent: string
    }
    downloadMessage: {
        isErorr?: boolean,
        message?: string
    }
    isDownloading: boolean
    isPaused: boolean
    libPermision: PermissionResponse,
    requestLibPermisions(): Promise<PermissionResponse>,
    pauseDownload(): void
    cancelDownload(): void
    resumeDownload(): void
}