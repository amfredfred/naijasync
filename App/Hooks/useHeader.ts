import { useEffect, useState } from "react";
import GuestHeader from "../Layouts/Guest/Header";
import UserHeader from "../Layouts/User/Header"

export interface IUseHeader {
    isGuestHeaderHidden: boolean
    setisGuestHeaderHidden(p: (s) => boolean): void
    isUSerHeaderHidden: boolean
    setisUSerHeaderHidden(p: (s) => boolean): void
}

export default function useHeader(): IUseHeader {
    const [isGuestHeaderHidden, setisGuestHeaderHidden] = useState(false)
    const [isUSerHeaderHidden, setisUSerHeaderHidden] = useState(false)
    UserHeader({ hidden: isUSerHeaderHidden })
    GuestHeader({ hidden: isGuestHeaderHidden })

    return {
        isGuestHeaderHidden,
        setisGuestHeaderHidden,
        isUSerHeaderHidden,
        setisUSerHeaderHidden,
    }
}