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

export default function usePostForm(): { states: IPostContext, methods: IPostFormMethods } {
    const [states, setFormState] = useState({});

    const authContext = useAuthContext()
    const dataContext = useDataContext()
    const navigation = useNavigation()

    const AHeaders = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authContext?.user?.accessToken}`
    }

    const createPostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts`,
            info, {
            headers: AHeaders
        })
    })

    const updatePostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts/${(info as any)?.postId}?_method=PUT`,
            (info as any)?.data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            }
        })
    })

    const deletePostMutation = useMutation((info) => {
        return axios.delete(`${REQUESTS_API}posts/${(info as any)?.postId}`, {
            headers: { 'Authorization': `Bearer ${authContext?.user?.accessToken}` },
        })
    })



    const { toast } = useToast()

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        })
        )
    };

    const createPost: IPostFormMethods['createPost'] = async (props: IPostContext) => {
        const formData = new FormData()
        if (props?.file)
            formData.append('upload', {
                type: props.file.type,
                name: props.file.name,
                uri: props.file.uri
            } as any);
        if (props?.thumbnail)
            formData.append('thumbnail', {
                type: 'image/*',
                name: 'thumbnail.jpg',
                uri: props?.thumbnail
            } as any)
        formData.append('description', JSON.stringify(props?.description))
        formData.append('type', props.postType)
        formData.append('tags', JSON.stringify(props?.tags))
        if (navigation?.canGoBack()) {
            navigation?.goBack()
        }

        try {
            const post = await createPostMutation?.mutateAsync(formData as any)
            console.log(post?.status, 'States')
            if (post?.status == 201 || post?.status == 200) {
                toast({ message: 'Nice !!', severity: 'success' })
                createPostMutation.reset()
            } else {
                console.log(post?.data, " : DATA FROM CREATE")
            }
            return post?.data
        } catch (error) {
            if (error?.response?.status === 401) {
                toast({ message: error?.response?.data?.message, severity: 'warning' })
                return authContext?.logout()
            }
        } finally {
            createPostMutation.reset()
        }
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        if (authContext?.user?.person !== 'isAuthenticated') {
            authContext?.logout()
            return
        }
        if (payload?.puid) {
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
            formData.append('_method', 'PATCH')
            // if (navigation?.canGoBack()) {
            //     navigation?.goBack()
            // }
            try {
                const post = await updatePostMutation?.mutateAsync({ data: formData, postId: payload?.puid } as any)
                console.log(post?.status, 'States')
                if (post?.status == 201 || post?.status == 200) {
                    toast({ message: 'Nice !!', severity: 'success' })
                    updatePostMutation.reset()
                } else {
                    console.log(post?.data, " : DATA FROM CREATE")
                }
                return post?.data
            } catch (error) {
                console.log(JSON.stringify(error), ' ERROR REPOSNE')
                if (error?.response?.status === 401) {
                    toast({ message: error?.response?.data?.message, severity: 'warning' })
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
    }

    const postView: IPostFormMethods['postView'] = async (puid) => {
        const [viewed] = await Promise.allSettled([axios.post(
            `${REQUESTS_API}post-viewed`, { puid }, { headers: AHeaders }
        )])
    }

    const postReward: IPostFormMethods['postReward'] = async (rewards, puid) => {
        try {
            const rewarded = await axios.post(`${REQUESTS_API}post-reward`, { rewards, puid }, { headers: AHeaders })
            console.log(rewarded?.data, AHeaders)
            if (rewarded?.status === 200) {
                if (authContext?.user?.person === 'isAuthenticated') {
                    ToastAndroid.BOTTOM
                    ToastAndroid.show(`You earned points`, 10000)
                }
            }
        } catch (error) { 
            console.log(error?.response)
        }
    }
   
    const postReact: IPostFormMethods['postReact'] = async (reacted, puid) => {
        try {
            const reaction = await axios.post(`${REQUESTS_API}post-react`, { reacted, puid }, { headers: AHeaders })
            if (reaction?.status === 200)
                if (Platform.OS === 'android') {
                    ToastAndroid.BOTTOM
                    ToastAndroid.show(`${reacted ? 'Liked' : 'Unlike'}`, 1000)
                }
        } catch (error) { 
            console.log(error?.response?.data)
        }
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