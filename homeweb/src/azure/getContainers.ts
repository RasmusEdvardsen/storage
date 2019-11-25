import {
    StorageURL,
    ServiceURL,
    Aborter,
    TokenCredential,
} from "@azure/storage-blob";
import {
    ServiceListContainersSegmentResponse,
    ContainerItem,
} from "@azure/storage-blob/typings/src/generated/src/models";

import { user } from '../auth/user';

export default async function getContainers(): Promise<ContainerItem[]> {
    try {
        const tokenCredential = new TokenCredential(await user.accessToken());
        const pipeline = StorageURL.newPipeline(tokenCredential);

        const serviceURL = new ServiceURL(
            `https://storageanarae.blob.core.windows.net`,
            pipeline,
        );

        const containers: ContainerItem[] = [];
        let marker: string | undefined = "";
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
