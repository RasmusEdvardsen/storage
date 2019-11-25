import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    TokenCredential,
} from "@azure/storage-blob";
import { error } from "@/log/log";
import { TransferProgressEvent } from "@azure/ms-rest-js";
import { user } from "@/auth/user";

export default async function uploadFile(
    token: string,
    containerName: string,
    fileName: string,
    file: File,
): Promise<number> {
    try {
        const anonymousCredential = new AnonymousCredential();
        const pipeline = StorageURL.newPipeline(anonymousCredential);
        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net${token}`,
            pipeline,
        );
        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
        const blobURL = BlobURL.fromContainerURL(containerURL, fileName);
        const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
        const uploadBlobResponse = await blockBlobURL.upload(
            Aborter.none,
            file,
            file.size,
            { blobHTTPHeaders: { blobContentType: file.type } },
        );
        return uploadBlobResponse._response.status;
    } catch (err) {
        error("error: " + JSON.stringify(err));
        return 500;
    }
}

export async function uploadFileWithCallback(
    containerName: string,
    fileName: string,
    file: File,
    cb: (e: TransferProgressEvent) => void,
): Promise<number> {
    try {
        const tokenCredential = new TokenCredential(await user.accessToken());
        const pipeline = StorageURL.newPipeline(tokenCredential);

        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net`,
            pipeline,
        );
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
