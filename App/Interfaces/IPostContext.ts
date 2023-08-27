'use strict'

export interface IPostType {
    types: "ARTICLE" | "STATUS" | "GIF" | "UPLOAD" | "IMPORT";
}

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
    importedLink?:string
}
type PayloadTypes<T extends keyof IPostContext> = IPostContext[T]

type IPostFormRecreate = {

} & IPostContext

type IPostFormEdit = {

} & IPostContext

type IPostFormCreateNew = {

}

type IPostFormTypes = {
    postTypes: "upload" | "edit" | 'recreate',
    upload: IPostFormCreateNew
    recreate: IPostFormRecreate
    edit: IPostFormEdit
}
type IPostFormTypesKeys<K extends IPostFormTypes['postTypes']> = IPostFormTypes[K] | null

export type IPostFormMethods = {
    setData<K extends keyof IPostContext>(item: K, payload: PayloadTypes<K>): void
    createPost(): Promise<IPostContext | null>
    showForm<FT extends IPostFormTypes['postTypes'] | null>(F: FT, payload: IPostFormTypesKeys<FT>): void
}