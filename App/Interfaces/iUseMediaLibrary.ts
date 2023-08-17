import { Asset, PagedInfo, PermissionResponse  } from "expo-media-library"

type ValidMediaTypes = "video" | "audio" | "photo" | "unknown";

interface MediaInfo {
    albumId: string;
    creationTime: number;
    duration: number;
    filename: string;
    height: number;
    id: string;
    mediaType: "photo" | "video" | "audio";
    modificationTime: number;
    uri: string;
    width: number;
}

interface MediaResponse {
    data: MediaInfo[];
    endCursor: string;
    hasNextPage: boolean;
    totalCount: number;
}

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
    hasDownloadedMedias:boolean
    downloadStataus: "paused" | "finished" | "canceled" | "erorred" | "idle" | "downloading"
    handleLibPermisionsRequest(): void,
    handleAlbumCreationAndAssetAddition(): void
    handleRemoveAssetFromAlbum(assetId:string[]):void
    pauseDownload(): void
    cancelDownload(): void
    resumeDownload(): void
    getMydownloads(items: ValidMediaTypes[]): Promise<Asset[]>
}