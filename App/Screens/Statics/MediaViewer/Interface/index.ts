import { RefObject } from 'react';
import { Video, Audio } from 'expo-av';

// Enumeration for different types of media
export enum IMediaType {
    Video = 'video',
    Audio = 'audio',
    Image = 'image',
    Document = 'document',
    Archive = 'archive',
    Other = 'other',
}

export interface IMediaPlayable {
    play(): void
    pause(): void,
    skipNextTo(props: number | 5): void
    skipPrevTo(props: number | 5): void
    remove(): void
    connect?(mediaLnk: string, thumbnailUri?: string, shoupdPlay?: boolean): void
    setMediaState(props: (props: this['states']) => this['states']): void
    handleSeek(props: any): void
    handleLoad(props: any): void;
    handleLoadStart(): void;
    handleError(props: any): void;
    handlePlaybackStatusUpdate(status: any): void;
    handleDownloadItem(uri: string): void
    mediaRef?: React.RefObject<Video>
    source?: string
    mediaPlayableAudioRef?: Audio.SoundObject
    states: {
        playState?: "paused" | "stopped" | "errored" | "ended" | "playing" | 'loading' | 'canPlay' | "seeking",
        progress?: number
        duration?: number
    }
    type: IMediaType
    mode?: "fullscreen" | "collapsed" | "floating" | "hidden"
}



export interface IMediaViewerProvider {
    setMedia(props: { sources: string[], thumbnailUri?: string }): void;
    removeMedia: IMediaPlayable['remove']
    data: {
        sources: string[],
        thumbnailUri: string
    }
}

// Define a common interface for media playable props
export interface IMediaPlayableProps {
    mediaRef: IMediaViewer['media']['mediaRef'];
}

// Define a common type for image media
export type IImageMedia = {
    image: boolean;
}

// Define a common type for exploreable media types
type IExploreableMediaType = IMediaType;

// Define a common interface for media viewer
export type IMediaViewer = {
    data?: {
        sources: string[];
        thumbnailUri?: string;
    };
    media?: IMediaPlayable;
};

// Define a common interface for media viewer options
export interface IMediaViewerOptions {
    mode: "fullscreen" | "collapsed" | "floating" | "hidden";
}