import {
    BlobURL,
    Aborter,
    StorageURL,
    ServiceURL,
    ContainerURL,
    TokenCredential,
} from "@azure/storage-blob";

import FileSaver from "file-saver";
import { user } from '@/auth/user';

export default async function downloadBlob(
    containerName: string,
    blobNameFull: string,
    blobName: string,
) {
    const tokenCredential = new TokenCredential(await user.accessToken());
    const pipeline = StorageURL.newPipeline(tokenCredential);

    const serviceURL = new ServiceURL(
        `https://storageanarae.blob.core.windows.net`,
        pipeline,
    );

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, blobNameFull);
    const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
    const blobBody = await downloadBlockBlobResponse.blobBody;
    if (blobBody) { FileSaver.saveAs(blobBody, blobName); }
}
