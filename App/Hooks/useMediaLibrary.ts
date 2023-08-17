import * as Library from 'expo-media-library'
import { IUseMediaLibrary } from '../Interfaces/iUseMediaLibrary'
import * as FS from 'expo-file-system'
import { useEffect, useState } from 'react'
import { Linking, Platform, Alert } from 'react-native'
import { formatFileSize } from '../Helpers'
import { useDataContext } from '../Contexts/DataContext'
import * as Permissions from 'expo-permissions'
import { APP_ALBUM_NAME } from '@env'
import { PermissionsAndroid } from 'react-native';

export default function useMediaLibrary(): IUseMediaLibrary {

    const dirname = `${FS.documentDirectory}${APP_ALBUM_NAME}/`
    const albumName = APP_ALBUM_NAME;

    const [libPermision, requestLibPermisions] = Library.usePermissions()
    const [downloadResumable, setResumeableDownload] = useState<FS.DownloadResumable>()
    const [downloadMessage, setdownloadMessage] = useState<IUseMediaLibrary['downloadMessage']>()
    const [downloadProgreess, setDownloadProgreess] = useState<IUseMediaLibrary['downloadProgreess']>()
    const [downloadStataus, setDownloadStatus] = useState<IUseMediaLibrary['downloadStataus']>('idle')

    //
    const [hasDownloadedMedias, setHasDownloadedMedias] = useState(false)

    const handleRemoveAssetFromAlbum: IUseMediaLibrary['handleRemoveAssetFromAlbum'] = async (assetId) => {
        try {
            const removeAssetOrAssets = async () => {
                const album = await Library.getAlbumAsync(albumName)
                const deleted = await Library.removeAssetsFromAlbumAsync(assetId, album.id);
                if (deleted)
                    getMydownloads(['audio', 'photo', 'video', 'unknown'])
                console.log('Asset removed from album successfully');
            }
            Alert.alert(
                "DELETE ITEM",
                "Are you sure you want to delete this ietm?",
                [
                    { text: "Delete", onPress: removeAssetOrAssets },
                    { text: "cancel", onPress: () => true }
                ]
            )

        } catch (error) {
            console.error('Error removing asset from album:', error);
        }
    };

    const handleAlbumCreationAndAssetAddition: IUseMediaLibrary['handleAlbumCreationAndAssetAddition'] = async () => {
        try {
            const [itemsToMove, existingAlbum] = await Promise.all([
                FS.readDirectoryAsync(dirname),
                Library.getAlbumAsync(albumName),
            ]);

            if (!existingAlbum) {
                const isIOS = Platform.OS === 'ios';
                if (isIOS) {
                    const album = await Library.createAlbumAsync(albumName);
                    console.log("ALBUM_CREATED_IOS:", album);
                    return !album;
                } else {
                    const initialAsset = `${dirname}${itemsToMove?.[0]}`;
                    if (initialAsset.indexOf('undefined') >= 0) {
                        setHasDownloadedMedias(false);
                        console.log("DOWNLOAD SOMETHING FIRST");
                        return false;
                    } else {
                        console.log(initialAsset, "INITIAL ASSET");
                        const asset = await Library.createAssetAsync(initialAsset);
                        console.info(asset, "ASSET CREATED");
                        const album = await Library.createAlbumAsync(albumName, asset, false);
                        console.log("ALBUM_CREATED:", album);
                    }
                }
            }

            const assetsInAlbum = await Library.getAssetsAsync({
                album: existingAlbum?.id,
                mediaType: ['audio', 'photo', 'unknown', 'video'],
            });

            const addedAssets = assetsInAlbum.assets.map(item => item.filename);
            const assestsToMove = [];

            for (const fileName of itemsToMove) {
                const sourceFilePath = `${dirname}${fileName}`;
                try {
                    if (!addedAssets.includes(fileName)) {
                        const asset = await Library.createAssetAsync(sourceFilePath);
                        assestsToMove.push(asset.id);
                    } else {
                        console.info(fileName, ": ALREADY ADDED");
                    }
                } catch (error) {
                    console.log("ERROR_CREATING_ASSETS");
                }
            }

            try {
                if (assestsToMove.length > 0) {
                    await Library.addAssetsToAlbumAsync(assestsToMove, existingAlbum?.id);
                }
            } catch (error) {
                console.log("ERROR_MOVING_ITEMS_TO_STORAGE", error);
            }

            return true;
        } catch (error) {
            console.error('ERROR_OCCURED: ', error);
            return false;
        }
    };

    const getMydownloads: IUseMediaLibrary['getMydownloads'] = async (items) => {
        if (!libPermision.granted) {
            console.log("READ_MEDIAS_PERMISSION_NOT_GRANTED!!")
            await requestLibPermisions()
        }
        try {
            const album = await Library.getAlbumAsync(albumName);
            handleAlbumCreationAndAssetAddition()
            if (album?.id) {
                const myassetsResponse = await Library.getAssetsAsync({
                    mediaType: items,
                    album: album?.id,
                });
                if (myassetsResponse?.assets) {
                    setHasDownloadedMedias(true)
                    return myassetsResponse.assets;
                } else {
                    setHasDownloadedMedias(false)
                    // throw new Error('No assets found.');
                }
            } else {
                console.log(`Album ${albumName} not found!`)
                // throw new Error(`Album ${albumName} not found!`);
            }

        } catch (error) {
            console.error('Error in getMydownloads:', error);
            throw error; // Rethrow the error to handle it in the caller function
        }
    };

    const handleLibPermisionsRequest = async () => {
        if (!libPermision?.granted && libPermision?.canAskAgain) {
            await requestLibPermisions()
        } else if (libPermision?.status === 'denied' && !libPermision?.canAskAgain) {
            OpenSettingsToEnablePermissions()
        }
    }

    const OpenSettingsToEnablePermissions = async () => {
        if (Platform.OS === 'android') {
            // For Android, open the app's settings page
            await Linking.openSettings();
        } else if (Platform.OS === 'ios') {
            // For iOS, open the app's settings specifically for permission
            await Linking.openURL('app-settings:' + Permissions.getAsync('mediaLibrary'));
        }
    }

    const ensureDownloadsDirectoryExists = async () => {
        try {
            if (libPermision?.granted) {
                await FS.makeDirectoryAsync(dirname, { intermediates: true });
                // setData('storage', 'storageFolderDirectoryUri', dirname);
            } else if (libPermision?.status === 'denied' && !libPermision?.canAskAgain) {
                // requestAndSetStorageFolderDirectoryUri(dirname)
            }
        } catch (error) {
            console.log("FATAL_ERROR_IN_NEXTED: ", error)
        }
        // if (libPermision?.granted)
        //     handleAlbumCreationAndAssetAddition(dirname, 'naijaSync')
    };

    const onDownloading = ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        setDownloadProgreess({
            expected: formatFileSize(totalBytesExpectedToWrite),
            written: formatFileSize(totalBytesWritten),
            percent: Number(totalBytesWritten / totalBytesExpectedToWrite) + "%"
        })
    }

    const startDownload = async (Ddata) => {
        setDownloadStatus('downloading')
        return Ddata?.downloadAsync?.()
    }

    const createDownload: IUseMediaLibrary['createDownload'] = async (url, filename) => {
        if (!libPermision?.granted) await handleLibPermisionsRequest()
        let link = url,
            path = `${dirname}${filename}`,
            dData = downloadResumable
        try {
            dData = FS.createDownloadResumable(link, path, {}, onDownloading)
            setResumeableDownload(dData)
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not CREATE download: ".concat(error),
            })
        }

        if (!dData) return setdownloadMessage({
            isErorr: true,
            message: "Download Resumeable Is Undefined"
        })

        try {
            const { uri } = await startDownload(dData)
            setDownloadStatus('finished')
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not finish download: ".concat(error),
            })
            setDownloadStatus('erorred')
        }
        finally {
            setDownloadStatus('idle')
        }
    }

    const pauseDownload = async () => {
        try {
            await downloadResumable.pauseAsync()
            setDownloadStatus('paused')
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not PAUSE download: ".concat(error),
            })
            setDownloadStatus('erorred')
        }
    }
    const cancelDownload = async () => {
        await downloadResumable.cancelAsync()
        setDownloadStatus('canceled')
    }
    const resumeDownload = async () => {
        await downloadResumable.resumeAsync()
        setDownloadStatus('downloading')
    }

    useEffect(() => {
        ensureDownloadsDirectoryExists()
    }, [libPermision])

    useEffect(() => {
        if (downloadStataus === 'finished') {
            handleAlbumCreationAndAssetAddition()
        }

        return () => {
            if (downloadStataus === 'downloading') {
                downloadResumable?.pauseAsync?.();
                setdownloadMessage({})
            }
        };
    }, [downloadStataus]);



    async function requestExternalStoragePermission() {
        console.log("ACLAE FOR ER")
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'App needs access to external storage to copy files.',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage permission granted.');
            } else {
                console.log('Storage permission denied.');
            }
            console.log(" ALREADY")
        } catch (error) {
            console.error('Error requesting storage permission:', error);
        }
    }



    return {
        createDownload,
        downloadProgreess,
        libPermision,
        hasDownloadedMedias,
        handleLibPermisionsRequest,
        handleRemoveAssetFromAlbum,
        pauseDownload,
        cancelDownload,
        resumeDownload,
        getMydownloads,
        handleAlbumCreationAndAssetAddition,
        downloadStataus,
        downloadMessage
    }
}