import React, { createContext, useContext, useState } from 'react';
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

    const mutation = useMutation({
        mutationFn: async () => await axios({
            url: `${REQUESTS_API}posts`
        })
    })

    const { toast } = useToast()

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        }));
    };

    const createPost = async (props: IPostContext) => {
        const formData = new FormData()
        if (props?.file)
            formData.append('upload', props?.file?.uri);
        

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
            <PostsForm hidden={!isFormShwon} />
        </FormContext.Provider>
    );
};

