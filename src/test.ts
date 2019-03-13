import { get, post } from './web/web';

import {
    AnonymousCredential,
    StorageURL,
    ServiceURL,
    Aborter,
} from '@azure/storage-blob';

export async function homestorage() {
    // const payload = {
    //     container: 'homestorage',
    //     permissions: 'List',
    // };

    // const sasTokenUri = 'https://homestoragefunc.azurewebsites.net/api/SasTokenGenerator';
    // const sasCall = await post(sasTokenUri, payload);
    // if (sasCall.statusCode !== 200 || !sasCall.body) { return; }
    // const sasToken = JSON.parse(sasCall.body).token;

    // const blobstorageUri = 'https://storageanarae.blob.core.windows.net';
    // const containerPropsCall = await get(`${blobstorageUri}/homestorage${sasToken}&restype=container&comp=list`);
    // console.log(containerPropsCall);

    // Use AnonymousCredential when url already includes a SAS signature
    const anonymousCredential = new AnonymousCredential();

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(anonymousCredential);

    // List containers
    const serviceURL = new ServiceURL(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://storageanarae.blob.core.windows.net?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-03-13T15:52:51Z&st=2019-03-13T07:52:51Z&spr=https&sig=vgWWvARpjudkmgkO2rJ8Fi0wtzIomVn6g8r4HkzHsYw%3D`,
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
            console.log(`Container: ${container.name}`);
        }
    } while (marker);
}
