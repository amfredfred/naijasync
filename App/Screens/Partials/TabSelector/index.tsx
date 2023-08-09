import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ButtonGradient } from "../../../Components/Buttons";
import { ContainerBlock, ContainerSpaceBetween, ScrollContainer } from "../../../Components/Containers";

export default function TabSelector({ hidden }: { hidden?: boolean }) {

    if (hidden) return null

    return (
        <ContainerSpaceBetween style={{ gap:10, flexWrap:'wrap' }}>
                <ButtonGradient
                    gradient={['#89CFF0', '#0072B5']}
                    icon={<MaterialIcons size={40} name="file-download-done" />}
                    title={"downloads"}
                />
                <ButtonGradient
                    gradient={['#155E63', '#4B8D5B']}
                    icon={<MaterialIcons size={40} name="new-releases" />}
                    title={"Recent"}
                />
                <ButtonGradient
                    gradient={['#A90000', '#FF4B4B']}
                    icon={<MaterialIcons size={40} name="favorite" />}
                    title={"Favourites"}
                />


                <ButtonGradient
                    gradient={['#155E63', '#4B8D5B']}
                    icon={<MaterialIcons size={40} name="new-releases" />}
                    title={"Recent"}
                />
                <ButtonGradient
                    gradient={['#A90000', '#FF4B4B']}
                    icon={<MaterialIcons size={40} name="favorite" />}
                    title={"Favourites"}
                />


                <ButtonGradient
                    gradient={['#155E63', '#4B8D5B']}
                    icon={<MaterialIcons size={40} name="new-releases" />}
                    title={"Recent"}
                />
                <ButtonGradient
                    gradient={['#A90000', '#FF4B4B']}
                    icon={<MaterialIcons size={40} name="favorite" />}
                    title={"Favourites"}
                />
        </ContainerSpaceBetween>
    )
}