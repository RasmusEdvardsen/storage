import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    StorageURL,
    ServiceURL,
    TokenCredential,
} from "@azure/storage-blob";
import { user } from "@/auth/user";

export default async function createFolder(containerName: string, folderName: string ): Promise<number> {
    const tokenCredential = new TokenCredential(await user.accessToken());
    const pipeline = StorageURL.newPipeline(tokenCredential);

    const serviceURL = new ServiceURL(
        `https://storageanarae.blob.core.windows.net`,
        pipeline,
    );

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, folderName + "/dummy.txt");
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    const uploadBlobResponse = await blockBlobURL.upload(
        Aborter.none,
        "",
        0,
    );

    return uploadBlobResponse._response.status;
}
