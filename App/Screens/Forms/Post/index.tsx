import { ContainerBlock } from "../../../Components/Containers";
import { SpanText } from "../../../Components/Texts";
import { useDataContext } from "../../../Contexts/DataContext";
import useThemeColors from "../../../Hooks/useThemeColors";
import { useState, useEffect } from 'react'
import { } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import { REQUESTS_API, APP_NAME } from '@env'
import { useQueries, useMutation, useQuery } from '@tanstack/react-query'
import useAuthStatus from "../../../Hooks/useAuthStatus";

export default function PostsForm() {

    const authStatus = useAuthStatus(null)
    const dataContext = useDataContext()
    const themeColors = useThemeColors()

    const handleOnChangeInputText = async () => {

    }

    const handleOnKeyboardShow = async () => {

    }

    const handleOnKeyboardHide = async () => {

    }

    const handleRequestCreatePost = async () => {

    }

    const handleRequestUpdatePost = async () => {

    }


    return (
        <ContainerBlock>
            <SpanText>
                CREATE  POST
            </SpanText>
        </ContainerBlock>
    )
}