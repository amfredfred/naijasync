import { useColorScheme } from "react-native";
import { IApp } from "../Interfaces";

export default function useThemeColors(): IApp['themeColors']['dark' | 'light'] {

    const currentColorScheme = useColorScheme()

    const schemes: IApp['themeColors'] = {
        dark: {
            background: '#050807',
            headerBackgorund: '#bf0202',
            text: '#EAEAEA',
            primary: '#FF925A',
            secondary: '#FFD17A',
            accent: "#3C6E71",
            sucess: '',
            error: '',
            warning: '',
            background2: '',
            headline: ''
        },
        ligdht: {
            background: '#F0F0FF',
            headerBackgorund: 'honeydew',
            text: '#333333',
            primary: '#FF925A',
            secondary: '#FFBE96',
            accent: "#148587",
            sucess: '',
            error: '',
            warning: '',
            background2: '',
            headline: ''
        }
    }
    return schemes[currentColorScheme]
}