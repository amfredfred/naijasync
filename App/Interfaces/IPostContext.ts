'use strict'

import { IPostItem } from ".";

export interface IPostType {
    types: "ARTICLE" | "STATUS" | "GIF" | "UPLOAD" | "IMPORT";
}

export interface IPostContext {
    title?: string;
    thumbnail?: string,
    file?: {
        size?: number,
        name?: string,
        uri?: string,
        type?: string
    },
    description?: string | null;
    tags?: string[] | null;
    postGenre?: string[] | null;
    price?: number | null;
    downloadable?: boolean;
    postType?: IPostType['types'],
    type?: IPostType['types']
    puid?: string
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
    // 
    createPost(props: IPostContext): void
    updatePost(payload: IPostContext): void
    deletePost(payload: IPostItem): void
    // 
    postView(payload: IPostItem['puid']): void
    postReward(rewardsAmount: number, poatUID: IPostItem['puid']): void
    postReact(reacted: IPostItem['liked'], puid: IPostItem['puid']): void
}