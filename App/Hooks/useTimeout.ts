import { useEffect } from 'react'

export interface IuseTimeout {
    deps: any[],
    onTimeout(): void
    onClearTimeout(): void
    seconds?: number
}

export default function useTimeout(props: IuseTimeout) {
    useEffect(() => {
        const waitBeforeQuery = setTimeout(() => {
            props.onTimeout()
        }, props.seconds ?? 2000);

        return () => {
            props.onClearTimeout()
            clearTimeout(waitBeforeQuery)
        }
    }, props.deps)
}