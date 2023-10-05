import { IPostContext, IPostFormMethods } from "../Interfaces/IPostContext";
import { useAuthContext } from "../Contexts/AuthContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Platform, ToastAndroid } from "react-native";
import useEndpoints from "./useEndpoints";
import { getTags } from "../Helpers";
import { AxiosRequestConfig } from "axios";

export default function usePostForm(): { states: IPostContext, methods: IPostFormMethods } {

    const [states, setFormState] = useState({});
    const authContext = useAuthContext()
    const navigation = useNavigation()
    const endpoints = useEndpoints()

    const header = new Object() as AxiosRequestConfig['headers']
    header['Authorization'] = `Bearer ${authContext.user.accessToken}`


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

    const _handlePublicationFiles = async (formData: FormData, _file: any, _fieldName: 'upload' | 'thumbnail', type: string, name: string) => {
        if (_fieldName && _file)
            formData.append(_fieldName, {
                type: type,
                name: name,
                uri: _file
            } as any)
    }

    const _requireAuthenticated = async () => {

    }

    const _handlePublicationStatus = async (publication) => {
        if (publication.status === 'fulfilled') {
            if (Platform.OS === 'android') {
                ToastAndroid.SHORT
                ToastAndroid.show(publication?.value?.data?.message ?? 'success', 2000)
            }
            return publication?.value?.data
        }
        if (publication?.reason?.statusCode === 401) return authContext?.logout()
        console.log(JSON.stringify(publication?.reason?.response?.data?.message))
        if (Platform.OS === 'android') {
            ToastAndroid.SHORT
            ToastAndroid.show(publication?.reason?.response?.data?.message ?? publication?.reason?.message ?? 'something went wrong!!', 2000)
        }
    }

    const _afterPublication = async () => {

    }

    const _handlePublicationFormData = (payload: IPostContext): FormData => {
        const formData = new FormData()
        if (!payload?.file) formData.append('upload', '')
        if (!payload?.thumbnail) formData.append('thumbnail', '')
        Object.keys(payload)?.map(d => {
            if (payload[d] !== null)
                formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
        })
        return formData
    }

    const createPost: IPostFormMethods['createPost'] = async (payload: IPostContext) => {
        _requireAuthenticated()
        const formData = _handlePublicationFormData(payload)
        !payload?.file || _handlePublicationFiles(formData, payload?.file?.uri, 'upload', payload?.file?.type, payload?.file?.name)
        !payload?.thumbnail || _handlePublicationFiles(formData, payload?.thumbnail, 'thumbnail', 'image/*', 'thumbnail.jpg')
        const [publication] = await Promise.allSettled([endpoints.usePostMethod<any>(endpoints?.publication, formData, header)])
        if (navigation?.canGoBack()) navigation?.goBack()
        _handlePublicationStatus(publication)
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        _requireAuthenticated()
        if (payload?.puid) {
            const formData = _handlePublicationFormData(payload)
            formData.append('_method', 'PATCH')
            if (payload?.thumbnail && payload?.thumbnail?.startsWith('file'))
                _handlePublicationFiles(formData, payload?.thumbnail, 'thumbnail', 'image/*', 'thumbnail.jpg')
            if (payload?.file && payload?.file?.uri?.startsWith('file'))
                _handlePublicationFiles(formData, payload.file.uri, 'upload', payload.file.type, payload.file.name)
            // if (navigation?.canGoBack()) navigation?.goBack()
            const [publication] = await Promise.allSettled([endpoints.usePostMethod<any>(endpoints?.publication.concat('/').concat(payload?.puid).concat('?_method=PUT'), formData, header)])
            _handlePublicationStatus(publication)
        }
    }

    const deletePost: IPostFormMethods['deletePost'] = async (payload) => {
        _requireAuthenticated()
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
        _handlePublicationStatus(rewarded)
    }

    const postReact: IPostFormMethods['postReact'] = async (reacted, puid) => {
        const [reaction] = await Promise.allSettled([endpoints.usePostMethod(endpoints.postReacted, { reacted, puid }, header)])
        _handlePublicationStatus(reaction)
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