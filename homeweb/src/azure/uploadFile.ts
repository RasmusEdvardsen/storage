import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    ServiceURL,
} from "@azure/storage-blob";
import { error } from "@/log/log";
import { TransferProgressEvent } from "@azure/ms-rest-js";
import getServiceUrl from "./serviceUrl";

export async function uploadFileWithCallback(
    containerName: string,
    fileName: string,
    file: File,
    cb: (e: TransferProgressEvent) => void,
): Promise<number> {
    try {
        const serviceURL: ServiceURL = await getServiceUrl();
        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
        const blobURL = BlobURL.fromContainerURL(containerURL, fileName);
        const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
        const uploadBlobResponse = await blockBlobURL.upload(
            Aborter.none,
            file,
            file.size,
            {
                blobHTTPHeaders: { blobContentType: file.type },
                progress: cb,
            },
        );
        return uploadBlobResponse._response.status;
    } catch (err) {
        error("error: " + JSON.stringify(err));
        return 500;
    }
}
