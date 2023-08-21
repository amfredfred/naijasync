'use strict'

import { useEffect } from "react"
import { Keyboard as KBD } from "react-native"

export default function useKeyboardEvent({ dep, onShow, onHide }: { dep?: any, onShow(): void, onHide(): void }) {
    useEffect(() => {
        const sw = KBD.addListener('keyboardDidShow', onShow)
        const hd = KBD.addListener('keyboardDidHide', onHide)
        return () => {
            sw.remove()
            hd.remove()
        }
    }, [dep])
}