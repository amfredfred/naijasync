import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image } from 'react-native';
import useThemeColors from '../../Hooks/useThemeColors';
import FutureIcon from '../../../assets/icons/future-icon.png'
import { useRoute } from '@react-navigation/native';

const ComingSoonComponent = () => {

    const { width, height } = useWindowDimensions()
    const themeColors = useThemeColors()
    const route = useRoute()

    return (
        <View style={[styles.container, { height: height / 2 }]}>
            <View style={[styles.iconContainer, {}]}>
                {/* <Text style={styles.icon}>⏳</Text> */}
                <Image
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={{ width: 120, aspectRatio: 1 }}
                    source={FutureIcon}
                />
            </View>
            <Text style={styles.title}>{route.name} is Coming Soon</Text>
            <Text style={styles.description}>
                {`We are working on something exciting! \nStay tuned for updates.`}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 1500
    },
    iconContainer: {
        borderRadius: 100,
        opacity:.1
    },
    icon: {
        fontSize: 60,
        color: '#fff',
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        color: '#333',
    },
    description: {
        marginTop: 10,
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
    },
});

export default ComingSoonComponent
