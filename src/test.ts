import { get, post } from './web/web';

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

export async function homestorage(): Promise<ContainerItem[] | 500> {
    const sasTokenUri = 'https://homestoragefunc.azurewebsites.net/api/SasTokenGenerator';
    const sasCall = await get<{ token: string }>(sasTokenUri);
    if (sasCall.statusCode !== 200 || !sasCall.body) { return 500; }
    // Use AnonymousCredential when url already includes a SAS signature
    const anonymousCredential = new AnonymousCredential();

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(anonymousCredential);

    // List containers
    const serviceURL = new ServiceURL(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://storageanarae.blob.core.windows.net${sasCall.body.token}`,
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
        for (const container of (listContainersResponse.containerItems as ContainerItem[])) {
            containers.push(container);
        }
    } while (marker);
    return containers;
}
