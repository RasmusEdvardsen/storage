import { ServiceURL, ContainerURL, BlobURL, Aborter } from '@azure/storage-blob';
import getServiceUrl from './serviceUrl';

export default async function copyBlob(containerName: string, oldName: string, newName: string): Promise<number> {
    try {
        const serviceURL: ServiceURL = await getServiceUrl();
        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
        const blobURL = BlobURL.fromContainerURL(containerURL, newName);
        const fromBlobURL = BlobURL.fromContainerURL(containerURL, oldName);
        const copyBlockBlobResponse = await blobURL.startCopyFromURL(Aborter.none, fromBlobURL.url);
        return copyBlockBlobResponse._response.status;
    } catch (error) {
        return 500;
    }
}
