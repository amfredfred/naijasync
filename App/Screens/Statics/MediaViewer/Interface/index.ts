import { RefObject } from 'react';
import { Video, Audio } from 'expo-av';
import { IPostItem } from '../../../../Interfaces';

// Enumeration for different types of media
export enum IMediaType {
    Video = 'video',
    Audio = 'audio',
    Image = 'image',
    Document = 'document',
    Archive = 'archive',
    Other = 'other',
}

export interface IMediaPlayable extends IPostItem {
    play(): void
    pause(): void,
    skipNextTo(props: number | 5): void
    skipPrevTo(props: number | 5): void
    remove(): void
    connect?(props: IPostItem): void
    setMediaState(props: (props: this['states']) => this['states']): void
    handleSeek(props: any): void
    handleLoad(props: any): void;
    handleLoadStart(): void;
    handleError(props: any): void;
    handlePlaybackStatusUpdate(status: any): void;
    handleDownloadItem(uri: string): void
    mediaRef?: React.RefObject<Video>
    mediaPlayableAudioRef?: Audio.SoundObject
    states: {
        playState?: "paused" | "stopped" | "errored" | "ended" | "playing" | 'loading' | 'canPlay' | "seeking" | "shouldPlay"
        progress?: number
        duration?: number
    }
    type: IMediaType
    mode?: "fullscreen" | "collapsed" | "floating" | "hidden",
    previewing?: boolean
}



export interface IMediaViewerProvider extends IMediaPlayable {
    setMedia(props: IPostItem): void;
    removeMedia: IMediaPlayable['remove']
}

// Define a common type for image media
export type IImageMedia = {
    image: boolean;
}

// Define a common interface for media viewer
export type IMediaViewer = IPostItem & {
    media?: IMediaPlayable;
    presenting: boolean
};

// Define a common interface for media viewer options
export interface IMediaViewerOptions {
    mode: "fullscreen" | "collapsed" | "floating" | "hidden";
}