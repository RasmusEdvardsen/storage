import {
    StorageURL,
    ServiceURL,
    ContainerURL,
    Aborter,
    TokenCredential,
} from "@azure/storage-blob";
import {
    BlobItem,
    ContainerListBlobFlatSegmentResponse,
} from "@azure/storage-blob/typings/src/generated/src/models";
import { user } from '@/auth/user';

export default async function getBlobsByContainer(containerName: string): Promise<BlobItem[]> {
    const blobItems: BlobItem[] = [];
    try {
        const tokenCredential = new TokenCredential(await user.accessToken());
        const pipeline = StorageURL.newPipeline(tokenCredential);

        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net`,
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
