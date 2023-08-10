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

    const dirname = `${FS.documentDirectory}naijasync/downloads/`
    const albumName = 'naijaSync';


    useEffect(() => {

        if (libPermision?.status === 'undetermined' && !libPermision.canAskAgain) {
            Alert.alert("Go to setings and allow Naijasync to access medias on your device.")
        }

        if (dirname) {
            try {
                ; (async () => {
                    await FS.makeDirectoryAsync(dirname.concat('videos'), { intermediates: true })
                    await FS.makeDirectoryAsync(dirname.concat('audios'), { intermediates: true })
                    await FS.makeDirectoryAsync(dirname, { intermediates: true })
                    console.log("::: ALL PATH CREATED?!")
                })();
            } catch (error) {
                console.log("ERORR_CREATING_DIRECTORIES: ", error)
            }
        }

        const createAlbumAndAddAssets = async () => {
            try {
                // Read the contents of the source directory
                const videosToMove = await FS.readDirectoryAsync(dirname.concat('videos'));
                const audiosToMove = await FS.readDirectoryAsync(dirname.concat('audios'));
                const existingAlbum = await Library.getAlbumAsync(albumName);
                let initialAsset = null

                const MoveItemsToAlbum = async () => {
                    // Move each file to the album
                    const items = [
                        ...videosToMove,
                        ...audiosToMove
                    ]
                    await Promise.all(items.map(async (fileName) => {
                        const sourceFilePath = `${dirname}${fileName}`;
                        const asset = await Library.createAssetAsync(sourceFilePath);
                        await Library.addAssetsToAlbumAsync([asset], albumName, Platform.OS === 'android')
                    }));
                }

                if (existingAlbum) {
                    //do stuff
                    MoveItemsToAlbum()
                    console.log('ITEMS_MOVED_TO_ALBUM: ')
                } else {
                    if (videosToMove[0])
                        initialAsset = `${dirname.concat('videos')}/${videosToMove[0]}`
                    else if (audiosToMove[0])
                        initialAsset = `${dirname.concat('audios')}/${audiosToMove[0]}`
                    if (!initialAsset)
                        if (Platform.OS !== 'ios')
                            setData('downloads', 'noDownloads', true)
                        else {
                            const album = await Library.createAlbumAsync(albumName);
                            console.log("ALBUM_CREATED_IOS: ", album)
                        }
                    else {
                        const asset = await Library.createAssetAsync(initialAsset);
                        const album = await Library.createAlbumAsync(albumName, asset, false);
                        MoveItemsToAlbum()
                        console.log("ALBUM_CREATED: ", album)
                    }
                }
            } catch (error) {
                console.error('ERROR_OCCURED: ', error);
            }
        };

        if (libPermision?.granted) {
            createAlbumAndAddAssets();
        }
    }, [libPermision])

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

    const createDownload: IUseMediaLibrary['createDownload'] = async (url, filename, fileType, directory) => {
        if (!libPermision.granted) await handleLibPermision()
        let link = url,
            path = `${dirname}${fileType}/${filename}`,
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