import { Share } from 'react-native';

export interface IShareContent {
    title: string,
    message?: string,
    url: string
}

export default async function ShareContent({ url, title, message }: IShareContent) {
    try {
        const result = await Share.share({
            title: title,
            message: message,
            url: url,
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // Shared successfully
                console.log('Shared successfully');
            } else {
                // Shared successfully
                console.log('Shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            // Share was dismissed
            console.log('Share dismissed');
        }
    } catch (error) {
        // Handle error
        console.error('Error sharing:', error);
    }
};
