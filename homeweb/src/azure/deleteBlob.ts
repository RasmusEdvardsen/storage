import { ServiceURL, ContainerURL, BlobURL, Aborter } from '@azure/storage-blob';
import getServiceUrl from './serviceUrl';

export default async function deleteBlob(containerName: string, name: string): Promise<number> {
    try {
        const serviceURL: ServiceURL = await getServiceUrl();
        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
        const blobURL = BlobURL.fromContainerURL(containerURL, name);
        const copyBlockBlobResponse = await blobURL.delete(Aborter.none);
        return copyBlockBlobResponse._response.status;
    } catch (error) {
        return 500;
    }
}
