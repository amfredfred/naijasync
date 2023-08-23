import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import useLinkPreview from '../../../Hooks/useLinkPreview';

const PreViewLink = ({ url }: { url: string }) => {
    const previewData = useLinkPreview({
        url, dep: url,
    })
    return (
        <View style={styles.container}>
            {previewData && (
                <View>
                    {previewData.image && (
                        <Image source={{ uri: previewData.image }} style={styles.image} />
                    )}
                    <Text style={styles.title}>{previewData.title}</Text>
                    <Text style={styles.description}>{previewData.description}</Text>
                    {previewData['favicon-180x180'] && (
                        <Image source={{ uri: previewData['favicon-180x180'] }} style={styles.favicon} />
                    )}
                    {previewData.appTitle && (
                        <Text style={styles.appTitle}>{previewData.appTitle}</Text>
                    )}
                    {previewData.firstImage && (
                        <Image source={{ uri: previewData.firstImage }} style={styles.firstImage} />
                    )}
                    {previewData.firstParagraph && (
                        <Text style={styles.firstParagraph}>{previewData.firstParagraph}</Text>
                    )}
                    {previewData.firstAudio && (
                        // <AudioPlayer source={previewData.firstAudio} />
                        <Text>Audio Link: {previewData.firstAudio}</Text>
                    )}
                    {previewData.firstVideo && (
                        // <VideoPlayer source={previewData.firstVideo} />
                        <Text>Video Link: {previewData.firstVideo}</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        marginTop: 4,
    },
    favicon: {
        width: 32,
        height: 32,
        marginTop: 8,
    },
    appTitle: {
        fontSize: 16,
        marginTop: 8,
    },
    firstImage: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    firstParagraph: {
        fontSize: 14,
        marginTop: 8,
    },
});

export default PreViewLink;
