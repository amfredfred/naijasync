import { useColorScheme } from "react-native";
import { IApp } from "../Interfaces";

export default function useThemeColors(): IApp['themeColors']['dark' | 'light'] {

    const currentColorScheme = useColorScheme()

    const schemes: IApp['themeColors'] = {
        dark: {
            background: '#050807',
            headerBackground: '#bf0202',
            text: '#EAEAEA',
            primary: 'turquoise',
            secondary: '#FFA500',
            accent: "amber",
            success: '#81C784',
            error: '#E57373',
            warning: '#FFD54F',
            background2: '#1e1e20', //#1f1e1e
            headline: ''
        },
        light: {
            background: 'white',
            headerBackground: 'white',
            text: '#333333',
            primary: 'turquoise',
            secondary: '#FFA500',
            accent: "amber",
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FFC107',
            background2: '#f2f0f0',
            headline: ''
        }
    }
    return schemes[currentColorScheme]
}