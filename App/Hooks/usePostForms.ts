import { IPostContext, IPostFormMethods } from "../Interfaces/IPostContext";
import { useAuthContext } from "../Contexts/AuthContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Platform, ToastAndroid } from "react-native";
import useEndpoints from "./useEndpoints";
import { getTags } from "../Helpers";

export default function usePostForm(): { states: IPostContext, methods: IPostFormMethods } {

    const [states, setFormState] = useState({});
    const authContext = useAuthContext()
    const navigation = useNavigation()
    const endpoints = useEndpoints()

    const header = {
        Authorization: `Bearer ${authContext.user.accessToken}`
    }

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        let tags = undefined
        if (key === 'description' || key === 'title')
            tags = getTags(payload as string)
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
            tags
        }))
    };

    const _handlePublicationFiles = async (formData: FormData, _file: any, _fieldName: 'uplaod' | 'thumbnail', type: string, name: string) => (
        formData.append(_fieldName, {
            type: type,
            name: name,
            uri: _file
        } as any)
    )

    const _handlePublicationStatus = async (publication) => {
        if (publication.status === 'fulfilled') {
            if (Platform.OS === 'android') {
                ToastAndroid.SHORT
                ToastAndroid.show(publication?.value?.data?.message ?? 'Post published', 2000)
            }
            return publication?.value?.data
        }
        if (publication?.reason?.statusCode === 401) return authContext?.logout()
        if (Platform.OS === 'android') {
            ToastAndroid.SHORT
            ToastAndroid.show(publication?.reason?.message ?? 'something went wrong!!', 2000)
        }
    }

    const _handlePublicationFormData = (payload: IPostContext): FormData => {
        const formData = new FormData()
        Object.keys(payload)?.map(d => {
            formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
        })
        return formData
    }

    const createPost: IPostFormMethods['createPost'] = async (payload: IPostContext) => {
        const formData = _handlePublicationFormData(payload)
        _handlePublicationFiles(formData, payload.file.uri, 'uplaod', payload.file.type, payload.file.name)
        _handlePublicationFiles(formData, payload?.thumbnail, 'thumbnail', 'image/*', 'thumbnail.jpg')
        if (navigation?.canGoBack()) navigation?.goBack()
        const [publication] = await Promise.allSettled([endpoints.usePostMethod<any>(endpoints?.publication, formData, header)])
        _handlePublicationStatus(publication)
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        if (payload?.puid) {
            const formData = _handlePublicationFormData(payload)
            if (payload?.thumbnail != null && !payload?.thumbnail?.endsWith('null'))
                if (!payload?.thumbnail?.split(payload?.puid)?.[1])
                    _handlePublicationFiles(formData, payload?.thumbnail, 'thumbnail', 'image/*', 'thumbnail.jpg')
            if (payload?.file !== null && payload?.file?.type !== null)
                if (!payload?.file?.uri?.split(payload?.puid)?.[1])
                    _handlePublicationFiles(formData, payload.file.uri, 'uplaod', payload.file.type, payload.file.name)
            if (navigation?.canGoBack()) navigation?.goBack()
            const [publication] = await Promise.allSettled([endpoints.usePutMethod<any>(endpoints?.publication.concat(payload?.puid).concat('?_method = PUT'), formData, header)])
            _handlePublicationStatus(publication)
        }
    }

    const deletePost: IPostFormMethods['deletePost'] = async (payload) => {
        const [deleted] = await Promise.allSettled([endpoints.useDeleteMethod(endpoints.publication, { postId: payload?.puid }, header)])
        if (deleted?.status == 'fulfilled')
            if (authContext?.user?.person === 'isAuthenticated') {
                ToastAndroid.BOTTOM
                ToastAndroid.show(`Post deleted`, 2000)
            }
    }

    const postView: IPostFormMethods['postView'] = async (puid) => {
        const [viewed] = await Promise.allSettled([endpoints.usePostMethod(endpoints.postViewed, { puid }, header)])
    }

    const postReward: IPostFormMethods['postReward'] = async (rewards, puid) => {
        const [rewarded] = await Promise.allSettled([endpoints.usePostMethod(endpoints.rewardEarned, { rewards, puid }, header)])
        if (rewarded?.status === 'fulfilled') {
            if (authContext?.user?.person === 'isAuthenticated') {
                ToastAndroid.BOTTOM
                ToastAndroid.show(`You earned points`, 10000)
            }
        }
    }

    const postReact: IPostFormMethods['postReact'] = async (reacted, puid) => {
        const [reaction] = await Promise.allSettled([endpoints.usePostMethod(endpoints.postReacted, { reacted, puid }, header)])
        if (reaction?.status === 'fulfilled')
            if (Platform.OS === 'android') {
                ToastAndroid.BOTTOM
                ToastAndroid.show(`${reacted ? 'Liked' : 'Unlike'}`, 1000)
            }
    }

    return {
        states,
        methods: {
            setData,
            createPost,
            updatePost,
            postView,
            deletePost,
            postReward,
            postReact
        }
    } satisfies { states: IPostContext, methods: IPostFormMethods }
}; 