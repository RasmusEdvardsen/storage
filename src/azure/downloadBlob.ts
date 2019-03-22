import {
    BlobURL,
    Aborter,
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    ContainerURL,
} from '@azure/storage-blob';

import FileSaver from 'file-saver';

export default async function downloadBlob(
    token: string,
    containerName: string,
    blobNameFull: string,
    blobName: string,
) {
    const anonymousCredential = new AnonymousCredential();
    const pipeline = StorageURL.newPipeline(anonymousCredential);
    const serviceURL = new ServiceURL(
        `https://storageanarae.blob.core.windows.net${token}`,
        pipeline,
    );

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, blobNameFull);
    const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
    const blobBody = await downloadBlockBlobResponse.blobBody;
    // if (blobBody) { FileSaver.saveAs(blobBody, blobName); }
}
