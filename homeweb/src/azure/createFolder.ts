import {
    BlobURL,
    BlockBlobURL,
    Aborter,
    ContainerURL,
    ServiceURL,
} from "@azure/storage-blob";
import getServiceUrl from "./serviceUrl";

export default async function createFolder(containerName: string, folderName: string ): Promise<number> {
    const serviceURL: ServiceURL = await getServiceUrl();

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(containerURL, folderName + "/dummy.txt");
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    const uploadBlobResponse = await blockBlobURL.upload(
        Aborter.none,
        "",
        0,
    );

    return uploadBlobResponse._response.status;
}
