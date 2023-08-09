export const formatFileSize = (bytes:number ):string => {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    const digitGroups = Math.floor(Math.log(bytes) / Math.log(base));

    return parseFloat((bytes / Math.pow(base, digitGroups)).toFixed(2)) + ' ' + units[digitGroups];
}

