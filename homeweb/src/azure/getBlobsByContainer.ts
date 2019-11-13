import {
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    ContainerURL,
    Aborter,
} from "@azure/storage-blob";
import {
    ServiceListContainersSegmentResponse,
    ContainerItem,
    BlobItem,
    ContainerListBlobFlatSegmentResponse,
} from "@azure/storage-blob/typings/src/generated/src/models";

export default async function getBlobsByContainer(token: string, containerName: string): Promise<BlobItem[]> {
    const blobItems: BlobItem[] = [];
    try {
        const anonymousCredential = new AnonymousCredential();
        const pipeline = StorageURL.newPipeline(anonymousCredential);

        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net${token}`,
            pipeline,
        );

        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);


        let marker: string | undefined = "";
        do {
            const listBlobsResponse: ContainerListBlobFlatSegmentResponse = await containerURL.listBlobFlatSegment(
            Aborter.none,
            marker,
            );

            marker = listBlobsResponse.nextMarker;
            for (const blob of listBlobsResponse.segment.blobItems) {
                blobItems.push(blob);
            }
        } while (marker);

        return blobItems;
    } catch (error) {
        return blobItems;
    }
}
