import {
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    Aborter,
} from '@azure/storage-blob';
import {
    ServiceListContainersSegmentResponse,
    ContainerItem,
} from '@azure/storage-blob/typings/lib/generated/lib/models';

export default async function getContainers(token: string): Promise<ContainerItem[]> {
    try {
        const anonymousCredential = new AnonymousCredential();
        const pipeline = StorageURL.newPipeline(anonymousCredential);

        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net${token}`,
            pipeline,
        );

        const containers: ContainerItem[] = [];
        let marker: string = '';
        do {
            const listContainersResponse: ServiceListContainersSegmentResponse = await serviceURL.listContainersSegment(
                Aborter.none,
                marker,
            );

            marker = listContainersResponse.nextMarker;
            for (const container of listContainersResponse.containerItems) {
                containers.push(container);
            }
        } while (marker);

        return containers;
    } catch (error) {
        return [];
    }
}
