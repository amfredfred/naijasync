import { REQUESTS_API } from "@env";
import { IEndPoints } from "../Interfaces";

export default function useEndpoints(): IEndPoints {

    const base_api = REQUESTS_API

    const endpoints: IEndPoints = {
        posts: `${base_api}posts`,
        rewardEarned: `${base_api}post-reward`,
        postViewed: `${base_api}posts`,
        postReacted: `${base_api}post-react`,

        login: `${base_api}authenticate`,
        register: `${base_api}register`,
        userdata: `${base_api}posts`,
    }



    return endpoints
}