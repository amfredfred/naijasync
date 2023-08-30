import React, { createContext, useContext, useEffect, useState } from 'react';
import PostsForm from '../../Screens/Forms/Post';
import { IPostContext, IPostFormMethods } from '../../Interfaces/IPostContext';
import { useToast } from '../ToastContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { REQUESTS_API } from '@env';

const initialState: IPostContext = {

}

const FormContext = createContext<{
    states?: IPostContext,
    methods?: IPostFormMethods
}>({ states: initialState });

export const usePostFormContext = () => useContext(FormContext);

export default function PostFormProvider({ children }) {
    const [states, setFormState] = useState({

    });

    const [isFormShwon, setisFormShwon] = useState(false)

    const mutation = useMutation((info) => {
        return axios({
            url: `${REQUESTS_API}posts`,
            method: 'POST',
            data: info,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    })

    const { toast } = useToast()

    useEffect(() => {
        switch (mutation.status) {
            case 'error': {
                mutation.reset()
                toast({ message: 'Something went wrond, while creating the post 😢', severnity: 'error' })
                break
            }
            case 'success': {
                toast({ message: 'Your post is online !!', severnity: 'success' })
                mutation.reset()
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

        console.log(mutation?.data)

    }, [mutation.status])

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        }));
    };

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
        formData.append('description', props?.description)
        formData.append('type', props.postType)
        formData.append('tags', JSON.stringify(["music", 'videos']))

        mutation?.mutate(formData as any)
        return {} as any
    }

    const showForm: IPostFormMethods['showForm'] = (form, payload) => {
        setFormState(payload)
        setisFormShwon(Boolean(form))
    }


    const formContextValue = {
        states,
        methods: {
            setData,
            createPost,
            showForm
        }
    }

    return (
        <FormContext.Provider value={formContextValue}>
            {children}
            <PostsForm {...{ ...formContextValue.methods, ...formContextValue.states }} hidden={!isFormShwon} />
        </FormContext.Provider>
    );
};

