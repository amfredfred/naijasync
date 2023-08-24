'use strict'

// useLinkPreview.js
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ILinkPreviewData {
    image?: string;
    title?: string;
    description?: string;
    favicon180x180?: string;
    favicon32x32?: string;
    favicon16x16?: string;
    appTitle?: string;
    firstImage?: string;
    firstParagraph?: string;
    firstAudio?: string;
    firstVideo?: string;
    isFetching?: boolean
    isError?: boolean
    message?: string,
    error?:any
}

interface ILinkPreviewProps {
    onSuccess?(props: ILinkPreviewData): void
    url: string
    enabled: boolean
    dep: any
}


export default function useLinkPreview({ url, dep, enabled, onSuccess }: ILinkPreviewProps): ILinkPreviewData {
    const [previewData, setPreviewData] = useState<ILinkPreviewData>(null);
    const [isValidUrl, setIsValidUrl] = useState(true);

    useEffect(() => {
        if (enabled) {

            const fetchHtmlContent = async () => {
                try {
                    setPreviewData(S => ({ ...S, isFetching: true, isError: false, message: null }));
                    const response = await axios.get(url);
                    const htmlContent = response.data;
                    parseHtmlContent(htmlContent);
                    setPreviewData(S => ({ ...S, isFetching: false, isError: false }));
                } catch (error) {
                    setPreviewData(S => ({ ...S, isFetching: false, isError: true, message: 'Error fetching HTML content: ', error }));
                    console.error('Error fetching HTML content:', error);
                }
                finally {
                    setPreviewData(S => ({ ...S, isFetching: false }));
                }
            };

            const parseHtmlContent = (htmlContent) => {
                const content = {};

                // Define the properties to extract and their corresponding meta tags
                const ogTags = [
                    { property: 'og:title', name: 'title', regex: /<meta\s+[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/i },
                    { property: 'og:description', name: 'description', regex: /<meta\s+[^>]*property="og:description"[^>]*content="([^"]+)"[^>]*>/i },
                    { property: 'og:image', name: 'image', regex: /<meta\s+[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i },
                ];

                // Define the favicon link tags and their corresponding sizes
                const faviconTags = [
                    { size: '180x180', regex: /<link\s+[^>]*rel="apple-touch-icon"[^>]*sizes="180x180"[^>]*href="([^"]+)"[^>]*>/i },
                    { size: '32x32', regex: /<link\s+[^>]*rel="icon"[^>]*type="image\/png"[^>]*sizes="32x32"[^>]*href="([^"]+)"[^>]*>/i },
                    { size: '16x16', regex: /<link\s+[^>]*rel="icon"[^>]*type="image\/png"[^>]*sizes="16x16"[^>]*href="([^"]+)"[^>]*>/i },
                ];

                ogTags.forEach(tag => {
                    const match = htmlContent.match(tag.regex);
                    if (match) {
                        content[tag.name] = match[1];
                    }
                });

                faviconTags.forEach(tag => {
                    const match = htmlContent.match(tag.regex);
                    if (match) {
                        content[`favicon-${tag.size}`] = match[1];
                    }
                });

                // Extract apple-mobile-web-app-title
                const appTitleMatch = htmlContent.match(/<meta\s+[^>]*name="apple-mobile-web-app-title"[^>]*content="([^"]+)"[^>]*>/i);
                if (appTitleMatch) {
                    content['appTitle'] = appTitleMatch[1];
                }

                // Extract the first image and the first paragraph
                const firstImageMatch = htmlContent.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
                const firstParagraphMatch = htmlContent.match(/<span>(.*?)<\/span>/i);

                if (firstImageMatch) {
                    content['firstImage'] = firstImageMatch[1];
                }

                if (firstParagraphMatch) {
                    content['firstParagraph'] = firstParagraphMatch[1];
                }

                // Extract the first embedded audio element or any link ending with audio formats
                const audioRegex = /<audio[^>]*src="([^"]+\.(mp3|wav|ogg|aac))"[^>]*>/i;
                const linkAudioRegex = /<a[^>]*href="([^"]+\.(mp3|wav|ogg|aac))"[^>]*>/i;

                const firstAudioMatch = htmlContent.match(audioRegex) || htmlContent.match(linkAudioRegex);

                if (firstAudioMatch) {
                    content['firstAudio'] = firstAudioMatch[1];
                }

                // Extract the first embedded video element or any link ending with video formats
                const videoRegex = /<video[^>]*src="([^"]+\.(mp4|webm))"[^>]*>/i;
                const linkVideoRegex = /<a[^>]*href="([^"]+\.(mp4|webm))"[^>]*>/i;

                const firstVideoMatch = htmlContent.match(videoRegex) || htmlContent.match(linkVideoRegex);

                if (firstVideoMatch) {
                    content['firstVideo'] = firstVideoMatch[1];
                }

                onSuccess?.(content)
                setPreviewData({ ...content });
            };
            fetchHtmlContent();

            return () => {
                setPreviewData({})
            }
        }

    }, [url, dep, enabled]);

    return previewData;
};