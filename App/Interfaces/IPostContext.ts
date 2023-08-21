'use strict'

export interface IPostContext {
    id?: number;
    ownerId?: number;
    title?: string;
    description?: string | null;
    fileUrl?: string;
    thumbnailUrl?: string | null;
    views?: number;
    downloads?: number;
    likes?: number;
    duration?: number | null;
    mimeType?: string;
    fileType?: string;
    postSlug?: string;
    sourceQualities?: string[] | null;
    locationView?: string | null;
    locationDownload?: string | null;
    tags?: string[] | null;
    postGenre?: string[] | null;
    ratings?: number;
    price?: number | null;
    rewards?: number | null;
    downloadable?: boolean;
    playtime?: number;
    createdAt?: string;
    updatedAt?: string;
}

type IPostFormKeys = keyof IPostContext
type PayloadTypes<T extends IPostFormKeys> = IPostContext[T]

export type IPostFormMethods = {
    setData<K extends IPostFormKeys>(item: K, payload: PayloadTypes<K>): void
}
