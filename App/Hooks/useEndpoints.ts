import { REQUESTS_API } from "@env";
import { IEndPoints } from "../Interfaces";

export default function useEndpoints(): IEndPoints {

    const base_api = REQUESTS_API

    return {
        publication: `${base_api}posts`,
        rewardEarned: `${base_api}post-reward`,
        postViewed: `${base_api}post-viewed`,
        postReacted: `${base_api}post-react`,

        login: `${base_api}login`,
        register: `${base_api}register`,
        accountInfo: `${base_api}account-info`,
        accountPosts: `${base_api}account-posts`
    } as IEndPoints
}