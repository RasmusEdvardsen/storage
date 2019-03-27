import { BlobURL, BlockBlobURL, Aborter, ContainerURL, AnonymousCredential, StorageURL, ServiceURL } from '@azure/storage-blob';

export default async function uploadFile(
    token: string,
    containerName: string,
    fileName: string,
    file: File,
): Promise<number> {
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
        {blobHTTPHeaders: {blobContentType: file.type}},
    );

    return uploadBlobResponse._response.status;
}
