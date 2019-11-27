import {
    ServiceURL,
    Aborter,
} from "@azure/storage-blob";
import {
    ServiceListContainersSegmentResponse,
    ContainerItem,
} from "@azure/storage-blob/typings/src/generated/src/models";

import getServiceUrl from './serviceUrl';

export default async function getContainers(): Promise<ContainerItem[]> {
    try {
        const serviceURL: ServiceURL = await getServiceUrl();

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
