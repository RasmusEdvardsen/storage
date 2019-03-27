import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    AnonymousCredential,
    StorageURL,
    ServiceURL,
} from '@azure/storage-blob';

export default async function createFolder(
    token: string,
    containerName: string,
    folderName: string,
): Promise<number> {
    const anonymousCredential = new AnonymousCredential();
    const pipeline = StorageURL.newPipeline(anonymousCredential);
    const serviceURL = new ServiceURL(
        `https://storageanarae.blob.core.windows.net${token}`,
        pipeline,
    );

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, folderName + '/dummy.txt');
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    const uploadBlobResponse = await blockBlobURL.upload(
        Aborter.none,
        '',
        0,
    );

    return uploadBlobResponse._response.status;
}
