import React, { createContext, useContext, useEffect, useState } from 'react';
import PostsForm from '../../Screens/Forms/Post';
import { IPostContext, IPostFormMethods } from '../../Interfaces/IPostContext';
import { useToast } from '../ToastContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { REQUESTS_API } from '@env';
import { useAuthContext } from '../AuthContext';
import { IPostItem } from '../../Interfaces';

const initialState: IPostContext = {

}

const FormContext = createContext<{
    states?: IPostContext,
    methods?: IPostFormMethods
}>({ states: initialState });

export const usePostFormContext = () => useContext(FormContext);

export default function PostFormProvider({ children }) {
    const [states, setFormState] = useState({});

    const [isFormShwon, setisFormShwon] = useState(false)
    const authContext = useAuthContext()

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
           ( info as any)?.data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            }
        })
    })

    const { toast } = useToast()

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        }));
    };


    useEffect(() => {
        switch (createPostMutation.status) {
            case 'error': {
                // createPostMutation.reset()
                console.log(`Error: ${(createPostMutation?.failureReason as any)?.response?.data?.message}`)
                toast({ message: `Error: ${(createPostMutation?.failureReason as any)?.response?.data?.message}`, severnity: 'error', })
                break
            }
            case 'success': {
                toast({ message: 'Your post is online !!', severnity: 'success' })
                createPostMutation.reset()
                break
            }
            case 'idle': {
                // toast({ message: 'Your post is online !!', })
                break
            }
            case 'loading': {
                toast({ message: 'creating post !!' })
                break
            }
        }
    }, [createPostMutation.status])

    useEffect(() => {
        console.log((updatePostMutation?.failureReason as any)?.response?.data?.message)
        console.log(updatePostMutation?.data?.data)
    }, [updatePostMutation?.status])

    const createPost = async (props: IPostContext) => {
        const formData = new FormData()
        toast({
            message: 'Your post is being created',
        })
        showForm(null, null)
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

        createPostMutation?.mutate(formData as any)
        return {} as any
    }

    const showForm: IPostFormMethods['showForm'] = (form, payload) => {
        setFormState(payload)
        setisFormShwon(Boolean(form))
    }

    const updatePost: IPostFormMethods['updatePost'] = async (payload) => {
        const formData = new FormData()
        await Promise.all(Object.keys(payload)?.map(d => {
            formData.append('liked', typeof payload?.[d] === 'object' ? JSON.stringify(payload?.[d]) : payload?.[d])
        }))
        formData.append('_method', 'PATCH')
        updatePostMutation?.mutate({ data: { 'liked': payload?.liked }, postId: payload?.puid } as any)
    }


    const formContextValue = {
        states,
        methods: {
            setData,
            createPost,
            showForm,
            updatePost
        }
    }

    return (
        <FormContext.Provider value={formContextValue}>
            {children}
            <PostsForm {...{ ...formContextValue.methods, ...formContextValue.states }} hidden={!isFormShwon} />
        </FormContext.Provider>
    );
};

