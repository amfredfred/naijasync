import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import AccountHeading from "../../../../Layouts/Account/Heading";
import useThemeColors from "../../../../Hooks/useThemeColors";
import ComingSoonComponent from "../../../../Components/__coming__soon";
import { useMemo } from "react";
import Animated from "react-native-reanimated";
import { useAuthContext } from "../../../../Contexts/AuthContext";
import { HeadLine, SpanText } from "../../../../Components/Texts";
import { Ionicons } from "@expo/vector-icons";
import { formatNumber } from "../../../../Helpers";

export default function DashboardHome() {

    const themeColors = useThemeColors()
    const authContext = useAuthContext()

    const UserDataDisplay = (
        <View style={{ backgroundColor: themeColors?.background }}>
            {authContext?.user?.account?.profileCoverPics?.map(cover => (
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
                            source={{ uri: authContext?.user?.account?.profilePics?.[0] as any }} // Provide your profile picture source
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
                <SpanText style={[styles.tagline, { fontSize: 13, opacity: .6 }]} children={authContext?.user?.account?.bio} />
            </View>
        </View>
    )

    return useMemo(() => (
        <View style={{ backgroundColor: themeColors.background, flex: 1 }}>
            {UserDataDisplay}
            {/* <AccountHeading /> */}
            <ScrollView
                style={{ flex: 1 }}>
                <View style={{}}>
                    <ComingSoonComponent />
                </View>
            </ScrollView>
        </View>
    ), [])
}

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
    spaceBeteen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
}); 