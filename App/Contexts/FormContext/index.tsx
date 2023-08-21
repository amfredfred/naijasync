import React, { createContext, useContext, useState } from 'react';
import PostsForm from '../../Screens/Forms/Post';
import { IPostContext, IPostFormMethods } from '../../Interfaces/IPostContext';

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

    const setData: IPostFormMethods['setData'] = (key, payload) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: payload,
        }));
    };

    const formContextValue = {
        states,
        methods: {
            setData
        }
    }

    return (
        <FormContext.Provider value={formContextValue}>
            {children}
            <PostsForm />
        </FormContext.Provider>
    );
};

