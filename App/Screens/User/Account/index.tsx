import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import CoverPicExample from '../../../../assets/welcome-background.jpg'
import ProfilePicExample from '../../../../assets/upload-image-icon.png'
import { useState } from 'react'

import { HeadLine, SpanText } from '../../../Components/Texts'
import useThemeColors from '../../../Hooks/useThemeColors'
import { useAuthContext } from '../../../Contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from '../../../Helpers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IPostItem } from '../../../Interfaces';
import { REQUESTS_API } from '@env';
import PostsList from '../../__/PostsList';

export default function Account() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const [isRefreshingPost, setisRefreshingPost] = useState(false)

    const posts = useQuery(
        ['user-posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}user/posts`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            },
        }),
        {
            getNextPageParam: (lastPage) => (lastPage as any).next_page_url,
        }
    )

    console.log(posts?.data?.data)

    const UserDataDisplay = () => (
        <View>
            {authContext?.user?.account?.profileCoverPics ?? [CoverPicExample]?.map(cover => (
                <Animated.Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={typeof cover === 'number' ? cover : { uri: cover as any }} // Provide your cover photo source
                    style={[styles.coverPhoto]}
                />
            ))}
            <View style={[styles.profileData]}>
                {/* Animated Cover Photo */}

                {/* Profile Picture with Custom Frame */}
                <View style={[styles.profileContainerInnerOne,]}>
                    <View style={[styles.profilePicContainer, { backgroundColor: themeColors.background, borderColor: themeColors.background, }]}>
                        <Image
                            source={ProfilePicExample} // Provide your profile picture source
                            style={styles.profilePicture}
                        />
                    </View>
                    <View style={[styles.profilDataFollow, { backgroundColor: themeColors?.background }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <TouchableOpacity style={[styles.spaceBeteen]}>
                                <SpanText style={[styles.smallText, { opacity: .6, textTransform: 'uppercase' }]} children={formatNumber(authContext?.user?.account?.followers ?? 0)} />
                                <SpanText style={[styles.smallText]} children={'followers'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.spaceBeteen]}>
                                <SpanText style={[styles.smallText, { opacity: .6, textTransform: 'uppercase' }]} children={formatNumber(authContext?.user?.account?.followers ?? 0)} />
                                <SpanText style={[styles.smallText]} children={'following'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.spaceBeteen]}>
                                <SpanText style={[styles.smallText, { opacity: .6, textTransform: 'uppercase' }]} children={formatNumber(0)} />
                                <SpanText style={[styles.smallText]} children={'points'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* User Info */}
                <View style={[styles.spaceBeteen, { justifyContent: 'flex-start' }]}>
                    <HeadLine style={[{ color: themeColors?.text }]} children={authContext?.user?.account?.fullName} />
                    <TouchableOpacity style={[styles.spaceBeteen, { justifyContent: 'flex-start', opacity: .7, gap: 0 }]}>
                        <Ionicons size={20} color={themeColors.text} name='at-circle-outline' />
                        <SpanText style={[styles.smallText]} children={authContext?.user?.account?.username} />
                    </TouchableOpacity>
                </View>
                <SpanText style={styles.tagline}>Exploring the world, one step at a time.</SpanText>
            </View>
        </View>
    )

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <PostsList
                ListHeaderComponent={<UserDataDisplay />}
                isRefrehing={isRefreshingPost}
                onRefresh={posts?.refetch}
                list={(posts?.data?.data as any)?.data ?? []} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    profileData: {
        width: '100%',
        padding: 10
    },
    coverPhoto: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    profileContainerInnerOne: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        width: '100%',
        height: 70,
        marginTop: -35,
    },
    profilePicContainer: {
        width: 70,
        padding: 5,
        borderRadius: 50,
        borderWidth: 4,
    },
    profilDataFollow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    profilePicture: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    smallText: {
        fontSize: 12,
        textTransform: 'capitalize'
    },
    tagline: {
        fontSize: 16,
        marginTop: 8,
    },
    themeOptions: {
        // Customize the theme options UI
    },
    widgets: {
        // Customize the widgets UI
    },
    timeline: {
        // Customize the timeline UI
    },
    badges: {
        // Customize the badges UI
    },
    visualStorytelling: {
        // Customize the visual storytelling UI
    },
    emotionTracker: {
        // Customize the emotion tracker UI
    },
    profileSong: {
        // Customize the profile song UI
    },
    virtualGoods: {
        // Customize the virtual goods UI
    },
    arVrIntegration: {
        // Customize the AR and VR integration UI
    },
    spaceBeteen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    }
}); 
