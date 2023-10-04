import { REQUESTS_API } from "@env";
import { IEndPoints } from "../Interfaces";
import axios from "axios";
import { useAuthContext } from "../Contexts/AuthContext";
import { useDataContext } from "../Contexts/SysContext";
import useStorage from "./useStorage";

export default function useEndpoints(): IEndPoints {

    const base_api = 'http://192.168.185.66:8000/api/v1/' //REQUESTS_API
    const requestUrl = (_path: string) => base_api.concat(_path ?? '')

    const defauld_heads = {
        'Content-Type': 'multipart/form-data',
    }

    const useGetMethod: IEndPoints['useGetMethod'] = (url, data, headers) => axios.get(url, data)
    const usePostMethod: IEndPoints['usePostMethod'] = (url, data, headers) => axios.post(url, data, { headers: { ...defauld_heads, ...headers } })
    const useDeleteMethod: IEndPoints['useDeleteMethod'] = (url, data, headers) => axios.delete(url, { headers: { ...defauld_heads, ...headers } })
    const usePutMethod: IEndPoints['usePutMethod'] = (url, data, headers) => axios.post(url?.concat('?_method=PUT'), data, { headers: { ...defauld_heads, ...headers } })

    return {
        search: requestUrl('search'),
        publication: requestUrl('posts'),
        rewardEarned: requestUrl('post-reward'),
        postViewed: requestUrl('post-viewed'),
        postReacted: requestUrl('post-react'),
        login: requestUrl('login'),
        register: requestUrl('register'),
        logout: requestUrl('logout'),
        accountInfo: requestUrl('account-info'),
        accountPosts: requestUrl('account-posts'),
        accountUpdate: requestUrl('account-update'),
        accountExists: requestUrl('account-exists'),
        sysConfigs: requestUrl('system-configs'),
        requestUrl,
        useGetMethod,
        usePostMethod,
        useDeleteMethod,
        usePutMethod,
    } satisfies IEndPoints
}
