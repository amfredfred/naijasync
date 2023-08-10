import * as Library from 'expo-media-library'
import { IUseMediaLibrary } from '../Interfaces/iUseMediaLibrary'
import * as FS from 'expo-file-system'
import { useEffect, useState } from 'react'
import { Alert, Permission, PermissionsAndroid, Platform } from 'react-native'
import { formatFileSize } from '../Helpers'
import { useDataContext } from '../Contexts/DataContext'

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

    const dirname = `${FS.documentDirectory}naijasync/items/`
    const albumName = 'naijaSync';

    const requestAndSetStorageFolderDirectoryUri = async (dirname: string) => {
        try {
            if (libPermision?.status === 'undetermined' && !libPermision.canAskAgain) {
                const FOLDER_PERMIT = await FS.StorageAccessFramework.requestDirectoryPermissionsAsync(dirname);
                if (FOLDER_PERMIT.granted) {
                    setData('storage', 'storageFolderDirectoryUri', FOLDER_PERMIT.directoryUri);
                }
            }
        } catch (error) {
            console.log("Error while requesting and setting storage folder directory URI: ", error);
        }
    };

    const handleAlbumCreationAndAssetAddition = async (dirname: string, albumName: 'naijaSync') => {
        try {
            let itemsToMove = await FS.readDirectoryAsync(dirname);
            const existingAlbum = await Library.getAlbumAsync(albumName);
            let initialAsset = `${dirname}${itemsToMove[0]}`;

            const moveItemsToAlbum = async () => {
                const movedItems = await Promise.all(itemsToMove.map(async (fileName) => {
                    const sourceFilePath = `${dirname}${fileName}`;
                    // const asset = await Library.createAssetAsync(sourceFilePath);
                    console.log(sourceFilePath);
                    // await Library.addAssetsToAlbumAsync(asset, albumName, Platform.OS === 'android');
                }));
                console.log(movedItems.length, ' ITEMS_MOVED_TO_ALBUM: ', albumName);
            };

            if (!existingAlbum) {
                if (!initialAsset) {
                    if (Platform.OS !== 'ios') {
                        setData('downloads', 'noDownloads', true);
                    } else {
                        const album = await Library.createAlbumAsync(albumName);
                        console.log("ALBUM_CREATED_IOS: ", album);
                    }
                } else {
                    const asset = await Library.createAssetAsync(initialAsset);
                    const album = await Library.createAlbumAsync(albumName, asset, false);
                    itemsToMove = await FS.readDirectoryAsync(dirname);
                    console.log("ALBUM_CREATED: ", album);
                }
            }

            moveItemsToAlbum();
        } catch (error) {
            console.error('ERROR_OCCURED: ', error);
        }
    };

    const ensureDownloadsDirectoryExists = async (dirname: string) => {
        try {
            const downloadsDirectory = await FS.readDirectoryAsync(dirname);
            if (!downloadsDirectory) {
                const createdDirectory = await FS.makeDirectoryAsync(dirname, { intermediates: true });
                setData('storage', 'storageFolderDirectoryUri', dirname);
                console.log(`DOWNLOADS_DIRECTORY: ${createdDirectory} : CREATED`);
            }
        } catch (error) {
            requestAndSetStorageFolderDirectoryUri(dirname)
            console.log("Error while ensuring downloads directory exists: ", error);
        }

        handleAlbumCreationAndAssetAddition(dirname, 'naijaSync')
    };

    useEffect(() => {
        ensureDownloadsDirectoryExists(dirname)
    }, [libPermision, states.storage])

    console.log(states.storage)

    useEffect(() => {
        return () => {
            if (downloadStataus === 'downloading') {
                downloadResumable?.pauseAsync?.();
                setdownloadMessage({})
            }
        };
    }, [downloadStataus]);

    const handleLibPermision = async () => {
        if (!libPermision.granted) {
            await requestLibPermisions()
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
        if (!libPermision.granted) await handleLibPermision()
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

    return {
        createDownload,
        downloadProgreess,
        libPermision,
        requestLibPermisions,
        pauseDownload,
        cancelDownload,
        resumeDownload,
        downloadStataus,
        downloadMessage
    }
}