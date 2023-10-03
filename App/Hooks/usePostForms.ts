import { REQUESTS_API } from "@env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IPostContext, IPostFormMethods } from "../Interfaces/IPostContext";
import { useToast } from "../Contexts/ToastContext";
import { useAuthContext } from "../Contexts/AuthContext";
import { useDataContext } from "../Contexts/DataContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Platform, ToastAndroid } from "react-native";
import useEndpoints from "./useEndpoints";

export default function usePostForm(): { states: IPostContext, methods: IPostFormMethods } {

    const [states, setFormState] = useState({});
    const authContext = useAuthContext()
    const navigation = useNavigation()
    const endpoints = useEndpoints()

    const AHeaders = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authContext?.user?.accessToken}`
    }

    const createPostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts`, info, { headers: AHeaders })
    })

    const updatePostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts/${(info as any)?.postId}?_method=PUT`, (info as any)?.data, { headers: AHeaders })
    })

    const deletePostMutation = useMutation((info) => {
        return axios.delete(`${REQUESTS_API}posts/${(info as any)?.postId}`, { headers: AHeaders, })
    })

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        })
        )
    };

    const createPost: IPostFormMethods['createPost'] = async (payload: IPostContext) => {
        const formData = new FormData()
        await Promise.all(Object.keys(payload)?.map(d => {
            formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
        }))
        if (payload?.file)
            formData.append('upload', {
                type: payload.file.type,
                name: payload.file.name,
                uri: payload.file.uri
            } as any);
        if (payload?.thumbnail)
            formData.append('thumbnail', {
                type: 'image/*',
                name: 'thumbnail.jpg',
                uri: payload?.thumbnail
            } as any)
        if (navigation?.canGoBack()) {
            navigation?.goBack()
        }
        console.log(endpoints?.publication, 'start')
        const [publication] = await Promise.allSettled([axios.post(endpoints?.publication, formData, { headers: AHeaders })])
        console.log(endpoints?.publication, 'done')
        if (publication.status === 'fulfilled') {
            if (Platform.OS === 'android') {
                ToastAndroid.SHORT
                ToastAndroid.show(publication?.value?.data?.message ?? 'Post published', 2000)
            }
            return publication?.value?.data
        } else if (publication?.status === 'rejected') {
            if (publication?.reason?.statusCode === 401) {
                authContext?.logout()
            }
            else {
                if (Platform.OS === 'android') {
                    console.log(JSON.stringify(publication?.reason))
                    ToastAndroid.SHORT
                    ToastAndroid.show(publication?.reason?.message ?? 'something went wrong!!', 2000)
                }
            }
        }
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        if (authContext?.user?.person !== 'isAuthenticated') {
            authContext?.logout()
            return
        }
        if (payload?.puid) {

            console.log(payload?.thumbnail != null && !payload?.thumbnail?.endsWith('null'), !payload?.thumbnail?.split(payload?.puid)?.[1])

            try {
                const formData = new FormData()
                await Promise.all(Object.keys(payload)?.map(d => {
                    if (!(d === 'file' || d === 'thumbnail'))
                        if (payload?.[d])
                            formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
                }))

                if (payload?.thumbnail != null && !payload?.thumbnail?.endsWith('null'))
                    if (!payload?.thumbnail?.split(payload?.puid)?.[1])
                        formData.append('thumbnail', {
                            type: 'image/*',
                            name: 'thumbnail.jpg',
                            uri: payload?.thumbnail
                        } as any)

                if (payload?.file !== null && payload?.file?.type !== null)
                    if (!payload?.file?.uri?.split(payload?.puid)?.[1])
                        formData.append('upload', {
                            type: payload.file.type,
                            name: payload.file.name,
                            uri: payload.file.uri
                        } as any);

                formData.append('_method', 'PATCH')

                if (navigation?.canGoBack()) {
                    navigation?.goBack()
                }

                const post = await updatePostMutation?.mutateAsync({ data: formData, postId: payload?.puid } as any)
                if (post?.status == 201 || post?.status == 200) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.SHORT
                        ToastAndroid.show(post?.data?.message, 2000)
                    }
                    updatePostMutation.reset()
                } else { }
                return post?.data
            } catch (error) {
                if (error?.response?.status === 401) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.SHORT
                        ToastAndroid.show(error?.response?.data?.message, 2000)
                    }
                    return authContext?.logout()
                }
            }
            finally {
                updatePostMutation.reset()
            }
        }
    }

    const deletePost: IPostFormMethods['deletePost'] = async (payload) => {
        const deleted = await deletePostMutation?.mutateAsync({ postId: payload?.puid } as any)
        if (deleted?.status == 200) {
            if (authContext?.user?.person === 'isAuthenticated') {
                ToastAndroid.BOTTOM
                ToastAndroid.show(`Post deleted`, 2000)
            }
        }
    }

    const postView: IPostFormMethods['postView'] = async (puid) => {
        const [viewed] = await Promise.allSettled([axios.post(endpoints.postViewed, { puid }, { headers: AHeaders })])
    }

    const postReward: IPostFormMethods['postReward'] = async (rewards, puid) => {
        try {
            const rewarded = await axios.post(endpoints.rewardEarned, { rewards, puid }, { headers: AHeaders })
            if (rewarded?.status === 200) {
                if (authContext?.user?.person === 'isAuthenticated') {
                    ToastAndroid.BOTTOM
                    ToastAndroid.show(`You earned points`, 10000)
                }
            }
        } catch (error) { }
    }

    const postReact: IPostFormMethods['postReact'] = async (reacted, puid) => {
        try {
            const reaction = await axios.post(endpoints.postReacted, { reacted, puid }, { headers: AHeaders })
            if (reaction?.status === 200)
                if (Platform.OS === 'android') {
                    ToastAndroid.BOTTOM
                    ToastAndroid.show(`${reacted ? 'Liked' : 'Unlike'}`, 1000)
                }
        } catch (error) { }
    }

    const formContextValue = {
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
    }

    return formContextValue
}; 