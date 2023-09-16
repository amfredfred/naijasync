import { } from 'react-native'
import { createContext, useContext } from 'react'
import { IMediaViewer, IMediaPlayable, } from '../../Screens/Statics/Interface'
import MediaViewer from '../../Screens/Statics'
import useMediaPlayback from '../../Hooks/usemediaPlayback'

const MediaPlaybackContext = createContext<IMediaPlayable | null>(null)
export const useMediaPlaybackContext = () => useContext(MediaPlaybackContext)

export function MediaViewerProvider({ children }) {

    const mediaPlayback = useMediaPlayback()

    return (
        <MediaPlaybackContext.Provider value={mediaPlayback}  >
            {children}
            <MediaViewer {...mediaPlayback} />
        </MediaPlaybackContext.Provider>
    )
}