import * as Library from 'expo-media-library'
import { Text } from 'react-native'
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'

export default function UploadStatusFrom() {
    const [libpermission, requestLibPermission] = Library.usePermissions()

    const MediLibrary = (
        <Animated.View>
            <Text>
                STATUS SCREEN
            </Text>
        </Animated.View>
    )



    return (
        <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutLeft}
        >


        </Animated.View>
    )
}