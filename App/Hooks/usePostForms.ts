import { REQUESTS_API } from "@env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IPostContext, IPostFormMethods } from "../Interfaces/IPostContext";
import { useToast } from "../Contexts/ToastContext";
import { useAuthContext } from "../Contexts/AuthContext";
import { useDataContext } from "../Contexts/DataContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function usePostForm(): { states: IPostContext, methods: IPostFormMethods } {
    const [states, setFormState] = useState({});

    const authContext = useAuthContext()
    const dataContext = useDataContext()
    const navigation = useNavigation()

    const createPostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts`,
            info, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            }
        })
    })

    const updatePostMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}posts/${(info as any)?.postId as any}?_method=PUT`,
            (info as any)?.data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            }
        })
    })

    const postViewMutation = useMutation((info) => {
        return axios.post(`${REQUESTS_API}post-viewed`,
            info,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authContext?.user?.accessToken}`
                }
            }
        )
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
                toast({ message: 'Nice !!', severnity: 'success' })
                createPostMutation.reset()
            } else {
                console.log(post?.data, " : DATA FROM CREATE")
            }
            return post?.data
        } catch (error) {
            if (error?.response?.status === 401) {
                toast({ message: error?.response?.data?.message, severnity: 'warning' })
                return authContext?.logout()
            }
        }
    }

    const postView: IPostFormMethods['updatePost'] = async (payload) => {
        const formData = new FormData()
        await Promise.all(Object.keys(payload)?.map(d => {
            formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
        }))
        postViewMutation?.mutate(formData as any)
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        if (payload?.puid) {
            if (authContext?.user?.person !== 'isAuthenticated') {
                authContext?.logout()
                return
            }
            const formData = new FormData()
            await Promise.all(Object.keys(payload)?.map(d => {
                formData.append(d, typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
            }))
            formData.append('_method', 'PATCH')
            updatePostMutation?.mutate({ data: formData, postId: payload?.puid } as any)
        }
    }

    const formContextValue = {
        states,
        methods: {
            setData,
            createPost,
            updatePost,
            postView
        }
    }

    return formContextValue
}; 