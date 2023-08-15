import * as Library from 'expo-media-library'
import { IUseMediaLibrary } from '../Interfaces/iUseMediaLibrary'
import * as FS from 'expo-file-system'
import { useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { formatFileSize } from '../Helpers'
import { useDataContext } from '../Contexts/DataContext'
import * as Permissions from 'expo-permissions'
import { APP_ALBUM_NAME } from '@env'

export default function useMediaLibrary(): IUseMediaLibrary {
    const [libPermision, requestLibPermisions] = Library.usePermissions()
    const [downloadResumable, setResumeableDownload] = useState<FS.DownloadResumable>()
    const [downloadMessage, setdownloadMessage] = useState<IUseMediaLibrary['downloadMessage']>()
    const [downloadProgreess, setDownloadProgreess] = useState<IUseMediaLibrary['downloadProgreess']>()
    const [downloadStataus, setDownloadStatus] = useState<IUseMediaLibrary['downloadStataus']>('idle')
    const {
        states,
        setData
    } = useDataContext()

    const dirname = states?.storage?.storageFolderDirectoryUri ?? `${FS.documentDirectory}${APP_ALBUM_NAME}/`
    const albumName = APP_ALBUM_NAME;

    const OpenSettingsToEnablePermissions = async () => {
        if (Platform.OS === 'android') {
            // For Android, open the app's settings page
            await Linking.openSettings();
        } else if (Platform.OS === 'ios') {
            // For iOS, open the app's settings specifically for permission
            await Linking.openURL('app-settings:' + Permissions.getAsync('mediaLibrary'));
        }
    }

    const handleAlbumCreationAndAssetAddition: IUseMediaLibrary['handleAlbumCreationAndAssetAddition'] = async () => {
        try {

            const [itemsToMove, existingAlbum] = await Promise.all([
                FS.readDirectoryAsync(dirname),
                Library.getAlbumAsync(albumName)
            ])

            console.log(itemsToMove, existingAlbum)

            const moveItemsToAlbum = async () => {
                const assets = await Promise.all(itemsToMove.map(async (fileName) => {
                    const sourceFilePath = `${dirname}${fileName}`;
                    const asset = await Library.createAssetAsync(sourceFilePath);
                    return asset;
                }));
                await Library.addAssetsToAlbumAsync(assets, existingAlbum.id, false);
                console.log("======================================================DID WELL=========================")
                // setData('storage', 'myDownloadedAssets', [...assets]);
            };

            if (!existingAlbum) {
                if (Platform.OS === 'ios') {
                    const album = await Library.createAlbumAsync(albumName);
                    console.log("ALBUM_CREATED_IOS:", album);
                } else {
                    const initialAsset = `${dirname}${itemsToMove?.[0]}`;
                    if (initialAsset.indexOf('undefined') >= 0) {
                        setData('storage', 'hasDownloadedMedias', false)
                        console.log("DOWNLOAD SOMETHING FIRST");
                        return false
                    } else {
                        const asset = await Library.createAssetAsync(initialAsset);
                        const album = await Library.createAlbumAsync(albumName, asset, false);
                        console.log("ALBUM_CREATED:", album);
                    }
                    moveItemsToAlbum()
                    setData('storage', 'hasDownloadedMedias', true)
                    return true;
                }
            } else {
                moveItemsToAlbum()
                return true;
            }
        } catch (error) {
            console.error('ERROR_OCCURED: ', error);
            return false;
        }
    };

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

    useEffect(() => {
        ensureDownloadsDirectoryExists()
    }, [libPermision, states?.storage?.storageFolderDirectoryUri === dirname])

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

    const handleLibPermisionsRequest = async () => {
        if (!libPermision?.granted && libPermision?.canAskAgain) {
            await requestLibPermisions()
        } else if (libPermision?.status === 'denied' && !libPermision?.canAskAgain) {
            OpenSettingsToEnablePermissions()
        }
    }

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

    const getMydownloads: IUseMediaLibrary['getMydownloads'] = async (items) => {
        try {
            const album = await Library.getAlbumAsync(albumName);

            if (!album) {
                // throw new Error(`Album "${albumName}" not found.`);
                const createdAlbum = await handleAlbumCreationAndAssetAddition()
                // getMydownloads(items)
                console.log("Created Album", createdAlbum, album, albumName)
            }
            console.log("Created Album", "OUTSIDE_--- ----___ ---", album, albumName)

            const assetOptions = {
                mediaType: items,
                album: album?.id,
            };

            const myassetsResponse = await Library.getAssetsAsync(assetOptions);

            if (myassetsResponse?.assets) {
                return myassetsResponse.assets;
            } else {
                throw new Error('No assets found.');
            }
        } catch (error) {
            console.error('Error in getMydownloads:', error);
            throw error; // Rethrow the error to handle it in the caller function
        }
    };


    return {
        createDownload,
        downloadProgreess,
        libPermision,
        handleLibPermisionsRequest,
        pauseDownload,
        cancelDownload,
        resumeDownload,
        getMydownloads,
        handleAlbumCreationAndAssetAddition,
        downloadStataus,
        downloadMessage
    }
}