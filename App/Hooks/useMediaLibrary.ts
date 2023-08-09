import * as Library from 'expo-media-library'
import { IUseMediaLibrary } from '../Interfaces/iUseMediaLibrary'
import * as FS from 'expo-file-system'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { formatFileSize } from '../Helpers'

export default function useMediaLibrary(): IUseMediaLibrary {
    const [libPermision, requestLibPermisions] = Library.usePermissions()
    const [downloadResumable, setResumeableDownload] = useState<FS.DownloadResumable>()
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPaused, setisPaused] = useState(false)
    const [downloadMessage, setdownloadMessage] = useState<IUseMediaLibrary['downloadMessage']>()
    const [downloadProgreess, setDownloadProgreess] = useState<IUseMediaLibrary['downloadProgreess']>()

    let dirname = `${FS.documentDirectory}naijasync/downloads/`

    useEffect(() => {
        if (libPermision?.status === 'undetermined' && !libPermision.canAskAgain) {
            Alert.alert("Go to setings and allow Naijasync to access medias on your device.")
        }

        if (dirname) {
            try {
                ; (async () => await FS.makeDirectoryAsync(dirname, { intermediates: true }))();
            } catch (error) {
                console.log(": ERORR", error)
            }
        }
    }, [libPermision])

    useEffect(() => {
        return () => {
            if (isDownloading) {
                downloadResumable.pauseAsync();
                setdownloadMessage({})
            }
        };
    }, [isDownloading]);

    const handleLibPermision = async () => {
        if (!libPermision.granted) {
            await requestLibPermisions()
        }
    }

    const onDownloading = ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        setDownloadProgreess({
            expected: formatFileSize(totalBytesExpectedToWrite),
            written: formatFileSize(totalBytesWritten)  ,
            percent: Number(totalBytesWritten / totalBytesExpectedToWrite)+"%"
        })
    }

    const startDownload = async (Ddata) => {
        setIsDownloading(true)
        return Ddata.downloadAsync()
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
            setIsDownloading(false)
            console.log(uri, ": DOWNLOADED TO")
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not PAUSE download: ".concat(error),
            })
            setIsDownloading(false)
        }

    }

    const pauseDownload = async () => {
        try {
            await downloadResumable.pauseAsync()
            setisPaused(true)
        } catch (error) {
            setdownloadMessage({
                isErorr: true,
                message: "Could not PAUSE download: ".concat(error),
            })
            setIsDownloading(false)
            setisPaused(false)
        }

    }

    const cancelDownload = async () => {
        await downloadResumable.cancelAsync()
        setIsDownloading(false)
        setisPaused(false)
    }
    const resumeDownload = async () => {
        await downloadResumable.resumeAsync()
        setIsDownloading(true)
        setisPaused(false)
    }

    return {
        createDownload,
        downloadProgreess,
        libPermision,
        requestLibPermisions,
        isDownloading,
        pauseDownload,
        cancelDownload,
        resumeDownload,
        isPaused,
        downloadMessage
    }
}