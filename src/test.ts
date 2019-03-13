import { get, post } from './web/web';

import {
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    Aborter,
} from '@azure/storage-blob';

export async function homestorage() {
    const sasTokenUri = 'https://homestoragefunc.azurewebsites.net/api/SasTokenGenerator';
    const sasCall = await get<{token: string}>(sasTokenUri);
    if (sasCall.statusCode !== 200 || !sasCall.body) { return; }
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

    let marker;
    do {
        const listContainersResponse: any = await serviceURL.listContainersSegment(
            Aborter.none,
            marker,
        );

        marker = listContainersResponse.nextMarker;
        for (const container of listContainersResponse.containerItems) {
            // console.log(`Container: ${container.name}`);
        }
    } while (marker);
}
