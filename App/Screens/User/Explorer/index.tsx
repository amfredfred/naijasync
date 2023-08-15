import { ContainerBlock, ContainerFlex, ContainerSpaceBetween } from "../../../Components/Containers";
import { SpanText } from "../../../Components/Texts";
import { useEffect } from 'react'
import { BackHandler, FlatList } from 'react-native'
import { useDataContext } from "../../../Contexts/DataContext";
import { IconButton } from "../../../Components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useThemeColors from "../../../Hooks/useThemeColors";
import { Videos } from "../../../dummy-data";
import { IPostItem } from "../../../Interfaces";
import ListSlideItem from "../../Partials/ListSlider/ListSliderItem";



export default function Explorer() {

    const { params } = useRoute()
    const { exploring, genre } = params as any
    const __dummy =

        console.log(params)

    const {
        setData,
        states: { states }
    } = useDataContext()
    const { background, background2 } = useThemeColors()
    const { navigate } = useNavigation()

    const handleBackPress = () => {
        setData('states', 'isHeaderHidden', false)
        return false
    }

    const handleGoBack = () => {
        setData('states', 'isHeaderHidden', false);
        (navigate as any)?.("Home")
    }

    //Effects
    useEffect(() => {
        if (states?.isHeaderHidden) {
            setData('states', 'isHeaderHidden', true);
        }
        const BHND = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
        return () => {
            BHND.remove()
        }
    }, [])


    return (
        <ContainerFlex style={{ padding: 0 }}>
            <ContainerSpaceBetween style={{ padding: 0, height: 45, backgroundColor: background }}>
                <IconButton
                    icon={<Ionicons onPress={handleGoBack} name="arrow-back" size={35} />}
                    containerStyle={{ backgroundColor: 'transparent', gap: 10 }}
                    title={exploring ?? genre}
                    textStyle={{ fontSize: 19, textTransform: 'uppercase' }}
                />
            </ContainerSpaceBetween>
            <FlatList
                data={[...Videos]}
                bouncesZoom={false}
                bounces={false}
                style={{ backgroundColor: background2, }}
                numColumns={3}
                columnWrapperStyle={{
                    paddingHorizontal: 10,
                    gap: 10,
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
                contentContainerStyle={{
                    gap: 10,
                    paddingVertical: 10,
                    justifyContent: 'space-between'
                }}
                renderItem={({ item, index }: { item: IPostItem, index: number }) =>
                    <ListSlideItem
                        key={index}
                        index={index}
                        // stretched={Boolean(index%2)}
                        {...item}
                    />}
                keyExtractor={({ id }) => id}
            />
        </ContainerFlex>
    )
}
