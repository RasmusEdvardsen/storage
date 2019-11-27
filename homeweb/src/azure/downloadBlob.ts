import {
    BlobURL,
    Aborter,
    ServiceURL,
    ContainerURL,
} from "@azure/storage-blob";

import FileSaver from "file-saver";
import getServiceUrl from './serviceUrl';

export default async function downloadBlob(
    containerName: string,
    blobNameFull: string,
    blobName: string,
) {
    const serviceURL: ServiceURL = await getServiceUrl();

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, blobNameFull);
    const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
    const blobBody = await downloadBlockBlobResponse.blobBody;
    if (blobBody) { FileSaver.saveAs(blobBody, blobName); }
}
