import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SpanText } from '../Texts';

const DigitalClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const formatTime = (time) => {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <SpanText style={styles.clockText}>{formatTime(currentTime)}</SpanText>
        </View>
    );
};


export default DigitalClock;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    clockText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
