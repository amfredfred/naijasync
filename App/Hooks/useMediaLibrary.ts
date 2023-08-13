import * as Library from 'expo-media-library'
import { IUseMediaLibrary } from '../Interfaces/iUseMediaLibrary'
import * as FS from 'expo-file-system'
import { useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { formatFileSize } from '../Helpers'
import { useDataContext } from '../Contexts/DataContext'
import * as Permissions from 'expo-permissions'

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

    const dirname = states?.storage?.storageFolderDirectoryUri ?? `${FS.documentDirectory}naijasync`
    const albumName = 'naijaSync';

    const OpenSettingsToEnablePermissions = async () => {
        if (Platform.OS === 'android') {
            // For Android, open the app's settings page
            await Linking.openSettings();
        } else if (Platform.OS === 'ios') {
            // For iOS, open the app's settings specifically for permission
            await Linking.openURL('app-settings:' + Permissions.getAsync('mediaLibrary'));
        }
    }

    const handleAlbumCreationAndAssetAddition: IUseMediaLibrary['handleAlbumCreationAndAssetAddition'] = async (dirname: string, albumName: 'naijaSync') => {
        try {
            let itemsToMove = await FS.readDirectoryAsync(dirname);
            const existingAlbum = await Library.getAlbumAsync(albumName);
            let initialAsset = `${dirname}${itemsToMove[0]}`;
            const moveItemsToAlbum = async () => {
                const movedItems = await Promise.all(itemsToMove.map(async (fileName) => {
                    const sourceFilePath = `${dirname}${fileName}`;
                    const asset = await Library.createAssetAsync(sourceFilePath);
                    await Library.addAssetsToAlbumAsync(asset, existingAlbum.title);
                    setData('storage', 'myDownloadedAssets', [...states.storage?.[asset.mediaType as string], asset.uri] )
                }));
            };

            if (!existingAlbum) {
                if (!initialAsset) {
                    if (Platform.OS === 'ios') {
                        const album = await Library.createAlbumAsync(albumName);
                        console.log("ALBUM_CREATED_IOS: ", album);
                    } else { }
                } else {
                    const asset = await Library.createAssetAsync(initialAsset);
                    const album = await Library.createAlbumAsync(albumName, asset, false);
                    itemsToMove = await FS.readDirectoryAsync(dirname);
                    console.log("ALBUM_CREATED: ", album);
                }
            }
            console.log(existingAlbum, ": : : : : Alu")
            moveItemsToAlbum();
            return true
        } catch (error) {
            console.error('ERROR_OCCURED: ', error);
            return false
        }
    };

    const ensureDownloadsDirectoryExists = async (dirname: string) => {
        try {
            if (libPermision?.granted) {
                await FS.makeDirectoryAsync(dirname, { intermediates: true });
                setData('storage', 'storageFolderDirectoryUri', dirname);
            } else if (libPermision?.status === 'denied' && !libPermision?.canAskAgain) {
                // requestAndSetStorageFolderDirectoryUri(dirname)
            }
        } catch (error) {
            console.log("FATAL_ERROR_IN_NEXTED: ", error)
        }
        if (libPermision?.granted)
            handleAlbumCreationAndAssetAddition(dirname, 'naijaSync')
    };

    useEffect(() => {
        // ensureDownloadsDirectoryExists(dirname)
    }, [libPermision, states?.storage?.storageFolderDirectoryUri === dirname])

    useEffect(() => {
        return () => {
            if (downloadStataus === 'downloading') {
                downloadResumable?.pauseAsync?.();
                setdownloadMessage({})
            }
            if (downloadStataus === 'finished') {
                handleAlbumCreationAndAssetAddition(dirname, 'naijaSync')
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
            console.log(uri, ": DOWNLOADED TO")
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not finish download: ".concat(error),
            })
            setDownloadStatus('erorred')
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
        const album = await Library.getAlbumAsync(albumName)
        const myassets = await Library.getAssetsAsync({ mediaType: items, album: album.id })
        // setData('storage', 'myDownloadedAssets', myassets.assets)
        return myassets
    }

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