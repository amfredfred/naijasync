import { useColorScheme } from "react-native";
import { IApp } from "../Interfaces";

export default function useColorSchemes(): IApp['themeColors']['dark' | 'light'] {

    const currentColorScheme = useColorScheme()

    const schemes: IApp['themeColors'] = {
        dark: {
            background: '#050807',
            headerBackgorund:'#bf0202',
            textColor: '#EAEAEA',
            headlineColor: '',
            primaryColor: '#FF925A',
            secondaryColor: '#FFD17A',
            accentColor: "#3C6E71",
            sucessColor: '',
            errorColor: '',
            warningColor: '',
            elevation: 1,
            borderRadius: 1,
            background2: '',
            opacity: 1,
        },
        light: {
            background: '#F0F0FF',
            headerBackgorund:'honeydew',
            textColor: '#333333',
            headlineColor: '',
            primaryColor: '#FF925A',
            secondaryColor: '#FFBE96',
            accentColor: "#148587",
            sucessColor: '',
            errorColor: '',
            warningColor: '',
            elevation: 1,
            borderRadius: 0,
            background2: '',
            opacity: 1,
        }
    }
    return schemes[currentColorScheme]
}