import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
import PagerView from 'react-native-pager-view';
import PostItem from '../../__/PostsList/__/PostItem';
import { IPostType } from '../../../Interfaces/IPostContext';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'

interface IAccount {
    postTypes: IPostType['types'],
    screenTabs: "video" | "audio" | "image" | 'article'
}

export default function Account() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()
    const [isRefreshingPost, setisRefreshingPost] = useState(false)
    const [ActiveTab, setActiveTab] = useState<IAccount['screenTabs']>('video')

    const tabs: IAccount['screenTabs'][] = [
        "video", 'audio', 'image', 'article'
    ]

    const posts = useQuery(
        ['user-posts'],
        async () => await axios<IPostItem[]>({
            url: `${REQUESTS_API}account-posts`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authContext?.user?.accessToken}`
            },
        })
    )

    console.log(posts?.data?.data)

    const UserDataDisplay = () => (
        <View style={{ backgroundColor: themeColors?.background }}>
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

    const TabNavigation = (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={[{ backgroundColor: themeColors?.background, height: 40, width: '100%', overflow: 'hidden', marginBottom: 5 }]}
            contentContainerStyle={[styles.spaceBeteen, { minWidth: '100%' }]}>
            <View style={[styles.spaceBeteen, { gap: 20 }]}>
                {tabs?.map(tab => (
                    <TouchableOpacity
                        onPress={() => setActiveTab(tab)}
                        style={[styles.spaceBeteen, styles.tabIndexButton]}>
                        <SpanText style={{ opacity: ActiveTab === tab ? .5 : 1, textTransform: 'uppercase', fontSize: 17 }} >{tab}</SpanText>
                        {!(ActiveTab === tab) ||
                            <Animated.View
                                entering={SlideInDown}
                                exiting={SlideOutDown}
                                style={[styles.tabIndexButtonUnderline, { backgroundColor: themeColors.text, }]} />
                        }
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView
                stickyHeaderHiddenOnScroll
                stickyHeaderIndices={[1]}
                style={{ flex: 1, backgroundColor: themeColors?.background2 }}>
                <UserDataDisplay />
                {TabNavigation}
                {
                    posts?.data?.data?.filter(post => (post.fileType === ActiveTab || post?.fileType.toLocaleLowerCase() === ActiveTab)).map(post => <PostItem {...post} />)
                }
            </ScrollView>
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
    },
    tabIndexButton: {
        height: 40,
        minWidth: 80,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    tabIndexButtonUnderline: {
        height: 6,
        backgroundColor: 'red'
        , borderTopLeftRadius: 50
        , borderTopRightRadius: 50,
        width: '100%',
        position: 'absolute',
        bottom: -1,
        opacity: .5
    }
}); 
